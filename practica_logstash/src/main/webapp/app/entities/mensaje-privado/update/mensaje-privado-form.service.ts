import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMensajePrivado, NewMensajePrivado } from '../mensaje-privado.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMensajePrivado for edit and NewMensajePrivadoFormGroupInput for create.
 */
type MensajePrivadoFormGroupInput = IMensajePrivado | PartialWithRequiredKeyOf<NewMensajePrivado>;

type MensajePrivadoFormDefaults = Pick<NewMensajePrivado, 'id'>;

type MensajePrivadoFormGroupContent = {
  id: FormControl<IMensajePrivado['id'] | NewMensajePrivado['id']>;
  texto: FormControl<IMensajePrivado['texto']>;
  fecha: FormControl<IMensajePrivado['fecha']>;
  autor: FormControl<IMensajePrivado['autor']>;
  destino: FormControl<IMensajePrivado['destino']>;
};

export type MensajePrivadoFormGroup = FormGroup<MensajePrivadoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MensajePrivadoFormService {
  createMensajePrivadoFormGroup(mensajePrivado: MensajePrivadoFormGroupInput = { id: null }): MensajePrivadoFormGroup {
    const mensajePrivadoRawValue = {
      ...this.getFormDefaults(),
      ...mensajePrivado,
    };
    return new FormGroup<MensajePrivadoFormGroupContent>({
      id: new FormControl(
        { value: mensajePrivadoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      texto: new FormControl(mensajePrivadoRawValue.texto),
      fecha: new FormControl(mensajePrivadoRawValue.fecha),
      autor: new FormControl(mensajePrivadoRawValue.autor),
      destino: new FormControl(mensajePrivadoRawValue.destino),
    });
  }

  getMensajePrivado(form: MensajePrivadoFormGroup): IMensajePrivado | NewMensajePrivado {
    return form.getRawValue() as IMensajePrivado | NewMensajePrivado;
  }

  resetForm(form: MensajePrivadoFormGroup, mensajePrivado: MensajePrivadoFormGroupInput): void {
    const mensajePrivadoRawValue = { ...this.getFormDefaults(), ...mensajePrivado };
    form.reset(
      {
        ...mensajePrivadoRawValue,
        id: { value: mensajePrivadoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MensajePrivadoFormDefaults {
    return {
      id: null,
    };
  }
}
