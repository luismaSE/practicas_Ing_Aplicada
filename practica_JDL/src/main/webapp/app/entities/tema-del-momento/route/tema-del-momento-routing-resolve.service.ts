import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITemaDelMomento } from '../tema-del-momento.model';
import { TemaDelMomentoService } from '../service/tema-del-momento.service';

export const temaDelMomentoResolve = (route: ActivatedRouteSnapshot): Observable<null | ITemaDelMomento> => {
  const id = route.params['id'];
  if (id) {
    return inject(TemaDelMomentoService)
      .find(id)
      .pipe(
        mergeMap((temaDelMomento: HttpResponse<ITemaDelMomento>) => {
          if (temaDelMomento.body) {
            return of(temaDelMomento.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default temaDelMomentoResolve;
