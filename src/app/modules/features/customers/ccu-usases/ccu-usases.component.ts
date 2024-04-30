import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexDataLabels, ApexTitleSubtitle, ApexGrid, ApexTooltip } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-ccu-usases',
  templateUrl: './ccu-usases.component.html',
  styleUrls: ['./ccu-usases.component.scss']
})
export class CcuUsasesComponent implements OnInit {
  chartsearchform: FormGroup;
  clicked = false;
  isCustom = false;
  submitted: boolean;
  dialogContent: any;
  role_id: any;
  xaxis: any;
  public userData = [];
  dashBoardBoj: any = {};
  public multipleChartOptions = [];
  public chartOptions: Partial<ChartOptions>;
  licenceArray: any = [];

  public filter = [
    { "id": 0, "name": "Last 7 hours" },
    { "id": 1, "name": "Last 24 hours" },
    { "id": 2, "name": "Last 7 days" },
    { "id": 3, "name": "Last month" },
    { "id": 4, "name": "Last year" },
    { "id": 5, "name": "Custom" },
  ];
  public selectedFilter;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CcuUsasesComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
  ) {
    if (data) {
      console.log(data);
      this.dialogContent = data;

      // this.dialogContent = data.user_id;

      // // console.log(this.dialogContent);

      // if (this.dialogContent.licenceID.length > 1) {

      //   this.dialogContent.licenceID.forEach((v: any, i: any) => {

      //     // console.log("this.dialogContent.licences[i]", this.dialogContent.licences[i]);

      //     if (this.dialogContent.licences[i] != undefined) {
      //       const obj: any = {};
      //       obj.licid = v;
      //       obj.name = this.dialogContent.licences[i];
      //       this.licenceArray.push(obj);
      //     }
      //   });

      //   // console.log(this.licenceArray);

      // }

    }


    // let randomColor = this.getRandomColor();

    // this.dashBoardBoj.colours.push(randomColor);
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

  get f() {
    return this.chartsearchform.controls;
  }

  ngOnInit(): void {

    this.chartsearchform = this._formBuilder.group({
      filter: ['', [Validators.required]],
      licence: [''],
      from: [''],
      to: [''],
    });
  }

  /** checkValue  */
  checkValue(event: any) {
    this.clicked = false;
    if (event.value.id == 5) {
      this.isCustom = true;
    } else {
      this.isCustom = false;
    }
  }

  /** Search graph */
  searchGraph() {
    this.multipleChartOptions = [];
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.role_id = user.role_id;
    if (this.chartsearchform.valid) {
      this.spinner.show("spinner-1");
      const formData = new FormData();
      formData.append("filter", this.chartsearchform.get('filter').value.id);
      formData.append("role_id", this.role_id);
      if (this.dialogContent.licences.length > 1) {
        formData.append("licId", this.chartsearchform.get('licence').value);
      } else {
        formData.append("licId", this.dialogContent.licences.map((val) => val.id));
      }
      formData.append("data_from", this.chartsearchform.get('from').value);
      formData.append("data_to", this.chartsearchform.get('to').value);
      this.commonService.getChartData(formData).subscribe(res => {

        if (res.status == 'true') {
          if (res.data.length != 0) {
            this.cd.markForCheck();
            this.xaxis = res.data.xaxis.categories;

            /** date ascending */
            this.xaxis = this.xaxis.sort(function (a, b) {
              const dateA: any = new Date(a), dateB: any = new Date(b);
              return dateA - dateB;
            });
            // console.log(this.xaxis);
            this.userData = res.data.chartOptions;
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
              data.colors = ['#8596b4'];
              return data;
            });
            this.spinner.hide("spinner-1");
            this.multipleChartOptions = res.data.multipleChartOptions;
            this.chart1();
            this.cd.markForCheck();
          } else {
            this.spinner.hide("spinner-1");
            this.toastr.success("No records found!!");
          }

        }
        this.multipleChartOptions = res.data.multipleChartOptions;
      });
    }
  }

  chart1() {

    // console.log(this.xaxis);

    this.spinner.show("spinner-1");
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
    this.spinner.hide("spinner-1");

  }

  onSelectEvent(value: any) {
    this.clicked = false;
  }

}
