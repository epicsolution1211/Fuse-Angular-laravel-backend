import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdvisorService } from 'app/shared/services/advisor.service';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PeriodicElement } from '../dashboard/dashboard.component';
import { EditAdvisorComponent } from './edit-advisor/edit-advisor.component';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.scss']
})
export class AdvisorComponent implements OnInit {
  /** mat table */
  // displayedColumns = ['advise_name', 'advise_mail_status', 'advise_message_status', 'advise_description', 'action'];
  displayedColumns = ['advise_name', 'advise_mail_status', 'advise_message_status', 'advise_description'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getAdvisorData: any;
  features: any;
  feature_permission: any;
  current_url: any;
  users: any;
  paginate = 100;
  page = 0;

  constructor(
    public advisorService: AdvisorService,
    private _matDialog: MatDialog,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {

    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.current_url = parts[1];



    this.getData();

    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission?.permissions ? this.feature_permission?.permissions : null;
    });
  }

  /** Table filter */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** call get advisor function */
  getData() {
    this.spinner.show();
    this.advisorService.getAdvisorSetting().then((data: any) => {
      const tempData: any = data.data.data[0].advisor_settings;
      this.getAdvisorData = tempData;
      // console.log(tempData);
      this.users = this.getAdvisorData;
      this.dataSource = new MatTableDataSource(tempData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner.hide();
    });
  }

  /** Edit advisores */
  editAdvisor() {
    /** Open edit advisor component */
    const editAdvisorComponent: any = {};
    editAdvisorComponent.title = 'Edit Advise';
    editAdvisorComponent.SaveButton = 'Save';
    editAdvisorComponent.Cancel = 'Cancel';
    editAdvisorComponent.advisorData = this.getAdvisorData;
    const dialogRef = this._matDialog.open(EditAdvisorComponent, {
      data: { dialogData: editAdvisorComponent },
      // height: '575px',
      // width: '1000px',
    });

    /** close edit advisor component */
    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {
        // this.dataSource = new MatTableDataSource(result.data);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.getData();
      }
    });
  }

  /**Next page event */
  getServerData($event) {
    this.spinner.show();
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    // if (this.customerObje.dataOfAdcanceFilter) {
    //   this.commonService.searchCustomers(this.advanceSearch.value).subscribe(res => {
    //     // console.log(res);
    //     this.users = res.data;
    //     this.dataSource = new MatTableDataSource(res.data.users);
    //     this.spinner.hide();
    //   });
    // }
  }

}
