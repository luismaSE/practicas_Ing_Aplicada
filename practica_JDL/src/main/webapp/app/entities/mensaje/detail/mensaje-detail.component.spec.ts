import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MensajeDetailComponent } from './mensaje-detail.component';

describe('Mensaje Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MensajeDetailComponent,
              resolve: { mensaje: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MensajeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load mensaje on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MensajeDetailComponent);

      // THEN
      expect(instance.mensaje).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
