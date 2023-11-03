import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { IMensaje } from 'app/shared/model/mensaje.model';
import { getEntity, updateEntity, createEntity, reset } from './mensaje.reducer';

export const MensajeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.usuario.entities);
  const mensajeEntity = useAppSelector(state => state.mensaje.entity);
  const loading = useAppSelector(state => state.mensaje.loading);
  const updating = useAppSelector(state => state.mensaje.updating);
  const updateSuccess = useAppSelector(state => state.mensaje.updateSuccess);

  const handleClose = () => {
    navigate('/mensaje');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsuarios({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...mensajeEntity,
      ...values,
      autor: usuarios.find(it => it.id.toString() === values.autor.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...mensajeEntity,
          autor: mensajeEntity?.autor?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microblogApp.mensaje.home.createOrEditLabel" data-cy="MensajeCreateUpdateHeading">
            <Translate contentKey="microblogApp.mensaje.home.createOrEditLabel">Create or edit a Mensaje</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="mensaje-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('microblogApp.mensaje.texto')} id="mensaje-texto" name="texto" data-cy="texto" type="text" />
              <ValidatedField label={translate('microblogApp.mensaje.fecha')} id="mensaje-fecha" name="fecha" data-cy="fecha" type="date" />
              <ValidatedField id="mensaje-autor" name="autor" data-cy="autor" label={translate('microblogApp.mensaje.autor')} type="select">
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.alias}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/mensaje" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MensajeUpdate;
