import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFacility, Facility } from '../facility.model';

import { FacilityService } from './facility.service';

describe('Service Tests', () => {
  describe('Facility Service', () => {
    let service: FacilityService;
    let httpMock: HttpTestingController;
    let elemDefault: IFacility;
    let expectedResult: IFacility | IFacility[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FacilityService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        facilityname: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Facility', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Facility()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Facility', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            facilityname: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Facility', () => {
        const patchObject = Object.assign(
          {
            facilityname: 'BBBBBB',
          },
          new Facility()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Facility', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            facilityname: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Facility', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFacilityToCollectionIfMissing', () => {
        it('should add a Facility to an empty array', () => {
          const facility: IFacility = { id: 123 };
          expectedResult = service.addFacilityToCollectionIfMissing([], facility);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(facility);
        });

        it('should not add a Facility to an array that contains it', () => {
          const facility: IFacility = { id: 123 };
          const facilityCollection: IFacility[] = [
            {
              ...facility,
            },
            { id: 456 },
          ];
          expectedResult = service.addFacilityToCollectionIfMissing(facilityCollection, facility);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Facility to an array that doesn't contain it", () => {
          const facility: IFacility = { id: 123 };
          const facilityCollection: IFacility[] = [{ id: 456 }];
          expectedResult = service.addFacilityToCollectionIfMissing(facilityCollection, facility);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(facility);
        });

        it('should add only unique Facility to an array', () => {
          const facilityArray: IFacility[] = [{ id: 123 }, { id: 456 }, { id: 86874 }];
          const facilityCollection: IFacility[] = [{ id: 123 }];
          expectedResult = service.addFacilityToCollectionIfMissing(facilityCollection, ...facilityArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const facility: IFacility = { id: 123 };
          const facility2: IFacility = { id: 456 };
          expectedResult = service.addFacilityToCollectionIfMissing([], facility, facility2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(facility);
          expect(expectedResult).toContain(facility2);
        });

        it('should accept null and undefined values', () => {
          const facility: IFacility = { id: 123 };
          expectedResult = service.addFacilityToCollectionIfMissing([], null, facility, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(facility);
        });

        it('should return initial array if no Facility is added', () => {
          const facilityCollection: IFacility[] = [{ id: 123 }];
          expectedResult = service.addFacilityToCollectionIfMissing(facilityCollection, undefined, null);
          expect(expectedResult).toEqual(facilityCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
