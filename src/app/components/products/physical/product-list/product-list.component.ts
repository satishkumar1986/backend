import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../../shared/global';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  objRows = [];

  constructor(private _dataService: DataService, private _toastr: ToastrService, private navRoute: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'productMaster/GetAll').subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master')
      }
    })
  }

  edit(id) {
    //this.navRoute.navigate(['products/physical/add-product'], {queryParams:{productId:id}})
    this.navRoute.navigateByUrl('products/physical/add-product', { state: { productId: id } })
  }

  delete(id) {
    let obj = { id: id }
    this._dataService.post(Global.BASE_API_PATH + "productMaster/Delete", obj).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success('Product Delete Successfully', 'Product Master')
        this.getData();
      } else {
        this._toastr.error(res.errors[0], 'Product Master')
      }
    })
  }

}
