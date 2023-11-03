import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';
import { TablonDeAnunciosService } from '../service/tablon-de-anuncios.service';

export const tablonDeAnunciosResolve = (route: ActivatedRouteSnapshot): Observable<null | ITablonDeAnuncios> => {
  const id = route.params['id'];
  if (id) {
    return inject(TablonDeAnunciosService)
      .find(id)
      .pipe(
        mergeMap((tablonDeAnuncios: HttpResponse<ITablonDeAnuncios>) => {
          if (tablonDeAnuncios.body) {
            return of(tablonDeAnuncios.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default tablonDeAnunciosResolve;
