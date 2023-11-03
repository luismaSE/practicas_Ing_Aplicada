import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITemaDelMomento } from '../tema-del-momento.model';
import { TemaDelMomentoService } from '../service/tema-del-momento.service';

@Component({
  standalone: true,
  templateUrl: './tema-del-momento-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TemaDelMomentoDeleteDialogComponent {
  temaDelMomento?: ITemaDelMomento;

  constructor(
    protected temaDelMomentoService: TemaDelMomentoService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.temaDelMomentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
