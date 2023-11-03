import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mensaje',
        data: { pageTitle: 'microblogApp.mensaje.home.title' },
        loadChildren: () => import('./mensaje/mensaje.module').then(m => m.MensajeModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'microblogApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'mensaje-privado',
        data: { pageTitle: 'microblogApp.mensajePrivado.home.title' },
        loadChildren: () => import('./mensaje-privado/mensaje-privado.module').then(m => m.MensajePrivadoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
