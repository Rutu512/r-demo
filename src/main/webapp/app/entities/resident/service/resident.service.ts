import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResident, getResidentIdentifier } from '../resident.model';

export type EntityResponseType = HttpResponse<IResident>;
export type EntityArrayResponseType = HttpResponse<IResident[]>;

@Injectable({ providedIn: 'root' })
export class ResidentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/residents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(resident: IResident): Observable<EntityResponseType> {
    return this.http.post<IResident>(this.resourceUrl, resident, { observe: 'response' });
  }

  update(resident: IResident): Observable<EntityResponseType> {
    return this.http.put<IResident>(`${this.resourceUrl}/${getResidentIdentifier(resident) as number}`, resident, { observe: 'response' });
  }

  partialUpdate(resident: IResident): Observable<EntityResponseType> {
    return this.http.patch<IResident>(`${this.resourceUrl}/${getResidentIdentifier(resident) as number}`, resident, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResident>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResident[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addResidentToCollectionIfMissing(residentCollection: IResident[], ...residentsToCheck: (IResident | null | undefined)[]): IResident[] {
    const residents: IResident[] = residentsToCheck.filter(isPresent);
    if (residents.length > 0) {
      const residentCollectionIdentifiers = residentCollection.map(residentItem => getResidentIdentifier(residentItem)!);
      const residentsToAdd = residents.filter(residentItem => {
        const residentIdentifier = getResidentIdentifier(residentItem);
        if (residentIdentifier == null || residentCollectionIdentifiers.includes(residentIdentifier)) {
          return false;
        }
        residentCollectionIdentifiers.push(residentIdentifier);
        return true;
      });
      return [...residentsToAdd, ...residentCollection];
    }
    return residentCollection;
  }
}
