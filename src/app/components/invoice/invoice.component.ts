import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { Global } from '../../shared/global';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  settings = {

    actions: true,
    hideSubHeader: false,

    columns: {

      invoiceNo: {
        title: 'id'
      },

      paymentStatus: {
        title: 'Payment Status', type: 'html'
      },

      paymentMethod: {
        title: 'Payment Method'
      },

      paymentDate: {
        title: 'Payment Date'
      },

      orderStatus: {
        title: "Order Status", type: 'html'
      },

      subTotalAmount: {
        title: 'Sub Total Amount'
      },

      shippingAmount: {
        title: 'Shipping Amount'
      },

      totalAmount: {
        title: 'Total Amount'
      },

    }

  };


  invoice = [];

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportInvoiceList/').subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.invoice = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Invoice Master');
      }
    })
  }

}
