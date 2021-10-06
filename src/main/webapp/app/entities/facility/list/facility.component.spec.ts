import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FacilityService } from '../service/facility.service';

import { FacilityComponent } from './facility.component';

describe('Component Tests', () => {
  describe('Facility Management Component', () => {
    let comp: FacilityComponent;
    let fixture: ComponentFixture<FacilityComponent>;
    let service: FacilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FacilityComponent],
      })
        .overrideTemplate(FacilityComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FacilityComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FacilityService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.facilities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
