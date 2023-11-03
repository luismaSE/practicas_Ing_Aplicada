import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UsuarioFormService } from './usuario-form.service';
import { UsuarioService } from '../service/usuario.service';
import { IUsuario } from '../usuario.model';
import { IMensaje } from 'app/entities/mensaje/mensaje.model';
import { MensajeService } from 'app/entities/mensaje/service/mensaje.service';

import { UsuarioUpdateComponent } from './usuario-update.component';

describe('Usuario Management Update Component', () => {
  let comp: UsuarioUpdateComponent;
  let fixture: ComponentFixture<UsuarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usuarioFormService: UsuarioFormService;
  let usuarioService: UsuarioService;
  let mensajeService: MensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UsuarioUpdateComponent],
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
      .overrideTemplate(UsuarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usuarioFormService = TestBed.inject(UsuarioFormService);
    usuarioService = TestBed.inject(UsuarioService);
    mensajeService = TestBed.inject(MensajeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const siguiendos: IUsuario[] = [{ id: 67948 }];
      usuario.siguiendos = siguiendos;

      const usuarioCollection: IUsuario[] = [{ id: 28635 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [...siguiendos];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Mensaje query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const mensajeMencionado: IMensaje = { id: 15790 };
      usuario.mensajeMencionado = mensajeMencionado;

      const mensajeCollection: IMensaje[] = [{ id: 44228 }];
      jest.spyOn(mensajeService, 'query').mockReturnValue(of(new HttpResponse({ body: mensajeCollection })));
      const additionalMensajes = [mensajeMencionado];
      const expectedCollection: IMensaje[] = [...additionalMensajes, ...mensajeCollection];
      jest.spyOn(mensajeService, 'addMensajeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(mensajeService.query).toHaveBeenCalled();
      expect(mensajeService.addMensajeToCollectionIfMissing).toHaveBeenCalledWith(
        mensajeCollection,
        ...additionalMensajes.map(expect.objectContaining)
      );
      expect(comp.mensajesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const usuario: IUsuario = { id: 456 };
      const siguiendo: IUsuario = { id: 9832 };
      usuario.siguiendos = [siguiendo];
      const mensajeMencionado: IMensaje = { id: 54123 };
      usuario.mensajeMencionado = mensajeMencionado;

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(siguiendo);
      expect(comp.mensajesSharedCollection).toContain(mensajeMencionado);
      expect(comp.usuario).toEqual(usuario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioFormService, 'getUsuario').mockReturnValue(usuario);
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(usuarioFormService.getUsuario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(usuarioService.update).toHaveBeenCalledWith(expect.objectContaining(usuario));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioFormService, 'getUsuario').mockReturnValue({ id: null });
      jest.spyOn(usuarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: usuario }));
      saveSubject.complete();

      // THEN
      expect(usuarioFormService.getUsuario).toHaveBeenCalled();
      expect(usuarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsuario>>();
      const usuario = { id: 123 };
      jest.spyOn(usuarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usuarioService.update).toHaveBeenCalled();
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

    describe('compareMensaje', () => {
      it('Should forward to mensajeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mensajeService, 'compareMensaje');
        comp.compareMensaje(entity, entity2);
        expect(mensajeService.compareMensaje).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
