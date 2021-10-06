import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IResident } from '../resident.model';
import { ResidentService } from '../service/resident.service';
import { ResidentDeleteDialogComponent } from '../delete/resident-delete-dialog.component';

@Component({
  selector: 'jhi-resident',
  templateUrl: './resident.component.html',
})
export class ResidentComponent implements OnInit {
  residents?: IResident[];
  isLoading = false;

  constructor(protected residentService: ResidentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.residentService.query().subscribe(
      (res: HttpResponse<IResident[]>) => {
        this.isLoading = false;
        this.residents = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IResident): number {
    return item.id!;
  }

  delete(resident: IResident): void {
    const modalRef = this.modalService.open(ResidentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.resident = resident;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
