import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IResident, Resident } from '../resident.model';
import { ResidentService } from '../service/resident.service';

@Component({
  selector: 'jhi-resident-update',
  templateUrl: './resident-update.component.html',
})
export class ResidentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    residentnamr: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });

  constructor(protected residentService: ResidentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resident }) => {
      this.updateForm(resident);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resident = this.createFromForm();
    if (resident.id !== undefined) {
      this.subscribeToSaveResponse(this.residentService.update(resident));
    } else {
      this.subscribeToSaveResponse(this.residentService.create(resident));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResident>>): void {
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

  protected updateForm(resident: IResident): void {
    this.editForm.patchValue({
      id: resident.id,
      residentnamr: resident.residentnamr,
    });
  }

  protected createFromForm(): IResident {
    return {
      ...new Resident(),
      id: this.editForm.get(['id'])!.value,
      residentnamr: this.editForm.get(['residentnamr'])!.value,
    };
  }
}
