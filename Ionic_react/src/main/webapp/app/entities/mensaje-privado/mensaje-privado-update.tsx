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
import { IMensajePrivado } from 'app/shared/model/mensaje-privado.model';
import { getEntity, updateEntity, createEntity, reset } from './mensaje-privado.reducer';

export const MensajePrivadoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.usuario.entities);
  const mensajePrivadoEntity = useAppSelector(state => state.mensajePrivado.entity);
  const loading = useAppSelector(state => state.mensajePrivado.loading);
  const updating = useAppSelector(state => state.mensajePrivado.updating);
  const updateSuccess = useAppSelector(state => state.mensajePrivado.updateSuccess);

  const handleClose = () => {
    navigate('/mensaje-privado');
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
      ...mensajePrivadoEntity,
      ...values,
      autor: usuarios.find(it => it.id.toString() === values.autor.toString()),
      destino: usuarios.find(it => it.id.toString() === values.destino.toString()),
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
          ...mensajePrivadoEntity,
          autor: mensajePrivadoEntity?.autor?.id,
          destino: mensajePrivadoEntity?.destino?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microblogApp.mensajePrivado.home.createOrEditLabel" data-cy="MensajePrivadoCreateUpdateHeading">
            <Translate contentKey="microblogApp.mensajePrivado.home.createOrEditLabel">Create or edit a MensajePrivado</Translate>
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
                  id="mensaje-privado-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('microblogApp.mensajePrivado.texto')}
                id="mensaje-privado-texto"
                name="texto"
                data-cy="texto"
                type="text"
              />
              <ValidatedField
                label={translate('microblogApp.mensajePrivado.fecha')}
                id="mensaje-privado-fecha"
                name="fecha"
                data-cy="fecha"
                type="date"
              />
              <ValidatedField
                id="mensaje-privado-autor"
                name="autor"
                data-cy="autor"
                label={translate('microblogApp.mensajePrivado.autor')}
                type="select"
              >
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.alias}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="mensaje-privado-destino"
                name="destino"
                data-cy="destino"
                label={translate('microblogApp.mensajePrivado.destino')}
                type="select"
              >
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.alias}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/mensaje-privado" replace color="info">
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

export default MensajePrivadoUpdate;
