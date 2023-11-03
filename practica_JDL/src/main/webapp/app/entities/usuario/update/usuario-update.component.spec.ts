import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IMuroUsuario } from 'app/entities/muro-usuario/muro-usuario.model';
import { MuroUsuarioService } from 'app/entities/muro-usuario/service/muro-usuario.service';
import { UsuarioService } from '../service/usuario.service';
import { IUsuario } from '../usuario.model';
import { UsuarioFormService } from './usuario-form.service';

import { UsuarioUpdateComponent } from './usuario-update.component';

describe('Usuario Management Update Component', () => {
  let comp: UsuarioUpdateComponent;
  let fixture: ComponentFixture<UsuarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usuarioFormService: UsuarioFormService;
  let usuarioService: UsuarioService;
  let muroUsuarioService: MuroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UsuarioUpdateComponent],
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
    muroUsuarioService = TestBed.inject(MuroUsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call muro query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const muro: IMuroUsuario = { id: 30308 };
      usuario.muro = muro;

      const muroCollection: IMuroUsuario[] = [{ id: 12729 }];
      jest.spyOn(muroUsuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: muroCollection })));
      const expectedCollection: IMuroUsuario[] = [muro, ...muroCollection];
      jest.spyOn(muroUsuarioService, 'addMuroUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(muroUsuarioService.query).toHaveBeenCalled();
      expect(muroUsuarioService.addMuroUsuarioToCollectionIfMissing).toHaveBeenCalledWith(muroCollection, muro);
      expect(comp.murosCollection).toEqual(expectedCollection);
    });

    it('Should call Usuario query and add missing value', () => {
      const usuario: IUsuario = { id: 456 };
      const seguidos: IUsuario[] = [{ id: 15332 }];
      usuario.seguidos = seguidos;

      const usuarioCollection: IUsuario[] = [{ id: 10268 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [...seguidos];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining),
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const usuario: IUsuario = { id: 456 };
      const muro: IMuroUsuario = { id: 20765 };
      usuario.muro = muro;
      const seguidos: IUsuario = { id: 21244 };
      usuario.seguidos = [seguidos];

      activatedRoute.data = of({ usuario });
      comp.ngOnInit();

      expect(comp.murosCollection).toContain(muro);
      expect(comp.usuariosSharedCollection).toContain(seguidos);
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
    describe('compareMuroUsuario', () => {
      it('Should forward to muroUsuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(muroUsuarioService, 'compareMuroUsuario');
        comp.compareMuroUsuario(entity, entity2);
        expect(muroUsuarioService.compareMuroUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
