import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MensajeComponent } from './list/mensaje.component';
import { MensajeDetailComponent } from './detail/mensaje-detail.component';
import { MensajeUpdateComponent } from './update/mensaje-update.component';
import MensajeResolve from './route/mensaje-routing-resolve.service';

const mensajeRoute: Routes = [
  {
    path: '',
    component: MensajeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MensajeDetailComponent,
    resolve: {
      mensaje: MensajeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MensajeUpdateComponent,
    resolve: {
      mensaje: MensajeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MensajeUpdateComponent,
    resolve: {
      mensaje: MensajeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default mensajeRoute;
