import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMuroUsuario } from '../muro-usuario.model';
import { MuroUsuarioService } from '../service/muro-usuario.service';

export const muroUsuarioResolve = (route: ActivatedRouteSnapshot): Observable<null | IMuroUsuario> => {
  const id = route.params['id'];
  if (id) {
    return inject(MuroUsuarioService)
      .find(id)
      .pipe(
        mergeMap((muroUsuario: HttpResponse<IMuroUsuario>) => {
          if (muroUsuario.body) {
            return of(muroUsuario.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default muroUsuarioResolve;
