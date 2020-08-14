import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {

  objRows = []

  constructor(private _dataService: DataService, private _toastr: ToastrService, private _router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'userMaster/GetAll').subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.error[0], 'User Master');
      }
    })
  }

  edit(id) {
    this._router.navigate(['users/create-user'], { queryParams: { userId: id } })
  }

  delete(id) {
    let obj = { id: id }
    this._dataService.post(Global.BASE_API_PATH + 'userMaster/Delete', obj).subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this._toastr.success('User Delete Successfully', 'User Master')
        this.getData();
      } else {
        this._toastr.error(res.error[0], 'User Master')
      }
    })
  }

  ngOnDestroy() {
    this.objRows = null
  }

}
