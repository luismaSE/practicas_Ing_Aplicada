import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMensajePrivado } from '../mensaje-privado.model';
import { MensajePrivadoService } from '../service/mensaje-privado.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mensaje-privado-delete-dialog.component.html',
})
export class MensajePrivadoDeleteDialogComponent {
  mensajePrivado?: IMensajePrivado;

  constructor(protected mensajePrivadoService: MensajePrivadoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mensajePrivadoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
