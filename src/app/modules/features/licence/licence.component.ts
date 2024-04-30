import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddUnityComponent } from './add-unity/add-unity.component';
import { ConvertAllComponent } from './convert-all/convert-all.component';
import { AddCloudComponent } from './add-cloud/add-cloud.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { AssignMaintenanceComponent } from './assign-maintenance/assign-maintenance.component';
import { ExtendMaintenanceComponent } from './extend-maintenance/extend-maintenance.component';
import { SubscribeMaintenanceComponent } from './subscribe-maintenance/subscribe-maintenance.component';
import { UpdateLicenceAssigneeComponent } from './update-licence-assignee/update-licence-assignee.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { ChangeSubscriptionComponent } from './change-subscription/change-subscription.component';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})

export class LicenceComponent implements OnInit {
  displayedColumnsCloud: string[] = ['licence_key', 'licence_type', 'assigned_to'];
  displayedColumnsUnityEditor: string[] = ['licence_key', 'licence_type', 'assigned_to'];
  displayedColumns: string[] = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive', 'action'];
  displayedColumnsMaintenance: string[] = ['licences_maintenance_key', 'maintenance_type', 'number_days', 'status'];
  // dataSource = new MatTableDataSource<PeriodicElement>();selectedTab: number;
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSourceMaintenance = new MatTableDataSource<PeriodicElementMaintenance>();
  dataSourceCloud = new MatTableDataSource<PeriodicElementCloud>();
  dataSourceUnityEditor = new MatTableDataSource<PeriodicElementUnityEditor>();
  isLoading = false;
  paginate = 100;
  page = 0;
  // bgcolor: any;
  licences: any = [];
  maintenances: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users: any;
  category;
  features: any;
  feature_permission: any;
  current_url: any;
  date_next_charge: any;
  subscriptions: any;
  selected;
  search = '';
  userId;
  role_id;
  url;
  selectedTab: any;
  timestampToday: any;
  timestampMaintenanceExpire: any;
  id;

