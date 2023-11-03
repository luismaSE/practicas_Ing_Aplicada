import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';
import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IMensaje } from 'app/entities/mensaje/mensaje.model';
import { MensajeService } from 'app/entities/mensaje/service/mensaje.service';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;

  usuariosSharedCollection: IUsuario[] = [];
  mensajesSharedCollection: IMensaje[] = [];

  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  constructor(
    protected usuarioService: UsuarioService,
    protected usuarioFormService: UsuarioFormService,
    protected mensajeService: MensajeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  compareMensaje = (o1: IMensaje | null, o2: IMensaje | null): boolean => this.mensajeService.compareMensaje(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
      if (usuario) {
        this.updateForm(usuario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.usuarioFormService.getUsuario(this.editForm);
    if (usuario.id !== null) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
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

  protected updateForm(usuario: IUsuario): void {
    this.usuario = usuario;
    this.usuarioFormService.resetForm(this.editForm, usuario);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      ...(usuario.siguiendos ?? [])
    );
    this.mensajesSharedCollection = this.mensajeService.addMensajeToCollectionIfMissing<IMensaje>(
      this.mensajesSharedCollection,
      usuario.mensajeMencionado
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, ...(this.usuario?.siguiendos ?? []))
        )
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.mensajeService
      .query()
      .pipe(map((res: HttpResponse<IMensaje[]>) => res.body ?? []))
      .pipe(
        map((mensajes: IMensaje[]) =>
          this.mensajeService.addMensajeToCollectionIfMissing<IMensaje>(mensajes, this.usuario?.mensajeMencionado)
        )
      )
      .subscribe((mensajes: IMensaje[]) => (this.mensajesSharedCollection = mensajes));
  }
}
