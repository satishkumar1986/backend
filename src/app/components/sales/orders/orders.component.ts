import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];

  settings = {

    actions:true,
    hideSubHeader:false,

    columns: {

      orderId: {
        title: 'Order Id'
      },

      invoiceNo: {
        title: 'Invoice No'
      },

      paymentStatus: {
        title: 'Payment Status', type: 'html'
      },

      paymentMethod: {
        title: 'Payment Method'
      },

      orderStatus: {
        title: 'Order Status', type: 'html'
      },

      paymentDate: {
        title: 'Payment Date'
      },

      subTotalAmount: {
        title: 'Sub Total Amount'
      },

      shippingAmount: {
        title: 'Shipping Amount'
      },

      totalAmount: {
        title: 'Total Amount'
      }

    }

  }

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder').subscribe(res => {
      console.log(res);
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Orders')
      }
    })
  }

}
