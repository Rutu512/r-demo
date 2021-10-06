import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResident } from '../resident.model';

@Component({
  selector: 'jhi-resident-detail',
  templateUrl: './resident-detail.component.html',
})
export class ResidentDetailComponent implements OnInit {
  resident: IResident | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resident }) => {
      this.resident = resident;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
