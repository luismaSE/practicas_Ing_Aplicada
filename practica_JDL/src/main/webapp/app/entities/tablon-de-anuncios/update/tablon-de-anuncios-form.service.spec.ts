import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tablon-de-anuncios.test-samples';

import { TablonDeAnunciosFormService } from './tablon-de-anuncios-form.service';

describe('TablonDeAnuncios Form Service', () => {
  let service: TablonDeAnunciosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablonDeAnunciosFormService);
  });

  describe('Service methods', () => {
    describe('createTablonDeAnunciosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          }),
        );
      });

      it('passing ITablonDeAnuncios should create a new form with FormGroup', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
          }),
        );
      });
    });

    describe('getTablonDeAnuncios', () => {
      it('should return NewTablonDeAnuncios for default TablonDeAnuncios initial value', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup(sampleWithNewData);

        const tablonDeAnuncios = service.getTablonDeAnuncios(formGroup) as any;

        expect(tablonDeAnuncios).toMatchObject(sampleWithNewData);
      });

      it('should return NewTablonDeAnuncios for empty TablonDeAnuncios initial value', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup();

        const tablonDeAnuncios = service.getTablonDeAnuncios(formGroup) as any;

        expect(tablonDeAnuncios).toMatchObject({});
      });

      it('should return ITablonDeAnuncios', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup(sampleWithRequiredData);

        const tablonDeAnuncios = service.getTablonDeAnuncios(formGroup) as any;

        expect(tablonDeAnuncios).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITablonDeAnuncios should not enable id FormControl', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTablonDeAnuncios should disable id FormControl', () => {
        const formGroup = service.createTablonDeAnunciosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
