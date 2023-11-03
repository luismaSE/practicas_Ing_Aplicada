import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';

@Component({
  standalone: true,
  selector: 'jhi-tablon-de-anuncios-detail',
  templateUrl: './tablon-de-anuncios-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TablonDeAnunciosDetailComponent {
  @Input() tablonDeAnuncios: ITablonDeAnuncios | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
