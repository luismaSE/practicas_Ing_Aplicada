import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MensajePrivadoFormService } from './mensaje-privado-form.service';
import { MensajePrivadoService } from '../service/mensaje-privado.service';
import { IMensajePrivado } from '../mensaje-privado.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';

import { MensajePrivadoUpdateComponent } from './mensaje-privado-update.component';

describe('MensajePrivado Management Update Component', () => {
  let comp: MensajePrivadoUpdateComponent;
  let fixture: ComponentFixture<MensajePrivadoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mensajePrivadoFormService: MensajePrivadoFormService;
  let mensajePrivadoService: MensajePrivadoService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MensajePrivadoUpdateComponent],
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
      .overrideTemplate(MensajePrivadoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MensajePrivadoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mensajePrivadoFormService = TestBed.inject(MensajePrivadoFormService);
    mensajePrivadoService = TestBed.inject(MensajePrivadoService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call autor query and add missing value', () => {
      const mensajePrivado: IMensajePrivado = { id: 456 };
      const autor: IUsuario = { id: 35126 };
      mensajePrivado.autor = autor;

      const autorCollection: IUsuario[] = [{ id: 87276 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: autorCollection })));
      const expectedCollection: IUsuario[] = [autor, ...autorCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mensajePrivado });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(autorCollection, autor);
      expect(comp.autorsCollection).toEqual(expectedCollection);
    });

    it('Should call destino query and add missing value', () => {
      const mensajePrivado: IMensajePrivado = { id: 456 };
      const destino: IUsuario = { id: 30934 };
      mensajePrivado.destino = destino;

      const destinoCollection: IUsuario[] = [{ id: 41191 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: destinoCollection })));
      const expectedCollection: IUsuario[] = [destino, ...destinoCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mensajePrivado });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(destinoCollection, destino);
      expect(comp.destinosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mensajePrivado: IMensajePrivado = { id: 456 };
      const autor: IUsuario = { id: 55292 };
      mensajePrivado.autor = autor;
      const destino: IUsuario = { id: 64831 };
      mensajePrivado.destino = destino;

      activatedRoute.data = of({ mensajePrivado });
      comp.ngOnInit();

      expect(comp.autorsCollection).toContain(autor);
      expect(comp.destinosCollection).toContain(destino);
      expect(comp.mensajePrivado).toEqual(mensajePrivado);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensajePrivado>>();
      const mensajePrivado = { id: 123 };
      jest.spyOn(mensajePrivadoFormService, 'getMensajePrivado').mockReturnValue(mensajePrivado);
      jest.spyOn(mensajePrivadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensajePrivado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mensajePrivado }));
      saveSubject.complete();

      // THEN
      expect(mensajePrivadoFormService.getMensajePrivado).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mensajePrivadoService.update).toHaveBeenCalledWith(expect.objectContaining(mensajePrivado));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensajePrivado>>();
      const mensajePrivado = { id: 123 };
      jest.spyOn(mensajePrivadoFormService, 'getMensajePrivado').mockReturnValue({ id: null });
      jest.spyOn(mensajePrivadoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensajePrivado: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mensajePrivado }));
      saveSubject.complete();

      // THEN
      expect(mensajePrivadoFormService.getMensajePrivado).toHaveBeenCalled();
      expect(mensajePrivadoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMensajePrivado>>();
      const mensajePrivado = { id: 123 };
      jest.spyOn(mensajePrivadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mensajePrivado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mensajePrivadoService.update).toHaveBeenCalled();
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
