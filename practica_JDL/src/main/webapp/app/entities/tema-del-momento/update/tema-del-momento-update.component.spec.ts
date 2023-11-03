import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TemaDelMomentoService } from '../service/tema-del-momento.service';
import { ITemaDelMomento } from '../tema-del-momento.model';
import { TemaDelMomentoFormService } from './tema-del-momento-form.service';

import { TemaDelMomentoUpdateComponent } from './tema-del-momento-update.component';

describe('TemaDelMomento Management Update Component', () => {
  let comp: TemaDelMomentoUpdateComponent;
  let fixture: ComponentFixture<TemaDelMomentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let temaDelMomentoFormService: TemaDelMomentoFormService;
  let temaDelMomentoService: TemaDelMomentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TemaDelMomentoUpdateComponent],
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
      .overrideTemplate(TemaDelMomentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TemaDelMomentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    temaDelMomentoFormService = TestBed.inject(TemaDelMomentoFormService);
    temaDelMomentoService = TestBed.inject(TemaDelMomentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const temaDelMomento: ITemaDelMomento = { id: 456 };

      activatedRoute.data = of({ temaDelMomento });
      comp.ngOnInit();

      expect(comp.temaDelMomento).toEqual(temaDelMomento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITemaDelMomento>>();
      const temaDelMomento = { id: 123 };
      jest.spyOn(temaDelMomentoFormService, 'getTemaDelMomento').mockReturnValue(temaDelMomento);
      jest.spyOn(temaDelMomentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ temaDelMomento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: temaDelMomento }));
      saveSubject.complete();

      // THEN
      expect(temaDelMomentoFormService.getTemaDelMomento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(temaDelMomentoService.update).toHaveBeenCalledWith(expect.objectContaining(temaDelMomento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITemaDelMomento>>();
      const temaDelMomento = { id: 123 };
      jest.spyOn(temaDelMomentoFormService, 'getTemaDelMomento').mockReturnValue({ id: null });
      jest.spyOn(temaDelMomentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ temaDelMomento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: temaDelMomento }));
      saveSubject.complete();

      // THEN
      expect(temaDelMomentoFormService.getTemaDelMomento).toHaveBeenCalled();
      expect(temaDelMomentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITemaDelMomento>>();
      const temaDelMomento = { id: 123 };
      jest.spyOn(temaDelMomentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ temaDelMomento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(temaDelMomentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
