import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './entity-with-service-class-pagination-and-dto.reducer';
import { IEntityWithServiceClassPaginationAndDTO } from 'app/shared/model/entity-with-service-class-pagination-and-dto.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IEntityWithServiceClassPaginationAndDTOProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const EntityWithServiceClassPaginationAndDTO = (props: IEntityWithServiceClassPaginationAndDTOProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const { entityWithServiceClassPaginationAndDTOList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="entity-with-service-class-pagination-and-dto-heading" data-cy="EntityWithServiceClassPaginationAndDTOHeading">
        <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.home.title">
          Entity With Service Class Pagination And DTOS
        </Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.home.refreshListLabel">
              Refresh List
            </Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.home.createLabel">
              Create new Entity With Service Class Pagination And DTO
            </Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {entityWithServiceClassPaginationAndDTOList && entityWithServiceClassPaginationAndDTOList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('lena')}>
                  <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.lena">Lena</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entityWithServiceClassPaginationAndDTOList.map((entityWithServiceClassPaginationAndDTO, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${entityWithServiceClassPaginationAndDTO.id}`} color="link" size="sm">
                      {entityWithServiceClassPaginationAndDTO.id}
                    </Button>
                  </td>
                  <td>{entityWithServiceClassPaginationAndDTO.lena}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`${match.url}/${entityWithServiceClassPaginationAndDTO.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${entityWithServiceClassPaginationAndDTO.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${entityWithServiceClassPaginationAndDTO.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.home.notFound">
                No Entity With Service Class Pagination And DTOS found
              </Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div
          className={entityWithServiceClassPaginationAndDTOList && entityWithServiceClassPaginationAndDTOList.length > 0 ? '' : 'd-none'}
        >
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ entityWithServiceClassPaginationAndDTO }: IRootState) => ({
  entityWithServiceClassPaginationAndDTOList: entityWithServiceClassPaginationAndDTO.entities,
  loading: entityWithServiceClassPaginationAndDTO.loading,
  totalItems: entityWithServiceClassPaginationAndDTO.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EntityWithServiceClassPaginationAndDTO);
