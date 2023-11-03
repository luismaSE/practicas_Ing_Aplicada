import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUsuario } from 'app/shared/model/usuario.model';
import { getEntities } from './usuario.reducer';

export const Usuario = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const usuarioList = useAppSelector(state => state.usuario.entities);
  const loading = useAppSelector(state => state.usuario.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="usuario-heading" data-cy="UsuarioHeading">
        <Translate contentKey="microblogApp.usuario.home.title">Usuarios</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="microblogApp.usuario.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/usuario/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="microblogApp.usuario.home.createLabel">Create new Usuario</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {usuarioList && usuarioList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="microblogApp.usuario.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.alias">Alias</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.nombre">Nombre</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.correo">Correo</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.contrasenia">Contrasenia</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.descripcion">Descripcion</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.admin">Admin</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.siguiendo">Siguiendo</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.usuario.mensajeMencionado">Mensaje Mencionado</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {usuarioList.map((usuario, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/usuario/${usuario.id}`} color="link" size="sm">
                      {usuario.id}
                    </Button>
                  </td>
                  <td>{usuario.alias}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.contrasenia}</td>
                  <td>{usuario.descripcion}</td>
                  <td>{usuario.admin ? 'true' : 'false'}</td>
                  <td>
                    {usuario.siguiendos
                      ? usuario.siguiendos.map((val, j) => (
                          <span key={j}>
                            <Link to={`/usuario/${val.id}`}>{val.id}</Link>
                            {j === usuario.siguiendos.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td>
                    {usuario.mensajeMencionado ? (
                      <Link to={`/mensaje/${usuario.mensajeMencionado.id}`}>{usuario.mensajeMencionado.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/usuario/${usuario.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/usuario/${usuario.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/usuario/${usuario.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="microblogApp.usuario.home.notFound">No Usuarios found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Usuario;
