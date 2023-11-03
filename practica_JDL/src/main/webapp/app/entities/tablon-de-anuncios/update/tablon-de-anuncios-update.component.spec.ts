import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TablonDeAnunciosService } from '../service/tablon-de-anuncios.service';
import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';
import { TablonDeAnunciosFormService } from './tablon-de-anuncios-form.service';

import { TablonDeAnunciosUpdateComponent } from './tablon-de-anuncios-update.component';

describe('TablonDeAnuncios Management Update Component', () => {
  let comp: TablonDeAnunciosUpdateComponent;
  let fixture: ComponentFixture<TablonDeAnunciosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tablonDeAnunciosFormService: TablonDeAnunciosFormService;
  let tablonDeAnunciosService: TablonDeAnunciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TablonDeAnunciosUpdateComponent],
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
      .overrideTemplate(TablonDeAnunciosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TablonDeAnunciosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tablonDeAnunciosFormService = TestBed.inject(TablonDeAnunciosFormService);
    tablonDeAnunciosService = TestBed.inject(TablonDeAnunciosService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tablonDeAnuncios: ITablonDeAnuncios = { id: 456 };

      activatedRoute.data = of({ tablonDeAnuncios });
      comp.ngOnInit();

      expect(comp.tablonDeAnuncios).toEqual(tablonDeAnuncios);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITablonDeAnuncios>>();
      const tablonDeAnuncios = { id: 123 };
      jest.spyOn(tablonDeAnunciosFormService, 'getTablonDeAnuncios').mockReturnValue(tablonDeAnuncios);
      jest.spyOn(tablonDeAnunciosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tablonDeAnuncios });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tablonDeAnuncios }));
      saveSubject.complete();

      // THEN
      expect(tablonDeAnunciosFormService.getTablonDeAnuncios).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tablonDeAnunciosService.update).toHaveBeenCalledWith(expect.objectContaining(tablonDeAnuncios));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITablonDeAnuncios>>();
      const tablonDeAnuncios = { id: 123 };
      jest.spyOn(tablonDeAnunciosFormService, 'getTablonDeAnuncios').mockReturnValue({ id: null });
      jest.spyOn(tablonDeAnunciosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tablonDeAnuncios: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tablonDeAnuncios }));
      saveSubject.complete();

      // THEN
      expect(tablonDeAnunciosFormService.getTablonDeAnuncios).toHaveBeenCalled();
      expect(tablonDeAnunciosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITablonDeAnuncios>>();
      const tablonDeAnuncios = { id: 123 };
      jest.spyOn(tablonDeAnunciosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tablonDeAnuncios });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tablonDeAnunciosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
