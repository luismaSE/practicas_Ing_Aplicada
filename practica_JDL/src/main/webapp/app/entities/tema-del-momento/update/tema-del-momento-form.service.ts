import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITemaDelMomento, NewTemaDelMomento } from '../tema-del-momento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITemaDelMomento for edit and NewTemaDelMomentoFormGroupInput for create.
 */
type TemaDelMomentoFormGroupInput = ITemaDelMomento | PartialWithRequiredKeyOf<NewTemaDelMomento>;

type TemaDelMomentoFormDefaults = Pick<NewTemaDelMomento, 'id'>;

type TemaDelMomentoFormGroupContent = {
  id: FormControl<ITemaDelMomento['id'] | NewTemaDelMomento['id']>;
  etiqueta: FormControl<ITemaDelMomento['etiqueta']>;
  numeroRepeticiones: FormControl<ITemaDelMomento['numeroRepeticiones']>;
};

export type TemaDelMomentoFormGroup = FormGroup<TemaDelMomentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TemaDelMomentoFormService {
  createTemaDelMomentoFormGroup(temaDelMomento: TemaDelMomentoFormGroupInput = { id: null }): TemaDelMomentoFormGroup {
    const temaDelMomentoRawValue = {
      ...this.getFormDefaults(),
      ...temaDelMomento,
    };
    return new FormGroup<TemaDelMomentoFormGroupContent>({
      id: new FormControl(
        { value: temaDelMomentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      etiqueta: new FormControl(temaDelMomentoRawValue.etiqueta),
      numeroRepeticiones: new FormControl(temaDelMomentoRawValue.numeroRepeticiones),
    });
  }

  getTemaDelMomento(form: TemaDelMomentoFormGroup): ITemaDelMomento | NewTemaDelMomento {
    return form.getRawValue() as ITemaDelMomento | NewTemaDelMomento;
  }

  resetForm(form: TemaDelMomentoFormGroup, temaDelMomento: TemaDelMomentoFormGroupInput): void {
    const temaDelMomentoRawValue = { ...this.getFormDefaults(), ...temaDelMomento };
    form.reset(
      {
        ...temaDelMomentoRawValue,
        id: { value: temaDelMomentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TemaDelMomentoFormDefaults {
    return {
      id: null,
    };
  }
}
