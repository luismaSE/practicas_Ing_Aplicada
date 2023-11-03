import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MuroUsuarioComponent } from './list/muro-usuario.component';
import { MuroUsuarioDetailComponent } from './detail/muro-usuario-detail.component';
import { MuroUsuarioUpdateComponent } from './update/muro-usuario-update.component';
import MuroUsuarioResolve from './route/muro-usuario-routing-resolve.service';

const muroUsuarioRoute: Routes = [
  {
    path: '',
    component: MuroUsuarioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MuroUsuarioDetailComponent,
    resolve: {
      muroUsuario: MuroUsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MuroUsuarioUpdateComponent,
    resolve: {
      muroUsuario: MuroUsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MuroUsuarioUpdateComponent,
    resolve: {
      muroUsuario: MuroUsuarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default muroUsuarioRoute;
