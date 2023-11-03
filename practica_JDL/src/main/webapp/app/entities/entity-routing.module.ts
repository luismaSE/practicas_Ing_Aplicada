import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'jhLogstashApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.routes'),
      },
      {
        path: 'mensaje',
        data: { pageTitle: 'jhLogstashApp.mensaje.home.title' },
        loadChildren: () => import('./mensaje/mensaje.routes'),
      },
      {
        path: 'etiqueta',
        data: { pageTitle: 'jhLogstashApp.etiqueta.home.title' },
        loadChildren: () => import('./etiqueta/etiqueta.routes'),
      },
      {
        path: 'tablon-de-anuncios',
        data: { pageTitle: 'jhLogstashApp.tablonDeAnuncios.home.title' },
        loadChildren: () => import('./tablon-de-anuncios/tablon-de-anuncios.routes'),
      },
      {
        path: 'muro-usuario',
        data: { pageTitle: 'jhLogstashApp.muroUsuario.home.title' },
        loadChildren: () => import('./muro-usuario/muro-usuario.routes'),
      },
      {
        path: 'tema-del-momento',
        data: { pageTitle: 'jhLogstashApp.temaDelMomento.home.title' },
        loadChildren: () => import('./tema-del-momento/tema-del-momento.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
