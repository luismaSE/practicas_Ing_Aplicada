import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mensaje.test-samples';

import { MensajeFormService } from './mensaje-form.service';

describe('Mensaje Form Service', () => {
  let service: MensajeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeFormService);
  });

  describe('Service methods', () => {
    describe('createMensajeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMensajeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texto: expect.any(Object),
            fecha: expect.any(Object),
            autor: expect.any(Object),
          })
        );
      });

      it('passing IMensaje should create a new form with FormGroup', () => {
        const formGroup = service.createMensajeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texto: expect.any(Object),
            fecha: expect.any(Object),
            autor: expect.any(Object),
          })
        );
      });
    });

    describe('getMensaje', () => {
      it('should return NewMensaje for default Mensaje initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMensajeFormGroup(sampleWithNewData);

        const mensaje = service.getMensaje(formGroup) as any;

        expect(mensaje).toMatchObject(sampleWithNewData);
      });

      it('should return NewMensaje for empty Mensaje initial value', () => {
        const formGroup = service.createMensajeFormGroup();

        const mensaje = service.getMensaje(formGroup) as any;

        expect(mensaje).toMatchObject({});
      });

      it('should return IMensaje', () => {
        const formGroup = service.createMensajeFormGroup(sampleWithRequiredData);

        const mensaje = service.getMensaje(formGroup) as any;

        expect(mensaje).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMensaje should not enable id FormControl', () => {
        const formGroup = service.createMensajeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMensaje should disable id FormControl', () => {
        const formGroup = service.createMensajeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
