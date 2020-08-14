import { Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { DataService } from '../../shared/services/data.service';
import { Global } from '../../shared/global';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  CashOnDeliveryReport = [];
  settings = {
    actions: true,
    hideSubHeader: false,
    columns: {
      orderId: {
        title: "Order Id", filter: true
      },
      invoiceNo: {
        title: "Invoice No", filter: true
      },
      paymentStatus: {
        title: "Payment Status", filter: true, type: 'html'
      },
      paymentMethod: {
        title: "Payment Method", filter: true
      },
      orderStatus: {
        title: "Order Status", filter: true, type: 'html'
      },
      paymentDate: {
        title: "Payment Date", filter: true
      },
      subTotalAmount: {
        title: "Sub Total Amount", filter: true
      },
      shippingAmount: {
        title: "Shipping Amount", filter: true
      },
      totalAmount: {
        title: "Total Amount", filter: true
      }
    }
  };

  //Ng2 charts lineChart
  salesChartData = [
    { data: [10, 50, 0, 80, 10, 70] },
    { data: [20, 40, 15, 70, 30, 27] },
    { data: [5, 30, 20, 40, 50, 20] }
  ];
  salesChartLabels = ["1 min.", "10 min.", "20 min.", "30 min.", "40 min.", "50 min."];
  salesChartOptions = chartData.salesChartOptions;
  salesChartColors = chartData.salesChartColors;
  salesChartLegend = chartData.salesChartLegend;
  salesChartType = chartData.salesChartType;


  // Ng chartlist
  chart = {

    type: 'Line',

    data: {
      labels: [],
      series: [
        [3, 4, 3, 5, 4, 3, 5]
      ]
    },

    options: {
      showScale: false,
      fullWidth: !0,
      showArea: !0,
      label: false,
      width: '600',
      height: '358',
      low: 0,
      offset: 0,
      axisX: {
        showLabel: false,
        showGrid: false
      },
      axisY: {
        showLabel: false,
        showGrid: false,
        low: 0,
        offset: -10,
      },
    }
  };


  //Ng2 Google Chart
  columnChart1 = {

    chartType: 'ColumnChart',

    dataTable: [
      ["Year", "Sales", "Expenses"],
      ["100", 2.5, 3.8],
      ["200", 3, 1.8],
      ["300", 3, 4.3],
      ["400", 0.9, 2.3],
      ["500", 1.3, 3.6],
      ["600", 1.8, 2.8],
      ["700", 3.8, 2.8],
      ["800", 1.5, 2.8]
    ],

    options: {
      legend: { position: 'none' },
      bars: "vertical",
      vAxis: {
        format: "decimal"
      },
      height: 340,
      width: '100%',
      colors: ["#ff7f83", "#a5a5a5"],
      backgroundColor: 'transparent'
    },
  };


  lineChart: any = {

    chartType: 'LineChart',

    dataTable: [
      ['Month', 'Guardians of the Galaxy', 'The Avengers'],
      [10, 20, 60],
      [20, 40, 10],
      [30, 20, 40],
      [40, 50, 30],
      [50, 20, 80],
      [60, 60, 30],
      [70, 10, 20],
      [80, 40, 90],
      [90, 20, 0]
    ],

    options: {
      colors: ["#ff8084", "#a5a5a5"],
      legend: { position: 'none' },
      height: 500,
      width: '100%',
      backgroundColor: 'transparent'
    },
  };

  constructor(private _dataService:DataService, private _toastr:ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this._dataService.get(Global.BASE_API_PATH + 'PaymentMaster/GetReportInvoiceList').subscribe(res=>{
      if(res.isSuccess){
        this.CashOnDeliveryReport = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Report Master');
      }      
    })
  }

}
