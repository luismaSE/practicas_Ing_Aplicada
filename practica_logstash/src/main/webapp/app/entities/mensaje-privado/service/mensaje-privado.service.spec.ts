import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMensajePrivado } from '../mensaje-privado.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mensaje-privado.test-samples';

import { MensajePrivadoService, RestMensajePrivado } from './mensaje-privado.service';

const requireRestSample: RestMensajePrivado = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.format(DATE_FORMAT),
};

describe('MensajePrivado Service', () => {
  let service: MensajePrivadoService;
  let httpMock: HttpTestingController;
  let expectedResult: IMensajePrivado | IMensajePrivado[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MensajePrivadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MensajePrivado', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mensajePrivado = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mensajePrivado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MensajePrivado', () => {
      const mensajePrivado = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mensajePrivado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MensajePrivado', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MensajePrivado', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MensajePrivado', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMensajePrivadoToCollectionIfMissing', () => {
      it('should add a MensajePrivado to an empty array', () => {
        const mensajePrivado: IMensajePrivado = sampleWithRequiredData;
        expectedResult = service.addMensajePrivadoToCollectionIfMissing([], mensajePrivado);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mensajePrivado);
      });

      it('should not add a MensajePrivado to an array that contains it', () => {
        const mensajePrivado: IMensajePrivado = sampleWithRequiredData;
        const mensajePrivadoCollection: IMensajePrivado[] = [
          {
            ...mensajePrivado,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMensajePrivadoToCollectionIfMissing(mensajePrivadoCollection, mensajePrivado);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MensajePrivado to an array that doesn't contain it", () => {
        const mensajePrivado: IMensajePrivado = sampleWithRequiredData;
        const mensajePrivadoCollection: IMensajePrivado[] = [sampleWithPartialData];
        expectedResult = service.addMensajePrivadoToCollectionIfMissing(mensajePrivadoCollection, mensajePrivado);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mensajePrivado);
      });

      it('should add only unique MensajePrivado to an array', () => {
        const mensajePrivadoArray: IMensajePrivado[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mensajePrivadoCollection: IMensajePrivado[] = [sampleWithRequiredData];
        expectedResult = service.addMensajePrivadoToCollectionIfMissing(mensajePrivadoCollection, ...mensajePrivadoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mensajePrivado: IMensajePrivado = sampleWithRequiredData;
        const mensajePrivado2: IMensajePrivado = sampleWithPartialData;
        expectedResult = service.addMensajePrivadoToCollectionIfMissing([], mensajePrivado, mensajePrivado2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mensajePrivado);
        expect(expectedResult).toContain(mensajePrivado2);
      });

      it('should accept null and undefined values', () => {
        const mensajePrivado: IMensajePrivado = sampleWithRequiredData;
        expectedResult = service.addMensajePrivadoToCollectionIfMissing([], null, mensajePrivado, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mensajePrivado);
      });

      it('should return initial array if no MensajePrivado is added', () => {
        const mensajePrivadoCollection: IMensajePrivado[] = [sampleWithRequiredData];
        expectedResult = service.addMensajePrivadoToCollectionIfMissing(mensajePrivadoCollection, undefined, null);
        expect(expectedResult).toEqual(mensajePrivadoCollection);
      });
    });

    describe('compareMensajePrivado', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMensajePrivado(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMensajePrivado(entity1, entity2);
        const compareResult2 = service.compareMensajePrivado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMensajePrivado(entity1, entity2);
        const compareResult2 = service.compareMensajePrivado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMensajePrivado(entity1, entity2);
        const compareResult2 = service.compareMensajePrivado(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
