import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IEtiqueta } from 'app/entities/etiqueta/etiqueta.model';
import { EtiquetaService } from 'app/entities/etiqueta/service/etiqueta.service';
import { MensajeService } from '../service/mensaje.service';
import { IMensaje } from '../mensaje.model';
import { MensajeFormService, MensajeFormGroup } from './mensaje-form.service';

@Component({
  standalone: true,
  selector: 'jhi-mensaje-update',
  templateUrl: './mensaje-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MensajeUpdateComponent implements OnInit {
  isSaving = false;
  mensaje: IMensaje | null = null;

  usuariosSharedCollection: IUsuario[] = [];
  etiquetasSharedCollection: IEtiqueta[] = [];

  editForm: MensajeFormGroup = this.mensajeFormService.createMensajeFormGroup();

  constructor(
    protected mensajeService: MensajeService,
    protected mensajeFormService: MensajeFormService,
    protected usuarioService: UsuarioService,
    protected etiquetaService: EtiquetaService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  compareEtiqueta = (o1: IEtiqueta | null, o2: IEtiqueta | null): boolean => this.etiquetaService.compareEtiqueta(o1, o2);

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

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      mensaje.autor,
    );
    this.etiquetasSharedCollection = this.etiquetaService.addEtiquetaToCollectionIfMissing<IEtiqueta>(
      this.etiquetasSharedCollection,
      ...(mensaje.etiquetas ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.mensaje?.autor)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.etiquetaService
      .query()
      .pipe(map((res: HttpResponse<IEtiqueta[]>) => res.body ?? []))
      .pipe(
        map((etiquetas: IEtiqueta[]) =>
          this.etiquetaService.addEtiquetaToCollectionIfMissing<IEtiqueta>(etiquetas, ...(this.mensaje?.etiquetas ?? [])),
        ),
      )
      .subscribe((etiquetas: IEtiqueta[]) => (this.etiquetasSharedCollection = etiquetas));
  }
}
