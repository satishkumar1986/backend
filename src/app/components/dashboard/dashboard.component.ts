import { Component, OnInit } from '@angular/core';

// import { ChartDataSets, ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts';

import * as chartData from '../../shared/data/chart';
import { DataService } from '../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../shared/global';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isShowOrderStatus: boolean = false;

  orders = [];

  settings = {

    actions: true,
    hideSubHeader: false,

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

  totalOrders = 0;
  totalShipingAmount = 0;
  totalCashonDelvery = 0;
  totalCancel = 0;

  statusText: string = "";
  lineChartData = [];
  lineChartLabels = [];
  lineChartOptions: any;
  lineChartColors: any;
  lineChartLegend: any;
  lineChartType: any;


  // ng 2 chart
  // line chart start used
  // lineChartOptions: any = {
  //   scaleShowGridLines: true,
  //   scaleGridLineWidth: 1,
  //   scaleShowHorizontalLines: true,
  //   scaleShowVerticalLines: true,
  //   bezierCurve: true,
  //   bezierCurveTension: 0.4,
  //   pointDot: true,
  //   pointDotRadius: 4,
  //   pointDotStrokeWidth: 1,
  //   pointHitDetectionRadius: 20,
  //   datasetStroke: true,
  //   datasetStrokeWidth: 2,
  //   datasetFill: true,
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };
  // lineChartColors: Array<any> = [
  //   {
  //     backgroundColor: "transparent",
  //     borderColor: "#01cccd",
  //     pointColor: "#01cccd",
  //     pointStrokeColor: "#fff",
  //     pointHighlightFill: "#fff",
  //     pointHighlightStroke: "#000"
  //   },
  //   {
  //     backgroundColor: "transparent",
  //     borderColor: "#a5a5a5",
  //     pointColor: "#a5a5a5",
  //     pointStrokeColor: "#fff",
  //     pointHighlightFill: "#000",
  //     pointHighlightStroke: "rgba(30, 166, 236, 1)",
  //   },
  //   {
  //     backgroundColor: "transparent",
  //     borderColor: "#ff7f83",
  //     pointColor: "#ff7f83",
  //     pointStrokeColor: "#fff",
  //     pointHighlightFill: "#000",
  //     pointHighlightStroke: "rgba(30, 166, 236, 1)",
  //   }
  // ];
  // lineChartLegend = false;
  // lineChartType = 'line';
  //line chart end used

  constructor(private _dataService: DataService, private _toaster: ToastrService) { }

  ngOnInit(): void {
    this.OrderStatus();
    this.getData();
    this.getNetFigure();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder').subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toaster.error(res.errors[0], 'Dashboard');
      }
    })
  }


  getNetFigure() {
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportNetFigure').subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.totalOrders = res.data[0].orders;
        this.totalShipingAmount = res.data[0].shippingAmount;
        this.totalCashonDelvery = res.data[0].cashOnDelivery;
        this.totalCancel = res.data[0].cancelled;
      } else {
        this._toaster.error(res.error[0], 'Dashboard');
      }
    })
  }

  OrderStatus() {

    let arr = [];
    let objLineChartData = {}

    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetChartOrderStatus').subscribe(res => {
      console.log(res)

      let allData = res.data;

      this.lineChartLabels = allData.map(item => item.date).filter((currentValue, currentIndex, array) => array.indexOf(currentValue) === currentIndex);
      console.log(this.lineChartLabels);

      let orderStatusColumn = allData.map(item => item.orderStatus).filter((currentValue, currentIndex, array) => array.indexOf(currentValue) === currentIndex);
      console.log(orderStatusColumn);

      let varStr = '';

      for (let status of orderStatusColumn) {
        //console.log(status);
        varStr = varStr + '/' + status;
        arr = [];


        for (let date of this.lineChartLabels) {
          //console.log(date);

          for (let all in allData) {
            //console.log(all);

            if (status == allData[all].orderStatus && date == allData[all].date) {
              arr[arr.length] = allData[all].counts;
            }

          }
        }

        objLineChartData = { data: arr, label:status };
        this.lineChartData[this.lineChartData.length] = objLineChartData
        this.isShowOrderStatus = true;

      }

      this.statusText = varStr.replace('/', '');
      this.lineChartColors = chartData.lineChartColors;
      this.lineChartLegend = chartData.lineChartLegend;
      this.lineChartOptions = chartData.lineChartOptions;
      this.lineChartType = chartData.lineChartType;

    })

  }

}