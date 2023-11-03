import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MensajePrivadoComponent } from './list/mensaje-privado.component';
import { MensajePrivadoDetailComponent } from './detail/mensaje-privado-detail.component';
import { MensajePrivadoUpdateComponent } from './update/mensaje-privado-update.component';
import { MensajePrivadoDeleteDialogComponent } from './delete/mensaje-privado-delete-dialog.component';
import { MensajePrivadoRoutingModule } from './route/mensaje-privado-routing.module';

@NgModule({
  imports: [SharedModule, MensajePrivadoRoutingModule],
  declarations: [
    MensajePrivadoComponent,
    MensajePrivadoDetailComponent,
    MensajePrivadoUpdateComponent,
    MensajePrivadoDeleteDialogComponent,
  ],
})
export class MensajePrivadoModule {}
