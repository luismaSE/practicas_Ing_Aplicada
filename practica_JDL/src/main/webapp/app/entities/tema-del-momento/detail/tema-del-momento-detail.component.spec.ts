import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TemaDelMomentoDetailComponent } from './tema-del-momento-detail.component';

describe('TemaDelMomento Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaDelMomentoDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TemaDelMomentoDetailComponent,
              resolve: { temaDelMomento: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TemaDelMomentoDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load temaDelMomento on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TemaDelMomentoDetailComponent);

      // THEN
      expect(instance.temaDelMomento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
