import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMuroUsuario } from '../muro-usuario.model';
import { MuroUsuarioService } from '../service/muro-usuario.service';

@Component({
  standalone: true,
  templateUrl: './muro-usuario-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MuroUsuarioDeleteDialogComponent {
  muroUsuario?: IMuroUsuario;

  constructor(
    protected muroUsuarioService: MuroUsuarioService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.muroUsuarioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
