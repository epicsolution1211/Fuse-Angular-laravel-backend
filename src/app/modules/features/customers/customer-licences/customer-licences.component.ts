import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { LicenceGenerateService } from 'app/shared/services/licence-generate.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { AddSubscriptionComponent } from '../../licence/add-subscription/add-subscription.component';
import { AssignMaintenanceComponent } from '../../licence/assign-maintenance/assign-maintenance.component';
import { ExtendMaintenanceComponent } from '../../licence/extend-maintenance/extend-maintenance.component';
import { CancelSubscriptionComponent } from '../../licence/cancel-subscription/cancel-subscription.component';
import { ChangeSubscriptionComponent } from '../../licence/change-subscription/change-subscription.component';

@Component({
  selector: 'app-customer-licences',
  templateUrl: './customer-licences.component.html',
  styleUrls: ['./customer-licences.component.scss']
})
export class CustomerLicencesComponent implements OnInit {
  displayedColumnsCloud: string[] = ['licence_key', 'licence_type', 'assigned_to'];
  displayedColumnsUnityEditor: string[] = ['licence_key', 'licence_type', 'assigned_to'];
  displayedColumns: string[] = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive', 'action'];
  displayedColumnsMaintenance: string[] = ['licences_maintenance_key', 'maintenance_type', 'number_days', 'status'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSourceMaintenance = new MatTableDataSource<PeriodicElementMaintenance>();
  dataSourceCloud = new MatTableDataSource<PeriodicElementCloud>();
  dataSourceUnityEditor = new MatTableDataSource<PeriodicElementUnityEditor>();
  paginate = 100;
  page = 0;
  licences: any = [];
  maintenances: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users: any;
  category;
  features: any;
  feature_permission: any;
  current_url: any;
  selected;
  search = '';
  userId;
  role_id;
  url;
  selectedTab: any;
  timestampToday: any;
  timestampMaintenanceExpire: any;
  id;
  date_next_charge: any;
  subscriptions: any;

  usernameOflicence: any;

  constructor(
    private _matDialog: MatDialog,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public licenceService: LicenceGenerateService
  ) {

  }

  ngOnInit(): void {
    // this.userId = this.route.snapshot.params['id'];
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spinner.show();
    this.category = 'On Premise';
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const part = parts[1];
    this.url = part[1];
    this.userId = parts[3];
    if (part.length > 1) {
      const search = part[1].split('=');
      this.search = search[1];
      this.selected = this.search;
    }
    this.selectedTab = 0;
    this.displayedColumns = ['licence_key', 'licence_type', 'connections', 'source', 'maintenance_expire', 'server_keepalive', 'action'];
    this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
      const that = this;
      that.licences = res.data;
      that.licences = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
      that.dataSource = res.data.licences;
      that.dataSource = res.data.licences.filter(a => a.licence_type !== 'EDITOR');
      that.date_next_charge = res.data.date_next_charge;
      this.usernameOflicence = res.data.user;

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
      this.spinner.hide();
    });
    /*this.displayedColumnsCloud = ['licence_key','assigned_to','licence_type'];
    this.commonService.getUserLicences(this.category,this.userId,this.paginate,this.page,this.search).subscribe(res => {
      this.maintenances = res.data;
      this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
      this.date_next_charge = res.data.date_next_charge;
      this.isLoading = false;
    });*/
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
    this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
      this.maintenances = res.data;
      this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
      this.date_next_charge = res.data.date_next_charge;
      this.spinner.hide();
    });
  }

  getLicences(event) {
    let type = "";
    if (event.tab.textLabel == 'Cloud') {
      type = 'Cloud';
      this.selectedTab = 0;
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
    this.spinner.show();
    if (this.category === 'Cloud') {
      this.displayedColumnsCloud = ['licence_key', 'assigned_to', 'licence_type'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        this.maintenances = res.data;
        this.dataSource = res.data.licences.filter(a => a.licence_type === 'CLOUD');
        this.date_next_charge = res.data.date_next_charge;
        this.spinner.hide();
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
        this.spinner.hide();
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
        this.spinner.hide();
      });
    } else if (this.category === 'Unity Editor') {
      this.displayedColumnsUnityEditor = ['licence_key', 'assigned_to', 'licence_type'];
      this.commonService.getUserLicences(this.category, this.userId, this.paginate, this.page, this.search).subscribe(res => {
        this.licences = res.data;
        this.subscriptions = res.data.subscriptions;
        this.dataSource = res.data.licences;
        this.dataSource = res.data.licences.filter(a => a.licence_type === 'EDITOR');
        this.date_next_charge = res.data.date_next_charge;
        this.spinner.hide();
      });
    }
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

  /** Regenrate licence key */
  regenerateKey(param, type) {

    const confirmTitle: any = {};
    if (type == 'Regenarate') {
      confirmTitle.headerText = 'Are you sure you want to Regenerate Licence key?';
      confirmTitle.confirmButton = 'Regenerate Licence key';
      confirmTitle.regenrateKey = true;
      confirmTitle.licenceKeyId = param.id;

      /** popup modal open */

      const dialogRef = this._matDialog.open(ConfirmModalComponent, {
        data: { dialogData: confirmTitle }
      });

    } else {
      confirmTitle.headerText = 'Verification';
      confirmTitle.confirmButton = 'Submit';
      confirmTitle.regenrateKey = true;
      confirmTitle.licenceKeyId = param.id;
      confirmTitle.userId = this.userId;

      /** popup modal open */

      const dialogRef = this._matDialog.open(VerifyCodeComponent, {
        data: { dialogData: confirmTitle },
        // height: '575px',
        // width: '1000px',
      });

      /** close the open dialog */
      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }
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
      // height: '450px',
      // width: '700px',
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
  server_keepalive: string;
  action: string;
}
export interface PeriodicElementMaintenance {
  licences_maintenance_key: string;
  maintenance_type: string;
  number_days: string;
  status: string;
}