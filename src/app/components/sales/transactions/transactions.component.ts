import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private _dataService:DataService, private _toastr:ToastrService) { }

  transactions:any[] = [];

  settings = {

    actions:true,
    hideSubHeader:false,
    
    columns: {

      transactionsId:{
        title:'Transactions Id'
      },

      paymentStatus:{
        title:'Payment Status', type:'html'
      },

      paymentMethod:{
        title:'Payment Method'
      },

      orderStatus:{
        title:'Order Status', type:'html'
      },

      paymentDate:{
        title:'Payment Date'
      },

      subTotalAmount:{
        title:'Sub Total Amount'
      },

      shippingAmount:{
        title:'Shipping Amount'
      },

      totalAmount:{
        title:'Total Amount'
      },

    }

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportTransactionDetails').subscribe(res=>{
      console.log(res)
      if(res.isSuccess){
        this.transactions = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Transcatition');
      }
    })
  }

}
