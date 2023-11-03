import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IMensaje } from 'app/shared/model/mensaje.model';
import { getEntities } from './mensaje.reducer';

export const Mensaje = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const mensajeList = useAppSelector(state => state.mensaje.entities);
  const loading = useAppSelector(state => state.mensaje.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="mensaje-heading" data-cy="MensajeHeading">
        <Translate contentKey="microblogApp.mensaje.home.title">Mensajes</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="microblogApp.mensaje.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/mensaje/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="microblogApp.mensaje.home.createLabel">Create new Mensaje</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {mensajeList && mensajeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="microblogApp.mensaje.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensaje.texto">Texto</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensaje.fecha">Fecha</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensaje.autor">Autor</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mensajeList.map((mensaje, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/mensaje/${mensaje.id}`} color="link" size="sm">
                      {mensaje.id}
                    </Button>
                  </td>
                  <td>{mensaje.texto}</td>
                  <td>{mensaje.fecha ? <TextFormat type="date" value={mensaje.fecha} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{mensaje.autor ? <Link to={`/usuario/${mensaje.autor.id}`}>{mensaje.autor.alias}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/mensaje/${mensaje.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/mensaje/${mensaje.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/mensaje/${mensaje.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="microblogApp.mensaje.home.notFound">No Mensajes found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Mensaje;
