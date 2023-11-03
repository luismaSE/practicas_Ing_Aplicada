import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITablonDeAnuncios, NewTablonDeAnuncios } from '../tablon-de-anuncios.model';

export type PartialUpdateTablonDeAnuncios = Partial<ITablonDeAnuncios> & Pick<ITablonDeAnuncios, 'id'>;

export type EntityResponseType = HttpResponse<ITablonDeAnuncios>;
export type EntityArrayResponseType = HttpResponse<ITablonDeAnuncios[]>;

@Injectable({ providedIn: 'root' })
export class TablonDeAnunciosService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tablon-de-anuncios');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(tablonDeAnuncios: NewTablonDeAnuncios): Observable<EntityResponseType> {
    return this.http.post<ITablonDeAnuncios>(this.resourceUrl, tablonDeAnuncios, { observe: 'response' });
  }

  update(tablonDeAnuncios: ITablonDeAnuncios): Observable<EntityResponseType> {
    return this.http.put<ITablonDeAnuncios>(
      `${this.resourceUrl}/${this.getTablonDeAnunciosIdentifier(tablonDeAnuncios)}`,
      tablonDeAnuncios,
      { observe: 'response' },
    );
  }

  partialUpdate(tablonDeAnuncios: PartialUpdateTablonDeAnuncios): Observable<EntityResponseType> {
    return this.http.patch<ITablonDeAnuncios>(
      `${this.resourceUrl}/${this.getTablonDeAnunciosIdentifier(tablonDeAnuncios)}`,
      tablonDeAnuncios,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITablonDeAnuncios>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITablonDeAnuncios[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTablonDeAnunciosIdentifier(tablonDeAnuncios: Pick<ITablonDeAnuncios, 'id'>): number {
    return tablonDeAnuncios.id;
  }

  compareTablonDeAnuncios(o1: Pick<ITablonDeAnuncios, 'id'> | null, o2: Pick<ITablonDeAnuncios, 'id'> | null): boolean {
    return o1 && o2 ? this.getTablonDeAnunciosIdentifier(o1) === this.getTablonDeAnunciosIdentifier(o2) : o1 === o2;
  }

  addTablonDeAnunciosToCollectionIfMissing<Type extends Pick<ITablonDeAnuncios, 'id'>>(
    tablonDeAnunciosCollection: Type[],
    ...tablonDeAnunciosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tablonDeAnuncios: Type[] = tablonDeAnunciosToCheck.filter(isPresent);
    if (tablonDeAnuncios.length > 0) {
      const tablonDeAnunciosCollectionIdentifiers = tablonDeAnunciosCollection.map(
        tablonDeAnunciosItem => this.getTablonDeAnunciosIdentifier(tablonDeAnunciosItem)!,
      );
      const tablonDeAnunciosToAdd = tablonDeAnuncios.filter(tablonDeAnunciosItem => {
        const tablonDeAnunciosIdentifier = this.getTablonDeAnunciosIdentifier(tablonDeAnunciosItem);
        if (tablonDeAnunciosCollectionIdentifiers.includes(tablonDeAnunciosIdentifier)) {
          return false;
        }
        tablonDeAnunciosCollectionIdentifiers.push(tablonDeAnunciosIdentifier);
        return true;
      });
      return [...tablonDeAnunciosToAdd, ...tablonDeAnunciosCollection];
    }
    return tablonDeAnunciosCollection;
  }
}
