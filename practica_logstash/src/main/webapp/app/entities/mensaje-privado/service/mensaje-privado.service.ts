import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMensajePrivado, NewMensajePrivado } from '../mensaje-privado.model';

export type PartialUpdateMensajePrivado = Partial<IMensajePrivado> & Pick<IMensajePrivado, 'id'>;

type RestOf<T extends IMensajePrivado | NewMensajePrivado> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestMensajePrivado = RestOf<IMensajePrivado>;

export type NewRestMensajePrivado = RestOf<NewMensajePrivado>;

export type PartialUpdateRestMensajePrivado = RestOf<PartialUpdateMensajePrivado>;

export type EntityResponseType = HttpResponse<IMensajePrivado>;
export type EntityArrayResponseType = HttpResponse<IMensajePrivado[]>;

@Injectable({ providedIn: 'root' })
export class MensajePrivadoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mensaje-privados');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mensajePrivado: NewMensajePrivado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensajePrivado);
    return this.http
      .post<RestMensajePrivado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(mensajePrivado: IMensajePrivado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensajePrivado);
    return this.http
      .put<RestMensajePrivado>(`${this.resourceUrl}/${this.getMensajePrivadoIdentifier(mensajePrivado)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(mensajePrivado: PartialUpdateMensajePrivado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(mensajePrivado);
    return this.http
      .patch<RestMensajePrivado>(`${this.resourceUrl}/${this.getMensajePrivadoIdentifier(mensajePrivado)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMensajePrivado>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMensajePrivado[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMensajePrivadoIdentifier(mensajePrivado: Pick<IMensajePrivado, 'id'>): number {
    return mensajePrivado.id;
  }

  compareMensajePrivado(o1: Pick<IMensajePrivado, 'id'> | null, o2: Pick<IMensajePrivado, 'id'> | null): boolean {
    return o1 && o2 ? this.getMensajePrivadoIdentifier(o1) === this.getMensajePrivadoIdentifier(o2) : o1 === o2;
  }

  addMensajePrivadoToCollectionIfMissing<Type extends Pick<IMensajePrivado, 'id'>>(
    mensajePrivadoCollection: Type[],
    ...mensajePrivadosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mensajePrivados: Type[] = mensajePrivadosToCheck.filter(isPresent);
    if (mensajePrivados.length > 0) {
      const mensajePrivadoCollectionIdentifiers = mensajePrivadoCollection.map(
        mensajePrivadoItem => this.getMensajePrivadoIdentifier(mensajePrivadoItem)!
      );
      const mensajePrivadosToAdd = mensajePrivados.filter(mensajePrivadoItem => {
        const mensajePrivadoIdentifier = this.getMensajePrivadoIdentifier(mensajePrivadoItem);
        if (mensajePrivadoCollectionIdentifiers.includes(mensajePrivadoIdentifier)) {
          return false;
        }
        mensajePrivadoCollectionIdentifiers.push(mensajePrivadoIdentifier);
        return true;
      });
      return [...mensajePrivadosToAdd, ...mensajePrivadoCollection];
    }
    return mensajePrivadoCollection;
  }

  protected convertDateFromClient<T extends IMensajePrivado | NewMensajePrivado | PartialUpdateMensajePrivado>(
    mensajePrivado: T
  ): RestOf<T> {
    return {
      ...mensajePrivado,
      fecha: mensajePrivado.fecha?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMensajePrivado: RestMensajePrivado): IMensajePrivado {
    return {
      ...restMensajePrivado,
      fecha: restMensajePrivado.fecha ? dayjs(restMensajePrivado.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMensajePrivado>): HttpResponse<IMensajePrivado> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMensajePrivado[]>): HttpResponse<IMensajePrivado[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
