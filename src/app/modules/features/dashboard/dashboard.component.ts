import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ReasonHistoryComponent } from './reason-history/reason-history.component';
import { FormControl } from '@angular/forms';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexGrid,
  ApexTooltip,
  ApexYAxis,
} from "ng-apexcharts";
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  // for apx chart
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  form: FormGroup;
  feedbacksearchform: FormGroup;
  chartsearchform: FormGroup;
  displayedColumns: string[] = ['reason'];
  usersDisplayColumns: string[] = ['id', 'licence_key', 'graph'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSourceLicence = new MatTableDataSource<PeriodicElement>();
  isCustom = false;
  clicked = false;
  submitted: boolean;
  paginate = 10;
  page = 0;
  url;
  role_id;
  userId;
  category;
  allCounts;
  displayDatePicker: boolean;
  subscriptionCancelReasonsData: any;
  features: any;
  feature_permission: any;
  current_url: any;
  xaxis: any;
  selectedOptions: any;
  public usersArr = [];
  licences: any = [];
  licencesArr: any = [];
  // usersArr: Observable<string[]>;
  userFilter: any = {};
  myControl: FormControl = new FormControl();
  selectedUser: any;
  public filter = [
    { "id": 0, "name": "Last 7 hours" },
    { "id": 1, "name": "Last 24 hours" },
    { "id": 2, "name": "Last 7 days" },
    { "id": 3, "name": "Last month" },
    { "id": 4, "name": "Last year" },
    { "id": 5, "name": "Custom" },
  ];
  public selectedFilter = this.filter[0].id;
  public userData = [];
  public multipleChartOptions = [];
  registerDateArr: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dashBoardBoj: any = {};

  spinner1 = 'spinner1';
  spinner2 = 'spinner2';

  /** constructor */
  constructor(
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    const formData = new FormData();
    this.url = parts[2];
    this.role_id = user.role_id;

    // console.log(this.role_id);

    formData.append("role_id", this.role_id);

    /** Get graph data */
    this.commonService.getChartData(formData).subscribe(res => {
      this.licencesArr = res.data.series;
      this.xaxis = res.data.xaxis.categories;
      this.userData = res.data.chartOptions;
      this.multipleChartOptions = res.data.multipleChartOptions;
      this.dashBoardBoj.colours = [];
      this.userData = this.userData.map(element => {
        delete element.grid.row;
        element.tooltip = { theme: 'dark', };
        element.xaxis = {
          categories: element.xaxis.categories,
          labels: {
            style: {
              colors: '#8596b4',
            }
          }
        };
        element.yaxis = {
          labels: {
            style: {
              colors: '#8596b4',
            }
          }
        };
        const randomColor = this.getRandomColor();
        this.dashBoardBoj.colours.push(randomColor);
        element.colors = [randomColor];
        return element;
      });
      this.chart1();
    });
  }

  get f() {
    return this.form.controls;
  }

  changeFilter(event) {
    if (event == 5) {
      this.displayDatePicker = true;
      this.form.get('data_from').validator = (Validators.compose([Validators.required]) as any);
      this.form.get('data_from')?.updateValueAndValidity();
      this.form.get('data_to').validator = (Validators.compose([Validators.required]) as any);
      this.form.get('data_to')?.updateValueAndValidity();
    } else {
      this.displayDatePicker = false;
      this.form.get('data_from')?.clearValidators();
      this.form.get('data_from')?.updateValueAndValidity();
      this.form.get('data_to')?.clearValidators();
      this.form.get('data_to')?.updateValueAndValidity();
    }
  }

  // random color generator
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnInit(): void {
    this.displayDatePicker = false;
    this.clicked = true;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.url = parts[2];
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.role_id = user.role_id;
    this.userId = user.id;
    this.category = 'On Premise';
    const formData = new FormData();
    formData.append("role_id", this.role_id);
    this.form = this._formBuilder.group({
      filter: ['', [Validators.required]],
      data_from: ['', [Validators.required]],
      data_to: ['', [Validators.required]],
    });

    this.feedbacksearchform = this._formBuilder.group({
      users: [''],
      from: [''],
      to: [''],
    });

    this.chartsearchform = this._formBuilder.group({
      filter: [''],
      licence: [''],
      from: [''],
      to: [''],
    });

    this.spinner.show();
    this.commonService.getAllCounts(formData).subscribe(res => {
      this.allCounts = res;
      this.spinner.hide();
      this.spinner.show('spinner1');

    });

    this.commonService.getAllUsers().subscribe(res => {
      this.usersArr = res.data.users;
    });

    this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page).subscribe(res => {
      this.licences = res.data;
      this.licences = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
      this.dataSourceLicence = res.data.licences;
      this.dataSourceLicence = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
    });

    this.userData = this.userData;

    this.multipleChartOptions = this.multipleChartOptions;

    this.xaxis = this.xaxis;

    this.licencesArr = this.licencesArr;
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      this.current_url = 'Feedback Configuration';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      if (this.feature_permission != undefined) {
        this.feature_permission = this.feature_permission.permissions;
      }
    });


    this.commonService.getSubscriptionCancelReasonByUser(this.paginate, this.page).subscribe(res => {
      this.subscriptionCancelReasonsData = res.data;
      this.dataSource = res.data.subscriptionCancelReasons;
      this.spinner.hide('spinner1');
    });

    this.displayedColumns = ['reason'];
    this.usersDisplayColumns = ['id', 'licence_key', 'graph'];
  }

  chart1() {
    this.chartOptions = {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false,
          position: 'topLeft',
          offsetX: 30,
          offsetY: 30,
        },
        marker: {
          show: true,
        },
      },

      dataLabels: {
        enabled: false,
        textAnchor: 'start',
        style: {
          colors: ['#fff']
        },
      },
      stroke: {
        curve: "straight"
      },
      xaxis: {
        categories: this.xaxis,
        labels: {
          style: {
            colors: '#8596b4',
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8596b4',
          }
        }
      },
      colors: this.dashBoardBoj.colours,
      grid: {
        row: {
          // colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
    };

  }

  displayFn(id) {
    if (!id) return '';
    const index = this.usersArr.findIndex(state => state.id === id);
    return this.usersArr[index].username;
  }

  searchGraph() {
    if (this.chartsearchform.valid) {
      const formData = new FormData();
      formData.append("filter", this.chartsearchform.get('filter').value.id);
      formData.append("role_id", this.role_id);
      formData.append("licId", this.chartsearchform.get('licence').value);
      formData.append("data_from", this.chartsearchform.get('from').value);
      formData.append("data_to", this.chartsearchform.get('to').value);
      this.spinner.show('spinner2');

      this.commonService.getChartData(formData).subscribe(res => {
        this.xaxis = res.data.xaxis.categories;
        this.userData = res.data.chartOptions;
        this.spinner.hide('spinner2');

        this.userData = this.userData.map((data, i) => {
          delete data.grid.row;
          data.tooltip = { theme: 'dark', };
          data.xaxis = {
            categories: this.xaxis,
            labels: {
              style: {
                colors: '#8596b4',
              }
            }
          };
          data.yaxis = {
            labels: {
              style: {
                colors: '#8596b4',
              }
            }
          };
          data.colors = [this.dashBoardBoj.colours[i]];
          return data;
        });
        this.chart1();
        this.multipleChartOptions = res.data.multipleChartOptions;
      });

    }
  }

  checkValue(event: any) {
    this.clicked = false;
    if (event.value.id == 5) {
      this.isCustom = true;
    } else {
      this.isCustom = false;
    }
  }

  checkLicenceValue(event: any, licence_id) {
    if (event.target.checked) {
    } else {
    }
  }

  onSelectEvent(value: any) {
    this.clicked = false;
  }

  compareFn(user1: any, user2: any) {
    return user1 && user2 ? user1.id === user2.id : user1 === user2;
  }

  // compareFunction = (o1: any, o2: any) => o1.id===o2.id;

  searchFeedback() {
    const that = this;
    that.submitted = true;
    if (that.feedbacksearchform.valid) {
      const formData = new FormData();
      formData.append("users", that.feedbacksearchform.get('users').value);
      formData.append("from", that.feedbacksearchform.get("from").value);
      formData.append("to", that.feedbacksearchform.get("to").value);
      that.commonService.getSubscriptionCancelReasonByUserData(formData).subscribe(res => {
        that.subscriptionCancelReasonsData = res.data;
        that.dataSource = res.data.subscriptionCancelReasons;
      });
    }
  }

  getServerData($event) {
    if (this.paginate != $event.pageSize) {
      this.page = 0;
    } else {
      this.page = $event.pageIndex;
    }
    this.paginate = $event.pageSize;
    this.page = this.page + 1;
    this.commonService.getSubscriptionCancelReasonByUser(this.paginate, this.page).subscribe(res => {
      this.subscriptionCancelReasonsData = res.data;
      this.dataSource = res.data.subscriptionCancelReasons;
    });
  }

  getFeedbackReasons(id, archieve_id, type) {
    let userId = "";
    let from = "";
    let to = "";
    if (this.feedbacksearchform.get('users').value) {
      userId = this.feedbacksearchform.get('users').value;
    }
    if (this.feedbacksearchform.get('from').value && this.feedbacksearchform.get('to').value) {
      from = this.feedbacksearchform.get('from').value;
      to = this.feedbacksearchform.get('to').value;
    }
    const dialogRef = this._matDialog.open(ReasonHistoryComponent, {

      width: '1000px',
      data: { id, archieve_id, userId, from, to, type }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  reset() {
    const that = this;
    that.feedbacksearchform.reset();
    that.commonService.getSubscriptionCancelReasonByUser(that.paginate, that.page).subscribe(res => {
      that.subscriptionCancelReasonsData = res.data;
      that.dataSource = res.data.subscriptionCancelReasons;
    });
  }

  resetChart() {
    this.spinner.show('spinner2');
    const that = this;
    that.clicked = true;
    that.isCustom = false;
    that.chartsearchform.reset();
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    that.role_id = user.role_id;
    const formData = new FormData();
    formData.append("role_id", that.role_id);
    that.commonService.getChartData(formData).subscribe(res => {
      that.licencesArr = res.data.series;
      that.xaxis = res.data.xaxis;
      that.userData = res.data.chartOptions;
      that.multipleChartOptions = res.data.multipleChartOptions;
      this.userData = this.userData.map((data, i) => {
        data.colors = [this.dashBoardBoj.colours[i]];
        delete data.grid.row;
        data.tooltip = { theme: 'dark', };
        data.xaxis = {
          categories: data.xaxis.categories,
          labels: {
            style: {
              colors: '#8596b4',
            }
          }
        };
        data.yaxis = {
          labels: {
            style: {
              colors: '#8596b4',
            }
          }
        };
        return data;
      });
      this.spinner.hide('spinner2');
    });
  }

  sortData($event) {
    // console.log($event);
  }

}
export interface PeriodicElement {
  reason: string;
}