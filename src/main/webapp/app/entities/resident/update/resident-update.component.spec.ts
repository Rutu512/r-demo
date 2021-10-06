jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ResidentService } from '../service/resident.service';
import { IResident, Resident } from '../resident.model';

import { ResidentUpdateComponent } from './resident-update.component';

describe('Component Tests', () => {
  describe('Resident Management Update Component', () => {
    let comp: ResidentUpdateComponent;
    let fixture: ComponentFixture<ResidentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let residentService: ResidentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ResidentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ResidentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResidentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      residentService = TestBed.inject(ResidentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const resident: IResident = { id: 456 };

        activatedRoute.data = of({ resident });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(resident));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Resident>>();
        const resident = { id: 123 };
        jest.spyOn(residentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ resident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: resident }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(residentService.update).toHaveBeenCalledWith(resident);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Resident>>();
        const resident = new Resident();
        jest.spyOn(residentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ resident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: resident }));
        saveSubject.complete();

        // THEN
        expect(residentService.create).toHaveBeenCalledWith(resident);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Resident>>();
        const resident = { id: 123 };
        jest.spyOn(residentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ resident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(residentService.update).toHaveBeenCalledWith(resident);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
