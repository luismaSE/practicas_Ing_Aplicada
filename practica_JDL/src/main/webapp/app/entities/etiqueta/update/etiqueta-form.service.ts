import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEtiqueta, NewEtiqueta } from '../etiqueta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtiqueta for edit and NewEtiquetaFormGroupInput for create.
 */
type EtiquetaFormGroupInput = IEtiqueta | PartialWithRequiredKeyOf<NewEtiqueta>;

type EtiquetaFormDefaults = Pick<NewEtiqueta, 'id' | 'mensajes'>;

type EtiquetaFormGroupContent = {
  id: FormControl<IEtiqueta['id'] | NewEtiqueta['id']>;
  nombreEtiqueta: FormControl<IEtiqueta['nombreEtiqueta']>;
  mensajes: FormControl<IEtiqueta['mensajes']>;
  mensajes: FormControl<IEtiqueta['mensajes']>;
};

export type EtiquetaFormGroup = FormGroup<EtiquetaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtiquetaFormService {
  createEtiquetaFormGroup(etiqueta: EtiquetaFormGroupInput = { id: null }): EtiquetaFormGroup {
    const etiquetaRawValue = {
      ...this.getFormDefaults(),
      ...etiqueta,
    };
    return new FormGroup<EtiquetaFormGroupContent>({
      id: new FormControl(
        { value: etiquetaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombreEtiqueta: new FormControl(etiquetaRawValue.nombreEtiqueta),
      mensajes: new FormControl(etiquetaRawValue.mensajes),
      mensajes: new FormControl(etiquetaRawValue.mensajes ?? []),
    });
  }

  getEtiqueta(form: EtiquetaFormGroup): IEtiqueta | NewEtiqueta {
    return form.getRawValue() as IEtiqueta | NewEtiqueta;
  }

  resetForm(form: EtiquetaFormGroup, etiqueta: EtiquetaFormGroupInput): void {
    const etiquetaRawValue = { ...this.getFormDefaults(), ...etiqueta };
    form.reset(
      {
        ...etiquetaRawValue,
        id: { value: etiquetaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EtiquetaFormDefaults {
    return {
      id: null,
      mensajes: [],
    };
  }
}
