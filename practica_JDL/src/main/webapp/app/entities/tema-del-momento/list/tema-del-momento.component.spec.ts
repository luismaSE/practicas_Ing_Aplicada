import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TemaDelMomentoService } from '../service/tema-del-momento.service';

import { TemaDelMomentoComponent } from './tema-del-momento.component';

describe('TemaDelMomento Management Component', () => {
  let comp: TemaDelMomentoComponent;
  let fixture: ComponentFixture<TemaDelMomentoComponent>;
  let service: TemaDelMomentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'tema-del-momento', component: TemaDelMomentoComponent }]),
        HttpClientTestingModule,
        TemaDelMomentoComponent,
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
      .overrideTemplate(TemaDelMomentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TemaDelMomentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TemaDelMomentoService);

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
    expect(comp.temaDelMomentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to temaDelMomentoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTemaDelMomentoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTemaDelMomentoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
