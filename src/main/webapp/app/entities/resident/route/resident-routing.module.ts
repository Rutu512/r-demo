import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ResidentComponent } from '../list/resident.component';
import { ResidentDetailComponent } from '../detail/resident-detail.component';
import { ResidentUpdateComponent } from '../update/resident-update.component';
import { ResidentRoutingResolveService } from './resident-routing-resolve.service';

const residentRoute: Routes = [
  {
    path: '',
    component: ResidentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResidentDetailComponent,
    resolve: {
      resident: ResidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResidentUpdateComponent,
    resolve: {
      resident: ResidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResidentUpdateComponent,
    resolve: {
      resident: ResidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(residentRoute)],
  exports: [RouterModule],
})
export class ResidentRoutingModule {}
