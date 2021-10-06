jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RoomService } from '../service/room.service';
import { IRoom, Room } from '../room.model';

import { RoomUpdateComponent } from './room-update.component';

describe('Component Tests', () => {
  describe('Room Management Update Component', () => {
    let comp: RoomUpdateComponent;
    let fixture: ComponentFixture<RoomUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let roomService: RoomService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RoomUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RoomUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoomUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      roomService = TestBed.inject(RoomService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const room: IRoom = { id: 456 };

        activatedRoute.data = of({ room });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(room));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Room>>();
        const room = { id: 123 };
        jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ room });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: room }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(roomService.update).toHaveBeenCalledWith(room);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Room>>();
        const room = new Room();
        jest.spyOn(roomService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ room });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: room }));
        saveSubject.complete();

        // THEN
        expect(roomService.create).toHaveBeenCalledWith(room);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Room>>();
        const room = { id: 123 };
        jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ room });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(roomService.update).toHaveBeenCalledWith(room);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
