import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateUserComponent, ListUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
