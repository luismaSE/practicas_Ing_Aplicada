import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TemaDelMomentoComponent } from './list/tema-del-momento.component';
import { TemaDelMomentoDetailComponent } from './detail/tema-del-momento-detail.component';
import { TemaDelMomentoUpdateComponent } from './update/tema-del-momento-update.component';
import TemaDelMomentoResolve from './route/tema-del-momento-routing-resolve.service';

const temaDelMomentoRoute: Routes = [
  {
    path: '',
    component: TemaDelMomentoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TemaDelMomentoDetailComponent,
    resolve: {
      temaDelMomento: TemaDelMomentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TemaDelMomentoUpdateComponent,
    resolve: {
      temaDelMomento: TemaDelMomentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TemaDelMomentoUpdateComponent,
    resolve: {
      temaDelMomento: TemaDelMomentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default temaDelMomentoRoute;
