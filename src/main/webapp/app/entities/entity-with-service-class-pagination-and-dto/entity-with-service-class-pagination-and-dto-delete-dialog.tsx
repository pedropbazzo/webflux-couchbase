import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './entity-with-service-class-pagination-and-dto.reducer';

export interface IEntityWithServiceClassPaginationAndDTODeleteDialogProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string }> {}

export const EntityWithServiceClassPaginationAndDTODeleteDialog = (props: IEntityWithServiceClassPaginationAndDTODeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity-with-service-class-pagination-and-dto' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.entityWithServiceClassPaginationAndDTOEntity.id);
  };

  const { entityWithServiceClassPaginationAndDTOEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="entityWithServiceClassPaginationAndDTODeleteDialogHeading">
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.delete.question">
        <Translate
          contentKey="sampleCouchbaseNoCacheApp.entityWithServiceClassPaginationAndDTO.delete.question"
          interpolate={{ id: entityWithServiceClassPaginationAndDTOEntity.id }}
        >
          Are you sure you want to delete this EntityWithServiceClassPaginationAndDTO?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button
          id="jhi-confirm-delete-entityWithServiceClassPaginationAndDTO"
          data-cy="entityConfirmDeleteButton"
          color="danger"
          onClick={confirmDelete}
        >
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ entityWithServiceClassPaginationAndDTO }: IRootState) => ({
  entityWithServiceClassPaginationAndDTOEntity: entityWithServiceClassPaginationAndDTO.entity,
  updateSuccess: entityWithServiceClassPaginationAndDTO.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EntityWithServiceClassPaginationAndDTODeleteDialog);
