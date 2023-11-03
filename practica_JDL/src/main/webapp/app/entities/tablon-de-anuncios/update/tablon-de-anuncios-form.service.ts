import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITablonDeAnuncios, NewTablonDeAnuncios } from '../tablon-de-anuncios.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITablonDeAnuncios for edit and NewTablonDeAnunciosFormGroupInput for create.
 */
type TablonDeAnunciosFormGroupInput = ITablonDeAnuncios | PartialWithRequiredKeyOf<NewTablonDeAnuncios>;

type TablonDeAnunciosFormDefaults = Pick<NewTablonDeAnuncios, 'id'>;

type TablonDeAnunciosFormGroupContent = {
  id: FormControl<ITablonDeAnuncios['id'] | NewTablonDeAnuncios['id']>;
};

export type TablonDeAnunciosFormGroup = FormGroup<TablonDeAnunciosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TablonDeAnunciosFormService {
  createTablonDeAnunciosFormGroup(tablonDeAnuncios: TablonDeAnunciosFormGroupInput = { id: null }): TablonDeAnunciosFormGroup {
    const tablonDeAnunciosRawValue = {
      ...this.getFormDefaults(),
      ...tablonDeAnuncios,
    };
    return new FormGroup<TablonDeAnunciosFormGroupContent>({
      id: new FormControl(
        { value: tablonDeAnunciosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
    });
  }

  getTablonDeAnuncios(form: TablonDeAnunciosFormGroup): ITablonDeAnuncios | NewTablonDeAnuncios {
    if (form.controls.id.disabled) {
      // form.value returns id with null value for FormGroup with only one FormControl
      return { id: null };
    }
    return form.getRawValue() as ITablonDeAnuncios | NewTablonDeAnuncios;
  }

  resetForm(form: TablonDeAnunciosFormGroup, tablonDeAnuncios: TablonDeAnunciosFormGroupInput): void {
    const tablonDeAnunciosRawValue = { ...this.getFormDefaults(), ...tablonDeAnuncios };
    form.reset(
      {
        ...tablonDeAnunciosRawValue,
        id: { value: tablonDeAnunciosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TablonDeAnunciosFormDefaults {
    return {
      id: null,
    };
  }
}
