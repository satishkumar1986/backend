import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './physical/add-product/add-product.component';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from 'ngx-ckeditor';


@NgModule({
  declarations: [AddProductComponent, ProductListComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
    CKEditorModule
  ]
})
export class ProductsModule { }
