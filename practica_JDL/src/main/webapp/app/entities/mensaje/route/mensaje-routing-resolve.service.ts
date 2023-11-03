import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMensaje } from '../mensaje.model';
import { MensajeService } from '../service/mensaje.service';

export const mensajeResolve = (route: ActivatedRouteSnapshot): Observable<null | IMensaje> => {
  const id = route.params['id'];
  if (id) {
    return inject(MensajeService)
      .find(id)
      .pipe(
        mergeMap((mensaje: HttpResponse<IMensaje>) => {
          if (mensaje.body) {
            return of(mensaje.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default mensajeResolve;
