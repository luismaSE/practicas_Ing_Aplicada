import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MuroUsuarioDetailComponent } from './muro-usuario-detail.component';

describe('MuroUsuario Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuroUsuarioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MuroUsuarioDetailComponent,
              resolve: { muroUsuario: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MuroUsuarioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load muroUsuario on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MuroUsuarioDetailComponent);

      // THEN
      expect(instance.muroUsuario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
