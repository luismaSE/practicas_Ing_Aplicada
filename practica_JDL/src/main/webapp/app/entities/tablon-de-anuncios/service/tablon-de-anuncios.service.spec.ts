import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITablonDeAnuncios } from '../tablon-de-anuncios.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tablon-de-anuncios.test-samples';

import { TablonDeAnunciosService } from './tablon-de-anuncios.service';

const requireRestSample: ITablonDeAnuncios = {
  ...sampleWithRequiredData,
};

describe('TablonDeAnuncios Service', () => {
  let service: TablonDeAnunciosService;
  let httpMock: HttpTestingController;
  let expectedResult: ITablonDeAnuncios | ITablonDeAnuncios[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TablonDeAnunciosService);
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

    it('should create a TablonDeAnuncios', () => {
      const tablonDeAnuncios = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tablonDeAnuncios).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TablonDeAnuncios', () => {
      const tablonDeAnuncios = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tablonDeAnuncios).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TablonDeAnuncios', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TablonDeAnuncios', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TablonDeAnuncios', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTablonDeAnunciosToCollectionIfMissing', () => {
      it('should add a TablonDeAnuncios to an empty array', () => {
        const tablonDeAnuncios: ITablonDeAnuncios = sampleWithRequiredData;
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing([], tablonDeAnuncios);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tablonDeAnuncios);
      });

      it('should not add a TablonDeAnuncios to an array that contains it', () => {
        const tablonDeAnuncios: ITablonDeAnuncios = sampleWithRequiredData;
        const tablonDeAnunciosCollection: ITablonDeAnuncios[] = [
          {
            ...tablonDeAnuncios,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing(tablonDeAnunciosCollection, tablonDeAnuncios);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TablonDeAnuncios to an array that doesn't contain it", () => {
        const tablonDeAnuncios: ITablonDeAnuncios = sampleWithRequiredData;
        const tablonDeAnunciosCollection: ITablonDeAnuncios[] = [sampleWithPartialData];
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing(tablonDeAnunciosCollection, tablonDeAnuncios);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tablonDeAnuncios);
      });

      it('should add only unique TablonDeAnuncios to an array', () => {
        const tablonDeAnunciosArray: ITablonDeAnuncios[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tablonDeAnunciosCollection: ITablonDeAnuncios[] = [sampleWithRequiredData];
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing(tablonDeAnunciosCollection, ...tablonDeAnunciosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tablonDeAnuncios: ITablonDeAnuncios = sampleWithRequiredData;
        const tablonDeAnuncios2: ITablonDeAnuncios = sampleWithPartialData;
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing([], tablonDeAnuncios, tablonDeAnuncios2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tablonDeAnuncios);
        expect(expectedResult).toContain(tablonDeAnuncios2);
      });

      it('should accept null and undefined values', () => {
        const tablonDeAnuncios: ITablonDeAnuncios = sampleWithRequiredData;
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing([], null, tablonDeAnuncios, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tablonDeAnuncios);
      });

      it('should return initial array if no TablonDeAnuncios is added', () => {
        const tablonDeAnunciosCollection: ITablonDeAnuncios[] = [sampleWithRequiredData];
        expectedResult = service.addTablonDeAnunciosToCollectionIfMissing(tablonDeAnunciosCollection, undefined, null);
        expect(expectedResult).toEqual(tablonDeAnunciosCollection);
      });
    });

    describe('compareTablonDeAnuncios', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTablonDeAnuncios(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTablonDeAnuncios(entity1, entity2);
        const compareResult2 = service.compareTablonDeAnuncios(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTablonDeAnuncios(entity1, entity2);
        const compareResult2 = service.compareTablonDeAnuncios(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTablonDeAnuncios(entity1, entity2);
        const compareResult2 = service.compareTablonDeAnuncios(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
