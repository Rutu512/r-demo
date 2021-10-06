import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IResident } from '../resident.model';
import { ResidentService } from '../service/resident.service';

@Component({
  templateUrl: './resident-delete-dialog.component.html',
})
export class ResidentDeleteDialogComponent {
  resident?: IResident;

  constructor(protected residentService: ResidentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.residentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
