import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMensaje } from '../mensaje.model';
import { MensajeService } from '../service/mensaje.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mensaje-delete-dialog.component.html',
})
export class MensajeDeleteDialogComponent {
  mensaje?: IMensaje;

  constructor(protected mensajeService: MensajeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mensajeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
