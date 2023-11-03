import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MuroUsuarioService } from '../service/muro-usuario.service';
import { IMuroUsuario } from '../muro-usuario.model';
import { MuroUsuarioFormService } from './muro-usuario-form.service';

import { MuroUsuarioUpdateComponent } from './muro-usuario-update.component';

describe('MuroUsuario Management Update Component', () => {
  let comp: MuroUsuarioUpdateComponent;
  let fixture: ComponentFixture<MuroUsuarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let muroUsuarioFormService: MuroUsuarioFormService;
  let muroUsuarioService: MuroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MuroUsuarioUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MuroUsuarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MuroUsuarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    muroUsuarioFormService = TestBed.inject(MuroUsuarioFormService);
    muroUsuarioService = TestBed.inject(MuroUsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const muroUsuario: IMuroUsuario = { id: 456 };

      activatedRoute.data = of({ muroUsuario });
      comp.ngOnInit();

      expect(comp.muroUsuario).toEqual(muroUsuario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMuroUsuario>>();
      const muroUsuario = { id: 123 };
      jest.spyOn(muroUsuarioFormService, 'getMuroUsuario').mockReturnValue(muroUsuario);
      jest.spyOn(muroUsuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muroUsuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: muroUsuario }));
      saveSubject.complete();

      // THEN
      expect(muroUsuarioFormService.getMuroUsuario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(muroUsuarioService.update).toHaveBeenCalledWith(expect.objectContaining(muroUsuario));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMuroUsuario>>();
      const muroUsuario = { id: 123 };
      jest.spyOn(muroUsuarioFormService, 'getMuroUsuario').mockReturnValue({ id: null });
      jest.spyOn(muroUsuarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muroUsuario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: muroUsuario }));
      saveSubject.complete();

      // THEN
      expect(muroUsuarioFormService.getMuroUsuario).toHaveBeenCalled();
      expect(muroUsuarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMuroUsuario>>();
      const muroUsuario = { id: 123 };
      jest.spyOn(muroUsuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ muroUsuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(muroUsuarioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
