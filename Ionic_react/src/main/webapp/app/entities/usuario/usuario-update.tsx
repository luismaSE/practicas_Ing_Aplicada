import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getUsuarios } from 'app/entities/usuario/usuario.reducer';
import { IMensaje } from 'app/shared/model/mensaje.model';
import { getEntities as getMensajes } from 'app/entities/mensaje/mensaje.reducer';
import { IMensajePrivado } from 'app/shared/model/mensaje-privado.model';
import { getEntities as getMensajePrivados } from 'app/entities/mensaje-privado/mensaje-privado.reducer';
import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntity, updateEntity, createEntity, reset } from './usuario.reducer';

export const UsuarioUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const usuarios = useAppSelector(state => state.usuario.entities);
  const mensajes = useAppSelector(state => state.mensaje.entities);
  const mensajePrivados = useAppSelector(state => state.mensajePrivado.entities);
  const usuarioEntity = useAppSelector(state => state.usuario.entity);
  const loading = useAppSelector(state => state.usuario.loading);
  const updating = useAppSelector(state => state.usuario.updating);
  const updateSuccess = useAppSelector(state => state.usuario.updateSuccess);

  const handleClose = () => {
    navigate('/usuario');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsuarios({}));
    dispatch(getMensajes({}));
    dispatch(getMensajePrivados({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...usuarioEntity,
      ...values,
      siguiendos: mapIdList(values.siguiendos),
      mensajeMencionado: mensajes.find(it => it.id.toString() === values.mensajeMencionado.toString()),
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
          ...usuarioEntity,
          siguiendos: usuarioEntity?.siguiendos?.map(e => e.id.toString()),
          mensajeMencionado: usuarioEntity?.mensajeMencionado?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microblogApp.usuario.home.createOrEditLabel" data-cy="UsuarioCreateUpdateHeading">
            <Translate contentKey="microblogApp.usuario.home.createOrEditLabel">Create or edit a Usuario</Translate>
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
                  id="usuario-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('microblogApp.usuario.alias')} id="usuario-alias" name="alias" data-cy="alias" type="text" />
              <ValidatedField
                label={translate('microblogApp.usuario.nombre')}
                id="usuario-nombre"
                name="nombre"
                data-cy="nombre"
                type="text"
              />
              <ValidatedField
                label={translate('microblogApp.usuario.correo')}
                id="usuario-correo"
                name="correo"
                data-cy="correo"
                type="text"
              />
              <ValidatedField
                label={translate('microblogApp.usuario.contrasenia')}
                id="usuario-contrasenia"
                name="contrasenia"
                data-cy="contrasenia"
                type="text"
              />
              <ValidatedField
                label={translate('microblogApp.usuario.descripcion')}
                id="usuario-descripcion"
                name="descripcion"
                data-cy="descripcion"
                type="text"
              />
              <ValidatedField
                label={translate('microblogApp.usuario.admin')}
                id="usuario-admin"
                name="admin"
                data-cy="admin"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('microblogApp.usuario.siguiendo')}
                id="usuario-siguiendo"
                data-cy="siguiendo"
                type="select"
                multiple
                name="siguiendos"
              >
                <option value="" key="0" />
                {usuarios
                  ? usuarios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="usuario-mensajeMencionado"
                name="mensajeMencionado"
                data-cy="mensajeMencionado"
                label={translate('microblogApp.usuario.mensajeMencionado')}
                type="select"
              >
                <option value="" key="0" />
                {mensajes
                  ? mensajes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/usuario" replace color="info">
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

export default UsuarioUpdate;
