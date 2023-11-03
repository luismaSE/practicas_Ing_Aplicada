import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMensaje } from '../mensaje.model';
import { MensajeService } from '../service/mensaje.service';

@Injectable({ providedIn: 'root' })
export class MensajeRoutingResolveService implements Resolve<IMensaje | null> {
  constructor(protected service: MensajeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMensaje | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mensaje: HttpResponse<IMensaje>) => {
          if (mensaje.body) {
            return of(mensaje.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
