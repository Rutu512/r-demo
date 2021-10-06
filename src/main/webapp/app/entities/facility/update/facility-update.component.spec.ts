jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FacilityService } from '../service/facility.service';
import { IFacility, Facility } from '../facility.model';

import { FacilityUpdateComponent } from './facility-update.component';

describe('Component Tests', () => {
  describe('Facility Management Update Component', () => {
    let comp: FacilityUpdateComponent;
    let fixture: ComponentFixture<FacilityUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let facilityService: FacilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FacilityUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FacilityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FacilityUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      facilityService = TestBed.inject(FacilityService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const facility: IFacility = { id: 456 };

        activatedRoute.data = of({ facility });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(facility));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Facility>>();
        const facility = { id: 123 };
        jest.spyOn(facilityService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ facility });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: facility }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(facilityService.update).toHaveBeenCalledWith(facility);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Facility>>();
        const facility = new Facility();
        jest.spyOn(facilityService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ facility });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: facility }));
        saveSubject.complete();

        // THEN
        expect(facilityService.create).toHaveBeenCalledWith(facility);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Facility>>();
        const facility = { id: 123 };
        jest.spyOn(facilityService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ facility });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(facilityService.update).toHaveBeenCalledWith(facility);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
