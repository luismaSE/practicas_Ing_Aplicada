import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITemaDelMomento } from '../tema-del-momento.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tema-del-momento.test-samples';

import { TemaDelMomentoService } from './tema-del-momento.service';

const requireRestSample: ITemaDelMomento = {
  ...sampleWithRequiredData,
};

describe('TemaDelMomento Service', () => {
  let service: TemaDelMomentoService;
  let httpMock: HttpTestingController;
  let expectedResult: ITemaDelMomento | ITemaDelMomento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TemaDelMomentoService);
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

    it('should create a TemaDelMomento', () => {
      const temaDelMomento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(temaDelMomento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TemaDelMomento', () => {
      const temaDelMomento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(temaDelMomento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TemaDelMomento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TemaDelMomento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TemaDelMomento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTemaDelMomentoToCollectionIfMissing', () => {
      it('should add a TemaDelMomento to an empty array', () => {
        const temaDelMomento: ITemaDelMomento = sampleWithRequiredData;
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing([], temaDelMomento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(temaDelMomento);
      });

      it('should not add a TemaDelMomento to an array that contains it', () => {
        const temaDelMomento: ITemaDelMomento = sampleWithRequiredData;
        const temaDelMomentoCollection: ITemaDelMomento[] = [
          {
            ...temaDelMomento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing(temaDelMomentoCollection, temaDelMomento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TemaDelMomento to an array that doesn't contain it", () => {
        const temaDelMomento: ITemaDelMomento = sampleWithRequiredData;
        const temaDelMomentoCollection: ITemaDelMomento[] = [sampleWithPartialData];
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing(temaDelMomentoCollection, temaDelMomento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(temaDelMomento);
      });

      it('should add only unique TemaDelMomento to an array', () => {
        const temaDelMomentoArray: ITemaDelMomento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const temaDelMomentoCollection: ITemaDelMomento[] = [sampleWithRequiredData];
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing(temaDelMomentoCollection, ...temaDelMomentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const temaDelMomento: ITemaDelMomento = sampleWithRequiredData;
        const temaDelMomento2: ITemaDelMomento = sampleWithPartialData;
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing([], temaDelMomento, temaDelMomento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(temaDelMomento);
        expect(expectedResult).toContain(temaDelMomento2);
      });

      it('should accept null and undefined values', () => {
        const temaDelMomento: ITemaDelMomento = sampleWithRequiredData;
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing([], null, temaDelMomento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(temaDelMomento);
      });

      it('should return initial array if no TemaDelMomento is added', () => {
        const temaDelMomentoCollection: ITemaDelMomento[] = [sampleWithRequiredData];
        expectedResult = service.addTemaDelMomentoToCollectionIfMissing(temaDelMomentoCollection, undefined, null);
        expect(expectedResult).toEqual(temaDelMomentoCollection);
      });
    });

    describe('compareTemaDelMomento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTemaDelMomento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTemaDelMomento(entity1, entity2);
        const compareResult2 = service.compareTemaDelMomento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTemaDelMomento(entity1, entity2);
        const compareResult2 = service.compareTemaDelMomento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTemaDelMomento(entity1, entity2);
        const compareResult2 = service.compareTemaDelMomento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
