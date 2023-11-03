import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMensaje | NewMensaje> = Omit<T, 'fechaPublicacion'> & {
  fechaPublicacion?: string | null;
};

type MensajeFormRawValue = FormValueOf<IMensaje>;

type NewMensajeFormRawValue = FormValueOf<NewMensaje>;

type MensajeFormDefaults = Pick<NewMensaje, 'id' | 'fechaPublicacion' | 'etiquetas'>;

type MensajeFormGroupContent = {
  id: FormControl<MensajeFormRawValue['id'] | NewMensaje['id']>;
  autor: FormControl<MensajeFormRawValue['autor']>;
  fechaPublicacion: FormControl<MensajeFormRawValue['fechaPublicacion']>;
  textoMensaje: FormControl<MensajeFormRawValue['textoMensaje']>;
  etiquetas: FormControl<MensajeFormRawValue['etiquetas']>;
  autor: FormControl<MensajeFormRawValue['autor']>;
  etiquetas: FormControl<MensajeFormRawValue['etiquetas']>;
};

export type MensajeFormGroup = FormGroup<MensajeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MensajeFormService {
  createMensajeFormGroup(mensaje: MensajeFormGroupInput = { id: null }): MensajeFormGroup {
    const mensajeRawValue = this.convertMensajeToMensajeRawValue({
      ...this.getFormDefaults(),
      ...mensaje,
    });
    return new FormGroup<MensajeFormGroupContent>({
      id: new FormControl(
        { value: mensajeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      autor: new FormControl(mensajeRawValue.autor),
      fechaPublicacion: new FormControl(mensajeRawValue.fechaPublicacion),
      textoMensaje: new FormControl(mensajeRawValue.textoMensaje),
      etiquetas: new FormControl(mensajeRawValue.etiquetas),
      autor: new FormControl(mensajeRawValue.autor),
      etiquetas: new FormControl(mensajeRawValue.etiquetas ?? []),
    });
  }

  getMensaje(form: MensajeFormGroup): IMensaje | NewMensaje {
    return this.convertMensajeRawValueToMensaje(form.getRawValue() as MensajeFormRawValue | NewMensajeFormRawValue);
  }

  resetForm(form: MensajeFormGroup, mensaje: MensajeFormGroupInput): void {
    const mensajeRawValue = this.convertMensajeToMensajeRawValue({ ...this.getFormDefaults(), ...mensaje });
    form.reset(
      {
        ...mensajeRawValue,
        id: { value: mensajeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MensajeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaPublicacion: currentTime,
      etiquetas: [],
    };
  }

  private convertMensajeRawValueToMensaje(rawMensaje: MensajeFormRawValue | NewMensajeFormRawValue): IMensaje | NewMensaje {
    return {
      ...rawMensaje,
      fechaPublicacion: dayjs(rawMensaje.fechaPublicacion, DATE_TIME_FORMAT),
    };
  }

  private convertMensajeToMensajeRawValue(
    mensaje: IMensaje | (Partial<NewMensaje> & MensajeFormDefaults),
  ): MensajeFormRawValue | PartialWithRequiredKeyOf<NewMensajeFormRawValue> {
    return {
      ...mensaje,
      fechaPublicacion: mensaje.fechaPublicacion ? mensaje.fechaPublicacion.format(DATE_TIME_FORMAT) : undefined,
      etiquetas: mensaje.etiquetas ?? [],
    };
  }
}
