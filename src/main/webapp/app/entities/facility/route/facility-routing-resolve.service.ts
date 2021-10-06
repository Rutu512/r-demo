import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFacility, Facility } from '../facility.model';
import { FacilityService } from '../service/facility.service';

@Injectable({ providedIn: 'root' })
export class FacilityRoutingResolveService implements Resolve<IFacility> {
  constructor(protected service: FacilityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFacility> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((facility: HttpResponse<Facility>) => {
          if (facility.body) {
            return of(facility.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Facility());
  }
}
