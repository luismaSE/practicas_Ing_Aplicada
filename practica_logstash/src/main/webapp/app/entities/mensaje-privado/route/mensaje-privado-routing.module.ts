import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MensajePrivadoComponent } from '../list/mensaje-privado.component';
import { MensajePrivadoDetailComponent } from '../detail/mensaje-privado-detail.component';
import { MensajePrivadoUpdateComponent } from '../update/mensaje-privado-update.component';
import { MensajePrivadoRoutingResolveService } from './mensaje-privado-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mensajePrivadoRoute: Routes = [
  {
    path: '',
    component: MensajePrivadoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MensajePrivadoDetailComponent,
    resolve: {
      mensajePrivado: MensajePrivadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MensajePrivadoUpdateComponent,
    resolve: {
      mensajePrivado: MensajePrivadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MensajePrivadoUpdateComponent,
    resolve: {
      mensajePrivado: MensajePrivadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mensajePrivadoRoute)],
  exports: [RouterModule],
})
export class MensajePrivadoRoutingModule {}
