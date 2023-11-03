import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mensaje-privado.test-samples';

import { MensajePrivadoFormService } from './mensaje-privado-form.service';

describe('MensajePrivado Form Service', () => {
  let service: MensajePrivadoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajePrivadoFormService);
  });

  describe('Service methods', () => {
    describe('createMensajePrivadoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMensajePrivadoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texto: expect.any(Object),
            fecha: expect.any(Object),
            autor: expect.any(Object),
            destino: expect.any(Object),
          })
        );
      });

      it('passing IMensajePrivado should create a new form with FormGroup', () => {
        const formGroup = service.createMensajePrivadoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texto: expect.any(Object),
            fecha: expect.any(Object),
            autor: expect.any(Object),
            destino: expect.any(Object),
          })
        );
      });
    });

    describe('getMensajePrivado', () => {
      it('should return NewMensajePrivado for default MensajePrivado initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMensajePrivadoFormGroup(sampleWithNewData);

        const mensajePrivado = service.getMensajePrivado(formGroup) as any;

        expect(mensajePrivado).toMatchObject(sampleWithNewData);
      });

      it('should return NewMensajePrivado for empty MensajePrivado initial value', () => {
        const formGroup = service.createMensajePrivadoFormGroup();

        const mensajePrivado = service.getMensajePrivado(formGroup) as any;

        expect(mensajePrivado).toMatchObject({});
      });

      it('should return IMensajePrivado', () => {
        const formGroup = service.createMensajePrivadoFormGroup(sampleWithRequiredData);

        const mensajePrivado = service.getMensajePrivado(formGroup) as any;

        expect(mensajePrivado).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMensajePrivado should not enable id FormControl', () => {
        const formGroup = service.createMensajePrivadoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMensajePrivado should disable id FormControl', () => {
        const formGroup = service.createMensajePrivadoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
