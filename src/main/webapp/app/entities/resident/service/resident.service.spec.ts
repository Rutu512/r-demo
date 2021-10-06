import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResident, Resident } from '../resident.model';

import { ResidentService } from './resident.service';

describe('Service Tests', () => {
  describe('Resident Service', () => {
    let service: ResidentService;
    let httpMock: HttpTestingController;
    let elemDefault: IResident;
    let expectedResult: IResident | IResident[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ResidentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        residentnamr: 'AAAAAAA',
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

      it('should create a Resident', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Resident()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Resident', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            residentnamr: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Resident', () => {
        const patchObject = Object.assign({}, new Resident());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Resident', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            residentnamr: 'BBBBBB',
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

      it('should delete a Resident', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addResidentToCollectionIfMissing', () => {
        it('should add a Resident to an empty array', () => {
          const resident: IResident = { id: 123 };
          expectedResult = service.addResidentToCollectionIfMissing([], resident);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(resident);
        });

        it('should not add a Resident to an array that contains it', () => {
          const resident: IResident = { id: 123 };
          const residentCollection: IResident[] = [
            {
              ...resident,
            },
            { id: 456 },
          ];
          expectedResult = service.addResidentToCollectionIfMissing(residentCollection, resident);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Resident to an array that doesn't contain it", () => {
          const resident: IResident = { id: 123 };
          const residentCollection: IResident[] = [{ id: 456 }];
          expectedResult = service.addResidentToCollectionIfMissing(residentCollection, resident);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(resident);
        });

        it('should add only unique Resident to an array', () => {
          const residentArray: IResident[] = [{ id: 123 }, { id: 456 }, { id: 13891 }];
          const residentCollection: IResident[] = [{ id: 123 }];
          expectedResult = service.addResidentToCollectionIfMissing(residentCollection, ...residentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const resident: IResident = { id: 123 };
          const resident2: IResident = { id: 456 };
          expectedResult = service.addResidentToCollectionIfMissing([], resident, resident2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(resident);
          expect(expectedResult).toContain(resident2);
        });

        it('should accept null and undefined values', () => {
          const resident: IResident = { id: 123 };
          expectedResult = service.addResidentToCollectionIfMissing([], null, resident, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(resident);
        });

        it('should return initial array if no Resident is added', () => {
          const residentCollection: IResident[] = [{ id: 123 }];
          expectedResult = service.addResidentToCollectionIfMissing(residentCollection, undefined, null);
          expect(expectedResult).toEqual(residentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
