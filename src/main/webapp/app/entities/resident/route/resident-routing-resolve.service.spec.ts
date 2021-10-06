jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IResident, Resident } from '../resident.model';
import { ResidentService } from '../service/resident.service';

import { ResidentRoutingResolveService } from './resident-routing-resolve.service';

describe('Service Tests', () => {
  describe('Resident routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ResidentRoutingResolveService;
    let service: ResidentService;
    let resultResident: IResident | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ResidentRoutingResolveService);
      service = TestBed.inject(ResidentService);
      resultResident = undefined;
    });

    describe('resolve', () => {
      it('should return IResident returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultResident = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultResident).toEqual({ id: 123 });
      });

      it('should return new IResident if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultResident = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultResident).toEqual(new Resident());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Resident })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultResident = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultResident).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
