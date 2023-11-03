import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITemaDelMomento, NewTemaDelMomento } from '../tema-del-momento.model';

export type PartialUpdateTemaDelMomento = Partial<ITemaDelMomento> & Pick<ITemaDelMomento, 'id'>;

export type EntityResponseType = HttpResponse<ITemaDelMomento>;
export type EntityArrayResponseType = HttpResponse<ITemaDelMomento[]>;

@Injectable({ providedIn: 'root' })
export class TemaDelMomentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tema-del-momentos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(temaDelMomento: NewTemaDelMomento): Observable<EntityResponseType> {
    return this.http.post<ITemaDelMomento>(this.resourceUrl, temaDelMomento, { observe: 'response' });
  }

  update(temaDelMomento: ITemaDelMomento): Observable<EntityResponseType> {
    return this.http.put<ITemaDelMomento>(`${this.resourceUrl}/${this.getTemaDelMomentoIdentifier(temaDelMomento)}`, temaDelMomento, {
      observe: 'response',
    });
  }

  partialUpdate(temaDelMomento: PartialUpdateTemaDelMomento): Observable<EntityResponseType> {
    return this.http.patch<ITemaDelMomento>(`${this.resourceUrl}/${this.getTemaDelMomentoIdentifier(temaDelMomento)}`, temaDelMomento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITemaDelMomento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITemaDelMomento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTemaDelMomentoIdentifier(temaDelMomento: Pick<ITemaDelMomento, 'id'>): number {
    return temaDelMomento.id;
  }

  compareTemaDelMomento(o1: Pick<ITemaDelMomento, 'id'> | null, o2: Pick<ITemaDelMomento, 'id'> | null): boolean {
    return o1 && o2 ? this.getTemaDelMomentoIdentifier(o1) === this.getTemaDelMomentoIdentifier(o2) : o1 === o2;
  }

  addTemaDelMomentoToCollectionIfMissing<Type extends Pick<ITemaDelMomento, 'id'>>(
    temaDelMomentoCollection: Type[],
    ...temaDelMomentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const temaDelMomentos: Type[] = temaDelMomentosToCheck.filter(isPresent);
    if (temaDelMomentos.length > 0) {
      const temaDelMomentoCollectionIdentifiers = temaDelMomentoCollection.map(
        temaDelMomentoItem => this.getTemaDelMomentoIdentifier(temaDelMomentoItem)!,
      );
      const temaDelMomentosToAdd = temaDelMomentos.filter(temaDelMomentoItem => {
        const temaDelMomentoIdentifier = this.getTemaDelMomentoIdentifier(temaDelMomentoItem);
        if (temaDelMomentoCollectionIdentifiers.includes(temaDelMomentoIdentifier)) {
          return false;
        }
        temaDelMomentoCollectionIdentifiers.push(temaDelMomentoIdentifier);
        return true;
      });
      return [...temaDelMomentosToAdd, ...temaDelMomentoCollection];
    }
    return temaDelMomentoCollection;
  }
}
