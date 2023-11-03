import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMensaje } from '../mensaje.model';
import { MensajeService } from '../service/mensaje.service';

@Component({
  standalone: true,
  templateUrl: './mensaje-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MensajeDeleteDialogComponent {
  mensaje?: IMensaje;

  constructor(
    protected mensajeService: MensajeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mensajeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
