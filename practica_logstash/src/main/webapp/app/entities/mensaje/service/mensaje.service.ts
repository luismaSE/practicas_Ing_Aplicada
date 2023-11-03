import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMensaje, NewMensaje } from '../mensaje.model';

export type PartialUpdateMensaje = Partial<IMensaje> & Pick<IMensaje, 'id'>;

type RestOf<T extends IMensaje | NewMensaje> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestMensaje = RestOf<IMensaje>;

export type NewRestMensaje = RestOf<NewMensaje>;

export type PartialUpdateRestMensaje = RestOf<PartialUpdateMensaje>;

export type EntityResponseType = HttpResponse<IMensaje>;
export type EntityArrayResponseType = HttpResponse<IMensaje[]>;

@Injectable({ providedIn: 'root' })
export class MensajeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mensajes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mensaje: NewMensaje): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensaje);
    return this.http
      .post<RestMensaje>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mensaje: IMensaje): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensaje);
    return this.http
      .put<RestMensaje>(`${this.resourceUrl}/${this.getMensajeIdentifier(mensaje)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(mensaje: PartialUpdateMensaje): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensaje);
    return this.http
      .patch<RestMensaje>(`${this.resourceUrl}/${this.getMensajeIdentifier(mensaje)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMensaje>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMensaje[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMensajeIdentifier(mensaje: Pick<IMensaje, 'id'>): number {
    return mensaje.id;
  }

  compareMensaje(o1: Pick<IMensaje, 'id'> | null, o2: Pick<IMensaje, 'id'> | null): boolean {
    return o1 && o2 ? this.getMensajeIdentifier(o1) === this.getMensajeIdentifier(o2) : o1 === o2;
  }

  addMensajeToCollectionIfMissing<Type extends Pick<IMensaje, 'id'>>(
    mensajeCollection: Type[],
    ...mensajesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mensajes: Type[] = mensajesToCheck.filter(isPresent);
    if (mensajes.length > 0) {
      const mensajeCollectionIdentifiers = mensajeCollection.map(mensajeItem => this.getMensajeIdentifier(mensajeItem)!);
      const mensajesToAdd = mensajes.filter(mensajeItem => {
        const mensajeIdentifier = this.getMensajeIdentifier(mensajeItem);
        if (mensajeCollectionIdentifiers.includes(mensajeIdentifier)) {
          return false;
        }
        mensajeCollectionIdentifiers.push(mensajeIdentifier);
        return true;
      });
      return [...mensajesToAdd, ...mensajeCollection];
    }
    return mensajeCollection;
  }

  protected convertDateFromClient<T extends IMensaje | NewMensaje | PartialUpdateMensaje>(mensaje: T): RestOf<T> {
    return {
      ...mensaje,
      fecha: mensaje.fecha?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMensaje: RestMensaje): IMensaje {
    return {
      ...restMensaje,
      fecha: restMensaje.fecha ? dayjs(restMensaje.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMensaje>): HttpResponse<IMensaje> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMensaje[]>): HttpResponse<IMensaje[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
