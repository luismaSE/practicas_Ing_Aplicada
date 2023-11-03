import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './mensaje-privado.reducer';

export const MensajePrivadoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const mensajePrivadoEntity = useAppSelector(state => state.mensajePrivado.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="mensajePrivadoDetailsHeading">
          <Translate contentKey="microblogApp.mensajePrivado.detail.title">MensajePrivado</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{mensajePrivadoEntity.id}</dd>
          <dt>
            <span id="texto">
              <Translate contentKey="microblogApp.mensajePrivado.texto">Texto</Translate>
            </span>
          </dt>
          <dd>{mensajePrivadoEntity.texto}</dd>
          <dt>
            <span id="fecha">
              <Translate contentKey="microblogApp.mensajePrivado.fecha">Fecha</Translate>
            </span>
          </dt>
          <dd>
            {mensajePrivadoEntity.fecha ? (
              <TextFormat value={mensajePrivadoEntity.fecha} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="microblogApp.mensajePrivado.autor">Autor</Translate>
          </dt>
          <dd>{mensajePrivadoEntity.autor ? mensajePrivadoEntity.autor.alias : ''}</dd>
          <dt>
            <Translate contentKey="microblogApp.mensajePrivado.destino">Destino</Translate>
          </dt>
          <dd>{mensajePrivadoEntity.destino ? mensajePrivadoEntity.destino.alias : ''}</dd>
        </dl>
        <Button tag={Link} to="/mensaje-privado" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/mensaje-privado/${mensajePrivadoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default MensajePrivadoDetail;
