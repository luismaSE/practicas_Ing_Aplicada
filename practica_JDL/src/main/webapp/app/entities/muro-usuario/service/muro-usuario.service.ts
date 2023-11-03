import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMuroUsuario, NewMuroUsuario } from '../muro-usuario.model';

export type PartialUpdateMuroUsuario = Partial<IMuroUsuario> & Pick<IMuroUsuario, 'id'>;

export type EntityResponseType = HttpResponse<IMuroUsuario>;
export type EntityArrayResponseType = HttpResponse<IMuroUsuario[]>;

@Injectable({ providedIn: 'root' })
export class MuroUsuarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/muro-usuarios');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(muroUsuario: NewMuroUsuario): Observable<EntityResponseType> {
    return this.http.post<IMuroUsuario>(this.resourceUrl, muroUsuario, { observe: 'response' });
  }

  update(muroUsuario: IMuroUsuario): Observable<EntityResponseType> {
    return this.http.put<IMuroUsuario>(`${this.resourceUrl}/${this.getMuroUsuarioIdentifier(muroUsuario)}`, muroUsuario, {
      observe: 'response',
    });
  }

  partialUpdate(muroUsuario: PartialUpdateMuroUsuario): Observable<EntityResponseType> {
    return this.http.patch<IMuroUsuario>(`${this.resourceUrl}/${this.getMuroUsuarioIdentifier(muroUsuario)}`, muroUsuario, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMuroUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMuroUsuario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMuroUsuarioIdentifier(muroUsuario: Pick<IMuroUsuario, 'id'>): number {
    return muroUsuario.id;
  }

  compareMuroUsuario(o1: Pick<IMuroUsuario, 'id'> | null, o2: Pick<IMuroUsuario, 'id'> | null): boolean {
    return o1 && o2 ? this.getMuroUsuarioIdentifier(o1) === this.getMuroUsuarioIdentifier(o2) : o1 === o2;
  }

  addMuroUsuarioToCollectionIfMissing<Type extends Pick<IMuroUsuario, 'id'>>(
    muroUsuarioCollection: Type[],
    ...muroUsuariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const muroUsuarios: Type[] = muroUsuariosToCheck.filter(isPresent);
    if (muroUsuarios.length > 0) {
      const muroUsuarioCollectionIdentifiers = muroUsuarioCollection.map(
        muroUsuarioItem => this.getMuroUsuarioIdentifier(muroUsuarioItem)!,
      );
      const muroUsuariosToAdd = muroUsuarios.filter(muroUsuarioItem => {
        const muroUsuarioIdentifier = this.getMuroUsuarioIdentifier(muroUsuarioItem);
        if (muroUsuarioCollectionIdentifiers.includes(muroUsuarioIdentifier)) {
          return false;
        }
        muroUsuarioCollectionIdentifiers.push(muroUsuarioIdentifier);
        return true;
      });
      return [...muroUsuariosToAdd, ...muroUsuarioCollection];
    }
    return muroUsuarioCollection;
  }
}
