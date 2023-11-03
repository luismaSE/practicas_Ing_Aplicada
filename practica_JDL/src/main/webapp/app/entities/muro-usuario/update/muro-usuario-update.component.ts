import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMuroUsuario } from '../muro-usuario.model';
import { MuroUsuarioService } from '../service/muro-usuario.service';
import { MuroUsuarioFormService, MuroUsuarioFormGroup } from './muro-usuario-form.service';

@Component({
  standalone: true,
  selector: 'jhi-muro-usuario-update',
  templateUrl: './muro-usuario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MuroUsuarioUpdateComponent implements OnInit {
  isSaving = false;
  muroUsuario: IMuroUsuario | null = null;

  editForm: MuroUsuarioFormGroup = this.muroUsuarioFormService.createMuroUsuarioFormGroup();

  constructor(
    protected muroUsuarioService: MuroUsuarioService,
    protected muroUsuarioFormService: MuroUsuarioFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ muroUsuario }) => {
      this.muroUsuario = muroUsuario;
      if (muroUsuario) {
        this.updateForm(muroUsuario);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const muroUsuario = this.muroUsuarioFormService.getMuroUsuario(this.editForm);
    if (muroUsuario.id !== null) {
      this.subscribeToSaveResponse(this.muroUsuarioService.update(muroUsuario));
    } else {
      this.subscribeToSaveResponse(this.muroUsuarioService.create(muroUsuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMuroUsuario>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(muroUsuario: IMuroUsuario): void {
    this.muroUsuario = muroUsuario;
    this.muroUsuarioFormService.resetForm(this.editForm, muroUsuario);
  }
}