  constructor(
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    // this.userId = this.route.snapshot.params['id'];
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.userId = user.id;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
    this.category = 'On Premise';
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const part = parts[1];
    this.url = part[1];
    if (part.length > 1) {
      const search = part[1].split('=');
      this.search = search[1];
      this.selected = this.search;
    }
    this.selectedTab = 0;
    this.displayedColumns = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive', 'action'];
    this.spinner.show();
    this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
      const that = this;
      that.licences = res.data;
      that.licences = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
      that.dataSource = res.data.licences;
      that.dataSource = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
      that.date_next_charge = res.data.date_next_charge;

      that.licences.forEach(function (data, i) {
        const today = new Date();
        that.dataSource[i].timestampToday = that.toTimestamp(today);
        that.dataSource[i].timestampMaintenanceExpire = that.toTimestamp(data.maintenance_expire);
        that.dataSource[i].licence_type_name = data.licence_type;
        const maintenance_expire = that.getMaintenanceExpire(that.date_next_charge, data);
        that.dataSource[i].maintenance_expire = maintenance_expire;
        const licence_type = that.getLicencesType(data.licence_type);
        that.dataSource[i].licence_type = licence_type;
        const connections = that.getConnections(data.connections);
        that.dataSource[i].connections = connections;
        that.subscriptions = res.data.subscriptions;
      });
      that.isLoading = false;
      this.spinner.hide();
    });
    /*this.displayedColumnsCloud = ['licence_key','assigned_to','licence_type'];
    this.commonService.getUserLicences(this.category,this.userId,this.paginate,this.page,this.search).subscribe(res => {
      this.maintenances = res.data;
      this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
      this.date_next_charge = res.data.date_next_charge;
      this.isLoading = false;
    });*/

    console.log(this.features, this.feature_permission);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getServerData($event) {
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    this.category = 'On Premise';
    this.displayedColumnsCloud = ['licence_key', 'assigned_to', 'licence_type'];
    /*this.commonService.getUserLicences(this.category,this.userId,this.paginate,this.page,this.search).subscribe(res => {
      this.maintenances = res.data;
      this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
      this.date_next_charge = res.data.date_next_charge;
      this.isLoading = false;
    });*/
  }

  getLicences(event) {
    let type = "";
    if (event.tab.textLabel == 'Cloud') {
      type = 'Cloud';
      // this.selectedTab = 0;
    } else if (event.tab.textLabel == 'On Premise') {
      type = 'On Premise';
      // this.selectedTab = 1;
      this.selectedTab = 0;
    } else if (event.tab.textLabel == 'Maintenance Plan') {
      type = 'Maintenance Plan';
      // this.selectedTab = 2;
      this.selectedTab = 1;
    } else if (event.tab.textLabel == 'Unity Editor') {
      type = 'Unity Editor';
      // this.selectedTab = 3;
      this.selectedTab = 2;
    }

    this.category = type;
    this.isLoading = true;
    if (this.category === 'Cloud') {
      this.displayedColumnsCloud = ['licence_key', 'assigned_to', 'licence_type'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        this.maintenances = res.data;
        this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
        this.date_next_charge = res.data.date_next_charge;
        this.isLoading = false;
      });
    } else if (this.category === 'On Premise') {
      this.displayedColumns = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive', 'action'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        const that = this;
        that.licences = res.data;
        that.licences = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
        that.dataSource = res.data.licences;
        that.dataSource = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
        that.date_next_charge = res.data.date_next_charge;

        that.licences.forEach(function (data, i) {
          const today = new Date();
          that.dataSource[i].timestampToday = that.toTimestamp(today);
          that.dataSource[i].timestampMaintenanceExpire = that.toTimestamp(data.maintenance_expire);
          that.dataSource[i].licence_type_name = data.licence_type;
          const maintenance_expire = that.getMaintenanceExpire(that.date_next_charge, data);
          that.dataSource[i].maintenance_expire = maintenance_expire;
          const licence_type = that.getLicencesType(data.licence_type);
          that.dataSource[i].licence_type = licence_type;
          const connections = that.getConnections(data.connections);
          that.dataSource[i].connections = connections;
          that.subscriptions = res.data.subscriptions;
        });
        that.isLoading = false;
      });
    } else if (this.category === 'Maintenance Plan') {
      this.displayedColumnsMaintenance = ['licences_maintenance_key', 'maintenance_type', 'number_days', 'status'];
      this.displayedColumns = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        const that = this;
        that.licences = res.data;
        that.maintenances = res.data.maintenances;
        that.dataSource = res.data.maintenances;
        that.date_next_charge = res.data.date_next_charge;
        that.isLoading = false;
      });
    } else if (this.category === 'Unity Editor') {
      this.displayedColumnsUnityEditor = ['licence_key', 'assigned_to', 'licence_type'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        this.licences = res.data;
        this.subscriptions = res.data.subscriptions;
        this.dataSource = res.data.licences;
        this.dataSource = res.data.licences.filter(a => a.licence_type === 'EDITOR');
        this.date_next_charge = res.data.date_next_charge;
        this.isLoading = false;
      });
    }

    /*this.category = type;
    this.isLoading = true;
    this.commonService.getDownloads(type,this.url,this.paginate,1,this.search).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = this.downloads.downloads;
      this.user_role = res.data.user_role;
      this.isLoading = false;
    });*/
  }

  openComposeDialogSubscription(id, category): void {
    // Open the dialog
    // console.log(id, this.category);
    const dialogRef = this._matDialog.open(AddSubscriptionComponent, {
      height: '320px',
      width: '700px',
      data: { id, category: this.category }
    });


    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogAddUnity(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddUnityComponent, {
      height: '500px',
      width: '700px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogConvertAll(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ConvertAllComponent, {
      height: '500px',
      width: '700px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogAddCloud(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddCloudComponent, {
      // height: '500px',
      // width: '700px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          window.location.reload();

        }, 1000);
      }
    });
  }

  openComposeDialogAssignMaintenance(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AssignMaintenanceComponent, {
      height: '450px',
      width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogExtendMaintenance(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ExtendMaintenanceComponent, {
      // height: '480px',
      // width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogSubscribeMaintenance(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(SubscribeMaintenanceComponent, {
      height: '350px',
      width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogUpdateLicenceAssignee(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(UpdateLicenceAssigneeComponent, {
      height: '350px',
      width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogCancelSubscription(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CancelSubscriptionComponent, {
      height: '630px',
      width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogChangeSubscription(id, category): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(ChangeSubscriptionComponent, {
      height: '400px',
      width: '700px',
      data: { id, category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  getLicencesType(licenseType) {
    let license_type = "";
    if (licenseType == 'PREM1') {
      license_type = "Atavism On-Premises Advanced";
    } else if (licenseType == 'PREM2') {
      license_type = "Atavism On-Premises Ultra";
    } else if (licenseType == 'PREM3') {
      license_type = "Atavism On-Premises Standard";
    } else if (licenseType == 'PREM4') {
      license_type = "Atavism On-Premises Professional";
    } else if (licenseType == 'PREM5') {
      license_type = "Atavism On-Premises";
    } else if (licenseType == 'PREM5') {
      license_type = "Atavism On-Premises";
    } else if (licenseType == 'TRIAL') {
      license_type = "Atavism On-Premises Trial";
    } else if (licenseType != 'TRIAL') {
      license_type = "Atavism On-Premises Standard Subscription";
    }
    return license_type;
  }

  getConnections(connections) {
    let licence_connections = "";
    if (connections != '') {
      licence_connections = connections;
    }
    return licence_connections;
  }

  getMaintenanceExpire(date_next_charge, data) {
    let maintenance_expire = "";
    const today = new Date();
    const timestampToday = this.toTimestamp(today);
    const timestampMaintenanceExpire = this.toTimestamp(data.maintenance_expire);
    const timestampLastestRelDate = this.toTimestamp(data.latestRelDate);
    maintenance_expire = data.maintenance_expire + " UTC ";

    if (timestampMaintenanceExpire > timestampToday) {
      maintenance_expire += " Will expire in " + data.diff + " days";
    } else if (date_next_charge[data.licence_key] != '' && date_next_charge[data.licence_key] != null) {
      maintenance_expire += " Next charge:" + date_next_charge[data.licence_key] + " UTC";
    } else if (data.licence_type == 'PREM5') {
      if (timestampLastestRelDate < timestampMaintenanceExpire) {
        maintenance_expire += " You can get the latest version " + data.latestRel;
      }
    } else if (timestampMaintenanceExpire > timestampToday) {
      if (data.diff > 180) {
        maintenance_expire += " Extend min " + (parseInt(data.diffRel + 1) - parseInt(data.diff + 180)) + " days to get the latest version " + data.latestRel;
      } else if (timestampLastestRelDate < timestampMaintenanceExpire) {
        maintenance_expire += " You can get the latest version " + data.latestRel;
      } else {
        maintenance_expire += " Extend min " + parseInt(data.diffRel + 1) + " days to get the latest version " + data.latestRel;
      }
    }
    return maintenance_expire;
  }

  toTimestamp(strDate) {
    const datum = Date.parse(strDate);
    return datum / 1000;
  }


}

export interface PeriodicElementUnityEditor {
  licence_key: string;
  assigned_to: string;
  licence_type: string;
}

export interface PeriodicElementCloud {
  licence_key: string;
  assigned_to: string;
  licence_type: string;
}

export interface PeriodicElement {
  licence_key: string;
  licence_type: string;
  connections: string;
  source: string;
  maintenance_expire: string;
  bgcolor: string;
  server_keepalive: string;
  action: string;
}

export interface PeriodicElementMaintenance {
  licences_maintenance_key: string;
  maintenance_type: string;
  number_days: string;
  status: string;
}

