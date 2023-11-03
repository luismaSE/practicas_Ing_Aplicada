import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IMuroUsuario } from '../muro-usuario.model';

@Component({
  standalone: true,
  selector: 'jhi-muro-usuario-detail',
  templateUrl: './muro-usuario-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class MuroUsuarioDetailComponent {
  @Input() muroUsuario: IMuroUsuario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
