import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFacility, getFacilityIdentifier } from '../facility.model';

export type EntityResponseType = HttpResponse<IFacility>;
export type EntityArrayResponseType = HttpResponse<IFacility[]>;

@Injectable({ providedIn: 'root' })
export class FacilityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/facilities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(facility: IFacility): Observable<EntityResponseType> {
    return this.http.post<IFacility>(this.resourceUrl, facility, { observe: 'response' });
  }

  update(facility: IFacility): Observable<EntityResponseType> {
    return this.http.put<IFacility>(`${this.resourceUrl}/${getFacilityIdentifier(facility) as number}`, facility, { observe: 'response' });
  }

  partialUpdate(facility: IFacility): Observable<EntityResponseType> {
    return this.http.patch<IFacility>(`${this.resourceUrl}/${getFacilityIdentifier(facility) as number}`, facility, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFacility>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFacility[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFacilityToCollectionIfMissing(facilityCollection: IFacility[], ...facilitiesToCheck: (IFacility | null | undefined)[]): IFacility[] {
    const facilities: IFacility[] = facilitiesToCheck.filter(isPresent);
    if (facilities.length > 0) {
      const facilityCollectionIdentifiers = facilityCollection.map(facilityItem => getFacilityIdentifier(facilityItem)!);
      const facilitiesToAdd = facilities.filter(facilityItem => {
        const facilityIdentifier = getFacilityIdentifier(facilityItem);
        if (facilityIdentifier == null || facilityCollectionIdentifiers.includes(facilityIdentifier)) {
          return false;
        }
        facilityCollectionIdentifiers.push(facilityIdentifier);
        return true;
      });
      return [...facilitiesToAdd, ...facilityCollection];
    }
    return facilityCollection;
  }
}
