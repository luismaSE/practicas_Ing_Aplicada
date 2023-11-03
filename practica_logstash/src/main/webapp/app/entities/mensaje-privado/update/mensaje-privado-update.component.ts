import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MensajePrivadoFormService, MensajePrivadoFormGroup } from './mensaje-privado-form.service';
import { IMensajePrivado } from '../mensaje-privado.model';
import { MensajePrivadoService } from '../service/mensaje-privado.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-mensaje-privado-update',
  templateUrl: './mensaje-privado-update.component.html',
})
export class MensajePrivadoUpdateComponent implements OnInit {
  isSaving = false;
  mensajePrivado: IMensajePrivado | null = null;

  autorsCollection: IUsuario[] = [];
  destinosCollection: IUsuario[] = [];

  editForm: MensajePrivadoFormGroup = this.mensajePrivadoFormService.createMensajePrivadoFormGroup();

  constructor(
    protected mensajePrivadoService: MensajePrivadoService,
    protected mensajePrivadoFormService: MensajePrivadoFormService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mensajePrivado }) => {
      this.mensajePrivado = mensajePrivado;
      if (mensajePrivado) {
        this.updateForm(mensajePrivado);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mensajePrivado = this.mensajePrivadoFormService.getMensajePrivado(this.editForm);
    if (mensajePrivado.id !== null) {
      this.subscribeToSaveResponse(this.mensajePrivadoService.update(mensajePrivado));
    } else {
      this.subscribeToSaveResponse(this.mensajePrivadoService.create(mensajePrivado));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMensajePrivado>>): void {
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

  protected updateForm(mensajePrivado: IMensajePrivado): void {
    this.mensajePrivado = mensajePrivado;
    this.mensajePrivadoFormService.resetForm(this.editForm, mensajePrivado);

    this.autorsCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(this.autorsCollection, mensajePrivado.autor);
    this.destinosCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.destinosCollection,
      mensajePrivado.destino
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query({ filter: 'mensajeprivadoenviado-is-null' })
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.mensajePrivado?.autor))
      )
      .subscribe((usuarios: IUsuario[]) => (this.autorsCollection = usuarios));

    this.usuarioService
      .query({ filter: 'mensajeprivadorecibido-is-null' })
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.mensajePrivado?.destino))
      )
      .subscribe((usuarios: IUsuario[]) => (this.destinosCollection = usuarios));
  }
}
