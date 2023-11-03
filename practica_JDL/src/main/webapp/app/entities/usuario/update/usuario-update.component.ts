import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMuroUsuario } from 'app/entities/muro-usuario/muro-usuario.model';
import { MuroUsuarioService } from 'app/entities/muro-usuario/service/muro-usuario.service';
import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';

@Component({
  standalone: true,
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;

  murosCollection: IMuroUsuario[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  constructor(
    protected usuarioService: UsuarioService,
    protected usuarioFormService: UsuarioFormService,
    protected muroUsuarioService: MuroUsuarioService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareMuroUsuario = (o1: IMuroUsuario | null, o2: IMuroUsuario | null): boolean => this.muroUsuarioService.compareMuroUsuario(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

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

    this.murosCollection = this.muroUsuarioService.addMuroUsuarioToCollectionIfMissing<IMuroUsuario>(this.murosCollection, usuario.muro);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      ...(usuario.seguidos ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.muroUsuarioService
      .query({ filter: 'usuario-is-null' })
      .pipe(map((res: HttpResponse<IMuroUsuario[]>) => res.body ?? []))
      .pipe(
        map((muroUsuarios: IMuroUsuario[]) =>
          this.muroUsuarioService.addMuroUsuarioToCollectionIfMissing<IMuroUsuario>(muroUsuarios, this.usuario?.muro),
        ),
      )
      .subscribe((muroUsuarios: IMuroUsuario[]) => (this.murosCollection = muroUsuarios));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, ...(this.usuario?.seguidos ?? [])),
        ),
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
