import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMensaje, NewMensaje } from '../mensaje.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMensaje for edit and NewMensajeFormGroupInput for create.
 */
type MensajeFormGroupInput = IMensaje | PartialWithRequiredKeyOf<NewMensaje>;

type MensajeFormDefaults = Pick<NewMensaje, 'id'>;

type MensajeFormGroupContent = {
  id: FormControl<IMensaje['id'] | NewMensaje['id']>;
  texto: FormControl<IMensaje['texto']>;
  fecha: FormControl<IMensaje['fecha']>;
  autor: FormControl<IMensaje['autor']>;
};

export type MensajeFormGroup = FormGroup<MensajeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MensajeFormService {
  createMensajeFormGroup(mensaje: MensajeFormGroupInput = { id: null }): MensajeFormGroup {
    const mensajeRawValue = {
      ...this.getFormDefaults(),
      ...mensaje,
    };
    return new FormGroup<MensajeFormGroupContent>({
      id: new FormControl(
        { value: mensajeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      texto: new FormControl(mensajeRawValue.texto),
      fecha: new FormControl(mensajeRawValue.fecha),
      autor: new FormControl(mensajeRawValue.autor),
    });
  }

  getMensaje(form: MensajeFormGroup): IMensaje | NewMensaje {
    return form.getRawValue() as IMensaje | NewMensaje;
  }

  resetForm(form: MensajeFormGroup, mensaje: MensajeFormGroupInput): void {
    const mensajeRawValue = { ...this.getFormDefaults(), ...mensaje };
    form.reset(
      {
        ...mensajeRawValue,
        id: { value: mensajeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MensajeFormDefaults {
    return {
      id: null,
    };
  }
}
