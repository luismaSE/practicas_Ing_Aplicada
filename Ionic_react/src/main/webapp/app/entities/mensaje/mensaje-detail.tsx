import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './mensaje.reducer';

export const MensajeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const mensajeEntity = useAppSelector(state => state.mensaje.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="mensajeDetailsHeading">
          <Translate contentKey="microblogApp.mensaje.detail.title">Mensaje</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{mensajeEntity.id}</dd>
          <dt>
            <span id="texto">
              <Translate contentKey="microblogApp.mensaje.texto">Texto</Translate>
            </span>
          </dt>
          <dd>{mensajeEntity.texto}</dd>
          <dt>
            <span id="fecha">
              <Translate contentKey="microblogApp.mensaje.fecha">Fecha</Translate>
            </span>
          </dt>
          <dd>{mensajeEntity.fecha ? <TextFormat value={mensajeEntity.fecha} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="microblogApp.mensaje.autor">Autor</Translate>
          </dt>
          <dd>{mensajeEntity.autor ? mensajeEntity.autor.alias : ''}</dd>
        </dl>
        <Button tag={Link} to="/mensaje" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/mensaje/${mensajeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default MensajeDetail;
