import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tema-del-momento.test-samples';

import { TemaDelMomentoFormService } from './tema-del-momento-form.service';

describe('TemaDelMomento Form Service', () => {
  let service: TemaDelMomentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemaDelMomentoFormService);
  });

  describe('Service methods', () => {
    describe('createTemaDelMomentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTemaDelMomentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            etiqueta: expect.any(Object),
            numeroRepeticiones: expect.any(Object),
          }),
        );
      });

      it('passing ITemaDelMomento should create a new form with FormGroup', () => {
        const formGroup = service.createTemaDelMomentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            etiqueta: expect.any(Object),
            numeroRepeticiones: expect.any(Object),
          }),
        );
      });
    });

    describe('getTemaDelMomento', () => {
      it('should return NewTemaDelMomento for default TemaDelMomento initial value', () => {
        const formGroup = service.createTemaDelMomentoFormGroup(sampleWithNewData);

        const temaDelMomento = service.getTemaDelMomento(formGroup) as any;

        expect(temaDelMomento).toMatchObject(sampleWithNewData);
      });

      it('should return NewTemaDelMomento for empty TemaDelMomento initial value', () => {
        const formGroup = service.createTemaDelMomentoFormGroup();

        const temaDelMomento = service.getTemaDelMomento(formGroup) as any;

        expect(temaDelMomento).toMatchObject({});
      });

      it('should return ITemaDelMomento', () => {
        const formGroup = service.createTemaDelMomentoFormGroup(sampleWithRequiredData);

        const temaDelMomento = service.getTemaDelMomento(formGroup) as any;

        expect(temaDelMomento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITemaDelMomento should not enable id FormControl', () => {
        const formGroup = service.createTemaDelMomentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTemaDelMomento should disable id FormControl', () => {
        const formGroup = service.createTemaDelMomentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
