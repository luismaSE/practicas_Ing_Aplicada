import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMuroUsuario, NewMuroUsuario } from '../muro-usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMuroUsuario for edit and NewMuroUsuarioFormGroupInput for create.
 */
type MuroUsuarioFormGroupInput = IMuroUsuario | PartialWithRequiredKeyOf<NewMuroUsuario>;

type MuroUsuarioFormDefaults = Pick<NewMuroUsuario, 'id'>;

type MuroUsuarioFormGroupContent = {
  id: FormControl<IMuroUsuario['id'] | NewMuroUsuario['id']>;
  usuario: FormControl<IMuroUsuario['usuario']>;
};

export type MuroUsuarioFormGroup = FormGroup<MuroUsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MuroUsuarioFormService {
  createMuroUsuarioFormGroup(muroUsuario: MuroUsuarioFormGroupInput = { id: null }): MuroUsuarioFormGroup {
    const muroUsuarioRawValue = {
      ...this.getFormDefaults(),
      ...muroUsuario,
    };
    return new FormGroup<MuroUsuarioFormGroupContent>({
      id: new FormControl(
        { value: muroUsuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      usuario: new FormControl(muroUsuarioRawValue.usuario),
    });
  }

  getMuroUsuario(form: MuroUsuarioFormGroup): IMuroUsuario | NewMuroUsuario {
    return form.getRawValue() as IMuroUsuario | NewMuroUsuario;
  }

  resetForm(form: MuroUsuarioFormGroup, muroUsuario: MuroUsuarioFormGroupInput): void {
    const muroUsuarioRawValue = { ...this.getFormDefaults(), ...muroUsuario };
    form.reset(
      {
        ...muroUsuarioRawValue,
        id: { value: muroUsuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MuroUsuarioFormDefaults {
    return {
      id: null,
    };
  }
}
