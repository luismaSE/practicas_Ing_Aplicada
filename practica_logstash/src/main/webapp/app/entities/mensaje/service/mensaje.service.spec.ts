import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMensaje } from '../mensaje.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mensaje.test-samples';

import { MensajeService, RestMensaje } from './mensaje.service';

const requireRestSample: RestMensaje = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.format(DATE_FORMAT),
};

describe('Mensaje Service', () => {
  let service: MensajeService;
  let httpMock: HttpTestingController;
  let expectedResult: IMensaje | IMensaje[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MensajeService);
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

    it('should create a Mensaje', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mensaje = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mensaje).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mensaje', () => {
      const mensaje = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mensaje).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mensaje', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mensaje', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mensaje', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMensajeToCollectionIfMissing', () => {
      it('should add a Mensaje to an empty array', () => {
        const mensaje: IMensaje = sampleWithRequiredData;
        expectedResult = service.addMensajeToCollectionIfMissing([], mensaje);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mensaje);
      });

      it('should not add a Mensaje to an array that contains it', () => {
        const mensaje: IMensaje = sampleWithRequiredData;
        const mensajeCollection: IMensaje[] = [
          {
            ...mensaje,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMensajeToCollectionIfMissing(mensajeCollection, mensaje);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mensaje to an array that doesn't contain it", () => {
        const mensaje: IMensaje = sampleWithRequiredData;
        const mensajeCollection: IMensaje[] = [sampleWithPartialData];
        expectedResult = service.addMensajeToCollectionIfMissing(mensajeCollection, mensaje);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mensaje);
      });

      it('should add only unique Mensaje to an array', () => {
        const mensajeArray: IMensaje[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mensajeCollection: IMensaje[] = [sampleWithRequiredData];
        expectedResult = service.addMensajeToCollectionIfMissing(mensajeCollection, ...mensajeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mensaje: IMensaje = sampleWithRequiredData;
        const mensaje2: IMensaje = sampleWithPartialData;
        expectedResult = service.addMensajeToCollectionIfMissing([], mensaje, mensaje2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mensaje);
        expect(expectedResult).toContain(mensaje2);
      });

      it('should accept null and undefined values', () => {
        const mensaje: IMensaje = sampleWithRequiredData;
        expectedResult = service.addMensajeToCollectionIfMissing([], null, mensaje, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mensaje);
      });

      it('should return initial array if no Mensaje is added', () => {
        const mensajeCollection: IMensaje[] = [sampleWithRequiredData];
        expectedResult = service.addMensajeToCollectionIfMissing(mensajeCollection, undefined, null);
        expect(expectedResult).toEqual(mensajeCollection);
      });
    });

    describe('compareMensaje', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMensaje(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMensaje(entity1, entity2);
        const compareResult2 = service.compareMensaje(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMensaje(entity1, entity2);
        const compareResult2 = service.compareMensaje(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMensaje(entity1, entity2);
        const compareResult2 = service.compareMensaje(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
