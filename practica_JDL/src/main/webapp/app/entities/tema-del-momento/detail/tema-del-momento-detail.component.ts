import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITemaDelMomento } from '../tema-del-momento.model';

@Component({
  standalone: true,
  selector: 'jhi-tema-del-momento-detail',
  templateUrl: './tema-del-momento-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TemaDelMomentoDetailComponent {
  @Input() temaDelMomento: ITemaDelMomento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
