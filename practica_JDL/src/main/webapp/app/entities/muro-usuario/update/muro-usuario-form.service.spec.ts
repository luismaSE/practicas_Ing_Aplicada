import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../muro-usuario.test-samples';

import { MuroUsuarioFormService } from './muro-usuario-form.service';

describe('MuroUsuario Form Service', () => {
  let service: MuroUsuarioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuroUsuarioFormService);
  });

  describe('Service methods', () => {
    describe('createMuroUsuarioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMuroUsuarioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });

      it('passing IMuroUsuario should create a new form with FormGroup', () => {
        const formGroup = service.createMuroUsuarioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });
    });

    describe('getMuroUsuario', () => {
      it('should return NewMuroUsuario for default MuroUsuario initial value', () => {
        const formGroup = service.createMuroUsuarioFormGroup(sampleWithNewData);

        const muroUsuario = service.getMuroUsuario(formGroup) as any;

        expect(muroUsuario).toMatchObject(sampleWithNewData);
      });

      it('should return NewMuroUsuario for empty MuroUsuario initial value', () => {
        const formGroup = service.createMuroUsuarioFormGroup();

        const muroUsuario = service.getMuroUsuario(formGroup) as any;

        expect(muroUsuario).toMatchObject({});
      });

      it('should return IMuroUsuario', () => {
        const formGroup = service.createMuroUsuarioFormGroup(sampleWithRequiredData);

        const muroUsuario = service.getMuroUsuario(formGroup) as any;

        expect(muroUsuario).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMuroUsuario should not enable id FormControl', () => {
        const formGroup = service.createMuroUsuarioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMuroUsuario should disable id FormControl', () => {
        const formGroup = service.createMuroUsuarioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
