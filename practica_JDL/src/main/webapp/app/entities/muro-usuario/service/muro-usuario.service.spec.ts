import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMuroUsuario } from '../muro-usuario.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../muro-usuario.test-samples';

import { MuroUsuarioService } from './muro-usuario.service';

const requireRestSample: IMuroUsuario = {
  ...sampleWithRequiredData,
};

describe('MuroUsuario Service', () => {
  let service: MuroUsuarioService;
  let httpMock: HttpTestingController;
  let expectedResult: IMuroUsuario | IMuroUsuario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MuroUsuarioService);
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

    it('should create a MuroUsuario', () => {
      const muroUsuario = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(muroUsuario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MuroUsuario', () => {
      const muroUsuario = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(muroUsuario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MuroUsuario', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MuroUsuario', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MuroUsuario', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMuroUsuarioToCollectionIfMissing', () => {
      it('should add a MuroUsuario to an empty array', () => {
        const muroUsuario: IMuroUsuario = sampleWithRequiredData;
        expectedResult = service.addMuroUsuarioToCollectionIfMissing([], muroUsuario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(muroUsuario);
      });

      it('should not add a MuroUsuario to an array that contains it', () => {
        const muroUsuario: IMuroUsuario = sampleWithRequiredData;
        const muroUsuarioCollection: IMuroUsuario[] = [
          {
            ...muroUsuario,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMuroUsuarioToCollectionIfMissing(muroUsuarioCollection, muroUsuario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MuroUsuario to an array that doesn't contain it", () => {
        const muroUsuario: IMuroUsuario = sampleWithRequiredData;
        const muroUsuarioCollection: IMuroUsuario[] = [sampleWithPartialData];
        expectedResult = service.addMuroUsuarioToCollectionIfMissing(muroUsuarioCollection, muroUsuario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(muroUsuario);
      });

      it('should add only unique MuroUsuario to an array', () => {
        const muroUsuarioArray: IMuroUsuario[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const muroUsuarioCollection: IMuroUsuario[] = [sampleWithRequiredData];
        expectedResult = service.addMuroUsuarioToCollectionIfMissing(muroUsuarioCollection, ...muroUsuarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const muroUsuario: IMuroUsuario = sampleWithRequiredData;
        const muroUsuario2: IMuroUsuario = sampleWithPartialData;
        expectedResult = service.addMuroUsuarioToCollectionIfMissing([], muroUsuario, muroUsuario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(muroUsuario);
        expect(expectedResult).toContain(muroUsuario2);
      });

      it('should accept null and undefined values', () => {
        const muroUsuario: IMuroUsuario = sampleWithRequiredData;
        expectedResult = service.addMuroUsuarioToCollectionIfMissing([], null, muroUsuario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(muroUsuario);
      });

      it('should return initial array if no MuroUsuario is added', () => {
        const muroUsuarioCollection: IMuroUsuario[] = [sampleWithRequiredData];
        expectedResult = service.addMuroUsuarioToCollectionIfMissing(muroUsuarioCollection, undefined, null);
        expect(expectedResult).toEqual(muroUsuarioCollection);
      });
    });

    describe('compareMuroUsuario', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMuroUsuario(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMuroUsuario(entity1, entity2);
        const compareResult2 = service.compareMuroUsuario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMuroUsuario(entity1, entity2);
        const compareResult2 = service.compareMuroUsuario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMuroUsuario(entity1, entity2);
        const compareResult2 = service.compareMuroUsuario(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
