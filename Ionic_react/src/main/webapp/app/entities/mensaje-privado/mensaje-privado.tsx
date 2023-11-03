import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IMensajePrivado } from 'app/shared/model/mensaje-privado.model';
import { getEntities } from './mensaje-privado.reducer';

export const MensajePrivado = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const mensajePrivadoList = useAppSelector(state => state.mensajePrivado.entities);
  const loading = useAppSelector(state => state.mensajePrivado.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="mensaje-privado-heading" data-cy="MensajePrivadoHeading">
        <Translate contentKey="microblogApp.mensajePrivado.home.title">Mensaje Privados</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="microblogApp.mensajePrivado.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/mensaje-privado/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="microblogApp.mensajePrivado.home.createLabel">Create new Mensaje Privado</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {mensajePrivadoList && mensajePrivadoList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="microblogApp.mensajePrivado.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensajePrivado.texto">Texto</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensajePrivado.fecha">Fecha</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensajePrivado.autor">Autor</Translate>
                </th>
                <th>
                  <Translate contentKey="microblogApp.mensajePrivado.destino">Destino</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mensajePrivadoList.map((mensajePrivado, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/mensaje-privado/${mensajePrivado.id}`} color="link" size="sm">
                      {mensajePrivado.id}
                    </Button>
                  </td>
                  <td>{mensajePrivado.texto}</td>
                  <td>
                    {mensajePrivado.fecha ? <TextFormat type="date" value={mensajePrivado.fecha} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {mensajePrivado.autor ? <Link to={`/usuario/${mensajePrivado.autor.id}`}>{mensajePrivado.autor.alias}</Link> : ''}
                  </td>
                  <td>
                    {mensajePrivado.destino ? <Link to={`/usuario/${mensajePrivado.destino.id}`}>{mensajePrivado.destino.alias}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/mensaje-privado/${mensajePrivado.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/mensaje-privado/${mensajePrivado.id}/edit`}
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
                        to={`/mensaje-privado/${mensajePrivado.id}/delete`}
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
              <Translate contentKey="microblogApp.mensajePrivado.home.notFound">No Mensaje Privados found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MensajePrivado;
