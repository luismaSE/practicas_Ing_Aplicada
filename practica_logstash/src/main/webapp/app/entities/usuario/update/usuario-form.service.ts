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

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'admin' | 'siguiendos' | 'seguidores'>;

type UsuarioFormGroupContent = {
  id: FormControl<IUsuario['id'] | NewUsuario['id']>;
  alias: FormControl<IUsuario['alias']>;
  nombre: FormControl<IUsuario['nombre']>;
  correo: FormControl<IUsuario['correo']>;
  contrasenia: FormControl<IUsuario['contrasenia']>;
  descripcion: FormControl<IUsuario['descripcion']>;
  admin: FormControl<IUsuario['admin']>;
  siguiendos: FormControl<IUsuario['siguiendos']>;
  mensajeMencionado: FormControl<IUsuario['mensajeMencionado']>;
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
        }
      ),
      alias: new FormControl(usuarioRawValue.alias),
      nombre: new FormControl(usuarioRawValue.nombre),
      correo: new FormControl(usuarioRawValue.correo),
      contrasenia: new FormControl(usuarioRawValue.contrasenia),
      descripcion: new FormControl(usuarioRawValue.descripcion),
      admin: new FormControl(usuarioRawValue.admin),
      siguiendos: new FormControl(usuarioRawValue.siguiendos ?? []),
      mensajeMencionado: new FormControl(usuarioRawValue.mensajeMencionado),
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
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    return {
      id: null,
      admin: false,
      siguiendos: [],
      seguidores: [],
    };
  }
}
