import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MensajePrivadoService } from '../service/mensaje-privado.service';

import { MensajePrivadoComponent } from './mensaje-privado.component';

describe('MensajePrivado Management Component', () => {
  let comp: MensajePrivadoComponent;
  let fixture: ComponentFixture<MensajePrivadoComponent>;
  let service: MensajePrivadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mensaje-privado', component: MensajePrivadoComponent }]), HttpClientTestingModule],
      declarations: [MensajePrivadoComponent],
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
      .overrideTemplate(MensajePrivadoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MensajePrivadoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MensajePrivadoService);

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
    expect(comp.mensajePrivados?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mensajePrivadoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMensajePrivadoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMensajePrivadoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
