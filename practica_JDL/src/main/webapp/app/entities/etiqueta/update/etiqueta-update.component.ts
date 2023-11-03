import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtiqueta } from '../etiqueta.model';
import { EtiquetaService } from '../service/etiqueta.service';
import { EtiquetaFormService, EtiquetaFormGroup } from './etiqueta-form.service';

@Component({
  standalone: true,
  selector: 'jhi-etiqueta-update',
  templateUrl: './etiqueta-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtiquetaUpdateComponent implements OnInit {
  isSaving = false;
  etiqueta: IEtiqueta | null = null;

  editForm: EtiquetaFormGroup = this.etiquetaFormService.createEtiquetaFormGroup();

  constructor(
    protected etiquetaService: EtiquetaService,
    protected etiquetaFormService: EtiquetaFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etiqueta }) => {
      this.etiqueta = etiqueta;
      if (etiqueta) {
        this.updateForm(etiqueta);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etiqueta = this.etiquetaFormService.getEtiqueta(this.editForm);
    if (etiqueta.id !== null) {
      this.subscribeToSaveResponse(this.etiquetaService.update(etiqueta));
    } else {
      this.subscribeToSaveResponse(this.etiquetaService.create(etiqueta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtiqueta>>): void {
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

  protected updateForm(etiqueta: IEtiqueta): void {
    this.etiqueta = etiqueta;
    this.etiquetaFormService.resetForm(this.editForm, etiqueta);
  }
}
