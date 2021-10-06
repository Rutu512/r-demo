import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRoom, Room } from '../room.model';
import { RoomService } from '../service/room.service';

@Component({
  selector: 'jhi-room-update',
  templateUrl: './room-update.component.html',
})
export class RoomUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    roomname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });

  constructor(protected roomService: RoomService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.updateForm(room);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const room = this.createFromForm();
    if (room.id !== undefined) {
      this.subscribeToSaveResponse(this.roomService.update(room));
    } else {
      this.subscribeToSaveResponse(this.roomService.create(room));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoom>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(room: IRoom): void {
    this.editForm.patchValue({
      id: room.id,
      roomname: room.roomname,
    });
  }

  protected createFromForm(): IRoom {
    return {
      ...new Room(),
      id: this.editForm.get(['id'])!.value,
      roomname: this.editForm.get(['roomname'])!.value,
    };
  }
}
