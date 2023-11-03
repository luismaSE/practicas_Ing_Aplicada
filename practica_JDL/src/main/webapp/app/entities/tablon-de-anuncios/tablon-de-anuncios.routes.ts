import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TablonDeAnunciosComponent } from './list/tablon-de-anuncios.component';
import { TablonDeAnunciosDetailComponent } from './detail/tablon-de-anuncios-detail.component';
import { TablonDeAnunciosUpdateComponent } from './update/tablon-de-anuncios-update.component';
import TablonDeAnunciosResolve from './route/tablon-de-anuncios-routing-resolve.service';

const tablonDeAnunciosRoute: Routes = [
  {
    path: '',
    component: TablonDeAnunciosComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TablonDeAnunciosDetailComponent,
    resolve: {
      tablonDeAnuncios: TablonDeAnunciosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TablonDeAnunciosUpdateComponent,
    resolve: {
      tablonDeAnuncios: TablonDeAnunciosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TablonDeAnunciosUpdateComponent,
    resolve: {
      tablonDeAnuncios: TablonDeAnunciosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tablonDeAnunciosRoute;
