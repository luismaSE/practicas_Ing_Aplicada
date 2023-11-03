import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITemaDelMomento } from '../tema-del-momento.model';
import { TemaDelMomentoService } from '../service/tema-del-momento.service';
import { TemaDelMomentoFormService, TemaDelMomentoFormGroup } from './tema-del-momento-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tema-del-momento-update',
  templateUrl: './tema-del-momento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TemaDelMomentoUpdateComponent implements OnInit {
  isSaving = false;
  temaDelMomento: ITemaDelMomento | null = null;

  editForm: TemaDelMomentoFormGroup = this.temaDelMomentoFormService.createTemaDelMomentoFormGroup();

  constructor(
    protected temaDelMomentoService: TemaDelMomentoService,
    protected temaDelMomentoFormService: TemaDelMomentoFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ temaDelMomento }) => {
      this.temaDelMomento = temaDelMomento;
      if (temaDelMomento) {
        this.updateForm(temaDelMomento);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const temaDelMomento = this.temaDelMomentoFormService.getTemaDelMomento(this.editForm);
    if (temaDelMomento.id !== null) {
      this.subscribeToSaveResponse(this.temaDelMomentoService.update(temaDelMomento));
    } else {
      this.subscribeToSaveResponse(this.temaDelMomentoService.create(temaDelMomento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITemaDelMomento>>): void {
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

  protected updateForm(temaDelMomento: ITemaDelMomento): void {
    this.temaDelMomento = temaDelMomento;
    this.temaDelMomentoFormService.resetForm(this.editForm, temaDelMomento);
  }
}
