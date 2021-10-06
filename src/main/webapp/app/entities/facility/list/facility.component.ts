import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFacility } from '../facility.model';
import { FacilityService } from '../service/facility.service';
import { FacilityDeleteDialogComponent } from '../delete/facility-delete-dialog.component';

@Component({
  selector: 'jhi-facility',
  templateUrl: './facility.component.html',
})
export class FacilityComponent implements OnInit {
  facilities?: IFacility[];
  isLoading = false;

  constructor(protected facilityService: FacilityService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.facilityService.query().subscribe(
      (res: HttpResponse<IFacility[]>) => {
        this.isLoading = false;
        this.facilities = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFacility): number {
    return item.id!;
  }

  delete(facility: IFacility): void {
    const modalRef = this.modalService.open(FacilityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.facility = facility;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
