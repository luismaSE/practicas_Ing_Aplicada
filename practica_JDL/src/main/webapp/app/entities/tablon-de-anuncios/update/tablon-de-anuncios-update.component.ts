import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';
import { TablonDeAnunciosService } from '../service/tablon-de-anuncios.service';
import { TablonDeAnunciosFormService, TablonDeAnunciosFormGroup } from './tablon-de-anuncios-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tablon-de-anuncios-update',
  templateUrl: './tablon-de-anuncios-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TablonDeAnunciosUpdateComponent implements OnInit {
  isSaving = false;
  tablonDeAnuncios: ITablonDeAnuncios | null = null;

  editForm: TablonDeAnunciosFormGroup = this.tablonDeAnunciosFormService.createTablonDeAnunciosFormGroup();

  constructor(
    protected tablonDeAnunciosService: TablonDeAnunciosService,
    protected tablonDeAnunciosFormService: TablonDeAnunciosFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tablonDeAnuncios }) => {
      this.tablonDeAnuncios = tablonDeAnuncios;
      if (tablonDeAnuncios) {
        this.updateForm(tablonDeAnuncios);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tablonDeAnuncios = this.tablonDeAnunciosFormService.getTablonDeAnuncios(this.editForm);
    if (tablonDeAnuncios.id !== null) {
      this.subscribeToSaveResponse(this.tablonDeAnunciosService.update(tablonDeAnuncios));
    } else {
      this.subscribeToSaveResponse(this.tablonDeAnunciosService.create(tablonDeAnuncios));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITablonDeAnuncios>>): void {
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

  protected updateForm(tablonDeAnuncios: ITablonDeAnuncios): void {
    this.tablonDeAnuncios = tablonDeAnuncios;
    this.tablonDeAnunciosFormService.resetForm(this.editForm, tablonDeAnuncios);
  }
}
