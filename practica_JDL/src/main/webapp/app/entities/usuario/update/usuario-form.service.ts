import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUsuario, NewUsuario } from '../usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsuario for edit and NewUsuarioFormGroupInput for create.
 */
type UsuarioFormGroupInput = IUsuario | PartialWithRequiredKeyOf<NewUsuario>;

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'seguidos' | 'seguidores'>;

type UsuarioFormGroupContent = {
  id: FormControl<IUsuario['id'] | NewUsuario['id']>;
  nombreUsuario: FormControl<IUsuario['nombreUsuario']>;
  correo: FormControl<IUsuario['correo']>;
  clave: FormControl<IUsuario['clave']>;
  nombreCompleto: FormControl<IUsuario['nombreCompleto']>;
  descripcion: FormControl<IUsuario['descripcion']>;
  seguidos: FormControl<IUsuario['seguidos']>;
  seguidores: FormControl<IUsuario['seguidores']>;
  muro: FormControl<IUsuario['muro']>;
  mensajes: FormControl<IUsuario['mensajes']>;
  muro: FormControl<IUsuario['muro']>;
  seguidos: FormControl<IUsuario['seguidos']>;
  seguidores: FormControl<IUsuario['seguidores']>;
};

export type UsuarioFormGroup = FormGroup<UsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsuarioFormService {
  createUsuarioFormGroup(usuario: UsuarioFormGroupInput = { id: null }): UsuarioFormGroup {
    const usuarioRawValue = {
      ...this.getFormDefaults(),
      ...usuario,
    };
    return new FormGroup<UsuarioFormGroupContent>({
      id: new FormControl(
        { value: usuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombreUsuario: new FormControl(usuarioRawValue.nombreUsuario, {
        validators: [Validators.required],
      }),
      correo: new FormControl(usuarioRawValue.correo),
      clave: new FormControl(usuarioRawValue.clave),
      nombreCompleto: new FormControl(usuarioRawValue.nombreCompleto),
      descripcion: new FormControl(usuarioRawValue.descripcion),
      seguidos: new FormControl(usuarioRawValue.seguidos),
      seguidores: new FormControl(usuarioRawValue.seguidores),
      muro: new FormControl(usuarioRawValue.muro),
      mensajes: new FormControl(usuarioRawValue.mensajes),
      muro: new FormControl(usuarioRawValue.muro),
      seguidos: new FormControl(usuarioRawValue.seguidos ?? []),
      seguidores: new FormControl(usuarioRawValue.seguidores ?? []),
    });
  }

  getUsuario(form: UsuarioFormGroup): IUsuario | NewUsuario {
    return form.getRawValue() as IUsuario | NewUsuario;
  }

  resetForm(form: UsuarioFormGroup, usuario: UsuarioFormGroupInput): void {
    const usuarioRawValue = { ...this.getFormDefaults(), ...usuario };
    form.reset(
      {
        ...usuarioRawValue,
        id: { value: usuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    return {
      id: null,
      seguidos: [],
      seguidores: [],
    };
  }
}
