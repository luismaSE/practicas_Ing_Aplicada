import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EtiquetaComponent } from './list/etiqueta.component';
import { EtiquetaDetailComponent } from './detail/etiqueta-detail.component';
import { EtiquetaUpdateComponent } from './update/etiqueta-update.component';
import EtiquetaResolve from './route/etiqueta-routing-resolve.service';

const etiquetaRoute: Routes = [
  {
    path: '',
    component: EtiquetaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EtiquetaDetailComponent,
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EtiquetaUpdateComponent,
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EtiquetaUpdateComponent,
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default etiquetaRoute;
