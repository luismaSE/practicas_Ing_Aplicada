import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MensajeFormService, MensajeFormGroup } from './mensaje-form.service';
import { IMensaje } from '../mensaje.model';
import { MensajeService } from '../service/mensaje.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

@Component({
  selector: 'jhi-mensaje-update',
  templateUrl: './mensaje-update.component.html',
})
export class MensajeUpdateComponent implements OnInit {
  isSaving = false;
  mensaje: IMensaje | null = null;

  autorsCollection: IUsuario[] = [];

  editForm: MensajeFormGroup = this.mensajeFormService.createMensajeFormGroup();

  constructor(
    protected mensajeService: MensajeService,
    protected mensajeFormService: MensajeFormService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mensaje }) => {
      this.mensaje = mensaje;
      if (mensaje) {
        this.updateForm(mensaje);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mensaje = this.mensajeFormService.getMensaje(this.editForm);
    if (mensaje.id !== null) {
      this.subscribeToSaveResponse(this.mensajeService.update(mensaje));
    } else {
      this.subscribeToSaveResponse(this.mensajeService.create(mensaje));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMensaje>>): void {
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

  protected updateForm(mensaje: IMensaje): void {
    this.mensaje = mensaje;
    this.mensajeFormService.resetForm(this.editForm, mensaje);

    this.autorsCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(this.autorsCollection, mensaje.autor);
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query({ filter: 'mensajepublicado-is-null' })
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.mensaje?.autor)))
      .subscribe((usuarios: IUsuario[]) => (this.autorsCollection = usuarios));
  }
}
