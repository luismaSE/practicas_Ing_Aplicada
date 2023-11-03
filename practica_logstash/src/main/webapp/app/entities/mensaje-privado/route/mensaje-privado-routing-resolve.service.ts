import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMensajePrivado } from '../mensaje-privado.model';
import { MensajePrivadoService } from '../service/mensaje-privado.service';

@Injectable({ providedIn: 'root' })
export class MensajePrivadoRoutingResolveService implements Resolve<IMensajePrivado | null> {
  constructor(protected service: MensajePrivadoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMensajePrivado | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mensajePrivado: HttpResponse<IMensajePrivado>) => {
          if (mensajePrivado.body) {
            return of(mensajePrivado.body);
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
