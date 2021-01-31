import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './entity-with-service-impl-pagination-and-dto.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEntityWithServiceImplPaginationAndDTODetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EntityWithServiceImplPaginationAndDTODetail = (props: IEntityWithServiceImplPaginationAndDTODetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { entityWithServiceImplPaginationAndDTOEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="entityWithServiceImplPaginationAndDTODetailsHeading">
          <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceImplPaginationAndDTO.detail.title">
            EntityWithServiceImplPaginationAndDTO
          </Translate>{' '}
          [<strong>{entityWithServiceImplPaginationAndDTOEntity.id}</strong>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="theo">
              <Translate contentKey="sampleCouchbaseNoCacheApp.entityWithServiceImplPaginationAndDTO.theo">Theo</Translate>
            </span>
          </dt>
          <dd>{entityWithServiceImplPaginationAndDTOEntity.theo}</dd>
        </dl>
        <Button tag={Link} to="/entity-with-service-impl-pagination-and-dto" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button
          tag={Link}
          to={`/entity-with-service-impl-pagination-and-dto/${entityWithServiceImplPaginationAndDTOEntity.id}/edit`}
          replace
          color="primary"
        >
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ entityWithServiceImplPaginationAndDTO }: IRootState) => ({
  entityWithServiceImplPaginationAndDTOEntity: entityWithServiceImplPaginationAndDTO.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EntityWithServiceImplPaginationAndDTODetail);
