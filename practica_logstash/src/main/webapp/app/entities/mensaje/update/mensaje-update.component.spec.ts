import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MensajeFormService } from './mensaje-form.service';
import { MensajeService } from '../service/mensaje.service';
import { IMensaje } from '../mensaje.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { MensajeUpdateComponent } from './mensaje-update.component';

describe('Mensaje Management Update Component', () => {
  let comp: MensajeUpdateComponent;
  let fixture: ComponentFixture<MensajeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mensajeFormService: MensajeFormService;
  let mensajeService: MensajeService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MensajeUpdateComponent],
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
      .overrideTemplate(MensajeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MensajeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mensajeFormService = TestBed.inject(MensajeFormService);
    mensajeService = TestBed.inject(MensajeService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call autor query and add missing value', () => {
      const mensaje: IMensaje = { id: 456 };
      const autor: IUsuario = { id: 48578 };
      mensaje.autor = autor;

      const autorCollection: IUsuario[] = [{ id: 48274 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: autorCollection })));
      const expectedCollection: IUsuario[] = [autor, ...autorCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mensaje });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(autorCollection, autor);
      expect(comp.autorsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mensaje: IMensaje = { id: 456 };
      const autor: IUsuario = { id: 2202 };
      mensaje.autor = autor;

      activatedRoute.data = of({ mensaje });
      comp.ngOnInit();

      expect(comp.autorsCollection).toContain(autor);
      expect(comp.mensaje).toEqual(mensaje);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensaje>>();
      const mensaje = { id: 123 };
      jest.spyOn(mensajeFormService, 'getMensaje').mockReturnValue(mensaje);
      jest.spyOn(mensajeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensaje });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mensaje }));
      saveSubject.complete();

      // THEN
      expect(mensajeFormService.getMensaje).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mensajeService.update).toHaveBeenCalledWith(expect.objectContaining(mensaje));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensaje>>();
      const mensaje = { id: 123 };
      jest.spyOn(mensajeFormService, 'getMensaje').mockReturnValue({ id: null });
      jest.spyOn(mensajeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensaje: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mensaje }));
      saveSubject.complete();

      // THEN
      expect(mensajeFormService.getMensaje).toHaveBeenCalled();
      expect(mensajeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensaje>>();
      const mensaje = { id: 123 };
      jest.spyOn(mensajeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensaje });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mensajeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
