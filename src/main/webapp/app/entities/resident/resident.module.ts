import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ResidentComponent } from './list/resident.component';
import { ResidentDetailComponent } from './detail/resident-detail.component';
import { ResidentUpdateComponent } from './update/resident-update.component';
import { ResidentDeleteDialogComponent } from './delete/resident-delete-dialog.component';
import { ResidentRoutingModule } from './route/resident-routing.module';

@NgModule({
  imports: [SharedModule, ResidentRoutingModule],
  declarations: [ResidentComponent, ResidentDetailComponent, ResidentUpdateComponent, ResidentDeleteDialogComponent],
  entryComponents: [ResidentDeleteDialogComponent],
})
export class ResidentModule {}
