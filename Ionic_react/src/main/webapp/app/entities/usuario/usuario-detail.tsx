import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './usuario.reducer';

export const UsuarioDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const usuarioEntity = useAppSelector(state => state.usuario.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="usuarioDetailsHeading">
          <Translate contentKey="microblogApp.usuario.detail.title">Usuario</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.id}</dd>
          <dt>
            <span id="alias">
              <Translate contentKey="microblogApp.usuario.alias">Alias</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.alias}</dd>
          <dt>
            <span id="nombre">
              <Translate contentKey="microblogApp.usuario.nombre">Nombre</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.nombre}</dd>
          <dt>
            <span id="correo">
              <Translate contentKey="microblogApp.usuario.correo">Correo</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.correo}</dd>
          <dt>
            <span id="contrasenia">
              <Translate contentKey="microblogApp.usuario.contrasenia">Contrasenia</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.contrasenia}</dd>
          <dt>
            <span id="descripcion">
              <Translate contentKey="microblogApp.usuario.descripcion">Descripcion</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.descripcion}</dd>
          <dt>
            <span id="admin">
              <Translate contentKey="microblogApp.usuario.admin">Admin</Translate>
            </span>
          </dt>
          <dd>{usuarioEntity.admin ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="microblogApp.usuario.siguiendo">Siguiendo</Translate>
          </dt>
          <dd>
            {usuarioEntity.siguiendos
              ? usuarioEntity.siguiendos.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {usuarioEntity.siguiendos && i === usuarioEntity.siguiendos.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>
            <Translate contentKey="microblogApp.usuario.mensajeMencionado">Mensaje Mencionado</Translate>
          </dt>
          <dd>{usuarioEntity.mensajeMencionado ? usuarioEntity.mensajeMencionado.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/usuario" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/usuario/${usuarioEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UsuarioDetail;
