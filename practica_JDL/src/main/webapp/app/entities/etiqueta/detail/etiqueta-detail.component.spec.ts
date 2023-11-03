import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtiquetaDetailComponent } from './etiqueta-detail.component';

describe('Etiqueta Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiquetaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EtiquetaDetailComponent,
              resolve: { etiqueta: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EtiquetaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load etiqueta on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtiquetaDetailComponent);

      // THEN
      expect(instance.etiqueta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
