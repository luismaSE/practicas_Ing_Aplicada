import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MensajeService } from '../service/mensaje.service';

import { MensajeComponent } from './mensaje.component';

describe('Mensaje Management Component', () => {
  let comp: MensajeComponent;
  let fixture: ComponentFixture<MensajeComponent>;
  let service: MensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mensaje', component: MensajeComponent }]), HttpClientTestingModule],
      declarations: [MensajeComponent],
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
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MensajeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MensajeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MensajeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.mensajes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mensajeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMensajeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMensajeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
