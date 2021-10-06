jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFacility, Facility } from '../facility.model';
import { FacilityService } from '../service/facility.service';

import { FacilityRoutingResolveService } from './facility-routing-resolve.service';

describe('Service Tests', () => {
  describe('Facility routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FacilityRoutingResolveService;
    let service: FacilityService;
    let resultFacility: IFacility | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FacilityRoutingResolveService);
      service = TestBed.inject(FacilityService);
      resultFacility = undefined;
    });

    describe('resolve', () => {
      it('should return IFacility returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFacility = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFacility).toEqual({ id: 123 });
      });

      it('should return new IFacility if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFacility = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFacility).toEqual(new Facility());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Facility })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFacility = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFacility).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
