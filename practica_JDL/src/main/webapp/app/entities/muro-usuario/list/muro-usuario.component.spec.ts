import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MuroUsuarioService } from '../service/muro-usuario.service';

import { MuroUsuarioComponent } from './muro-usuario.component';

describe('MuroUsuario Management Component', () => {
  let comp: MuroUsuarioComponent;
  let fixture: ComponentFixture<MuroUsuarioComponent>;
  let service: MuroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'muro-usuario', component: MuroUsuarioComponent }]),
        HttpClientTestingModule,
        MuroUsuarioComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MuroUsuarioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MuroUsuarioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MuroUsuarioService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.muroUsuarios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to muroUsuarioService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMuroUsuarioIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMuroUsuarioIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
