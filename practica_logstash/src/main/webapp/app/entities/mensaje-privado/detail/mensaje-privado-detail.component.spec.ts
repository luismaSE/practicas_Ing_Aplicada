import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MensajePrivadoDetailComponent } from './mensaje-privado-detail.component';

describe('MensajePrivado Management Detail Component', () => {
  let comp: MensajePrivadoDetailComponent;
  let fixture: ComponentFixture<MensajePrivadoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajePrivadoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mensajePrivado: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MensajePrivadoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MensajePrivadoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mensajePrivado on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mensajePrivado).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
