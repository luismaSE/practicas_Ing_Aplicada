import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';
import { TablonDeAnunciosService } from '../service/tablon-de-anuncios.service';

@Component({
  standalone: true,
  templateUrl: './tablon-de-anuncios-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TablonDeAnunciosDeleteDialogComponent {
  tablonDeAnuncios?: ITablonDeAnuncios;

  constructor(
    protected tablonDeAnunciosService: TablonDeAnunciosService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tablonDeAnunciosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
