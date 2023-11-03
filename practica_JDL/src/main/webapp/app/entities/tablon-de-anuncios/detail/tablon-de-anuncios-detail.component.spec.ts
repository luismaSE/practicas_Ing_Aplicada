import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TablonDeAnunciosDetailComponent } from './tablon-de-anuncios-detail.component';

describe('TablonDeAnuncios Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablonDeAnunciosDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TablonDeAnunciosDetailComponent,
              resolve: { tablonDeAnuncios: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TablonDeAnunciosDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tablonDeAnuncios on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TablonDeAnunciosDetailComponent);

      // THEN
      expect(instance.tablonDeAnuncios).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
