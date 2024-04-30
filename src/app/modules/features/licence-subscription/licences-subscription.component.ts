import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { DownloadService } from 'app/shared/services/download.service';
import { AddLicenceSubscriptionComponent } from './add-licence/add-licence-subscription.component';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-licences-subscription',
  templateUrl: './licences-subscription.component.html',
  styleUrls: ['./licences-subscription.component.scss']
})
export class LicencesSubscriptionComponent implements OnInit {
  displayedColumns: string[] = ['product_name', 'published', 'licences'];
  isLoading: boolean;
  dataSource = new MatTableDataSource<PeriodicElement>(); selectedTab: number;
  versions: any;
  selected;
  licences: any;
  published: any;
  url;
  latest;
  filter: FormControl = new FormControl();
  category;
  paginate = 10;
  page = 0;
  user_id;
  search = '';
  user_role;
  features: any;
  feature_permission: any;
  current_url;
  testDownloadDisabled: boolean = false;
  disabledDownloadDisabled: boolean = false;

  constructor(private commonService: CommonService,
    private downloadService: DownloadService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      this.current_url = 'Licences Management';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      if (this.feature_permission != undefined) {
        this.feature_permission = this.feature_permission.permissions;
        this.selected = 'active';
        if (this.feature_permission.includes('update') == true) {
          this.displayedColumns = ['product_name', 'published', 'licences'];
          this.getLiceceData();
        } else {
          this.displayedColumns = ['product_name', 'licences'];
          this.getLiceceData();
        }
      } else {
        this.getLiceceData();
      }
    });


  }

  getLiceceData() {
    this.isLoading = true;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const part = parts[2].split(';');
    const type = parts[2];
    this.url = part[2];
    this.category = type;
    if (part.length > 1) {
      const search = part[1].split('=');
      this.search = search[1];
      this.selected = this.search;
    }
    this.commonService.getLicences(this.category, this.paginate, this.page, this.search).subscribe(res => {
      this.licences = res.data;
      this.dataSource = res.data.licences;
      this.isLoading = false;
      if (this.search == undefined || this.search == '') {
        this.selected = 'all';
      }
    });
  }

  getLicences(event) {
    // this.downloadService.getDownloads(event.tab.textLabel, this.url, this.paginate, this.page, this.search).then(res=> {
    //   this.downloads = res;
    //   this.dataSource = this.downloads.downloads;
    //   this.user_role = this.downloads.user_role;
    //   this.isLoading = false;
    // });
    let type = "";
    if (event.tab.textLabel == 'Atavism Server') {
      type = 'Atavism Server';
      this.selectedTab = 0;
    } else if (event.tab.textLabel == 'Atavism Unity Packages') {
      type = 'Unity';
      this.selectedTab = 1;
    } else if (event.tab.textLabel == 'Other Atavism Downloads') {
      type = 'Other';
      this.selectedTab = 2;
    } else if (event.tab.textLabel == 'Asset Packages') {
      type = 'Asset';
      this.selectedTab = 3;
    } else if (event.tab.textLabel == 'Test Version Downloads') {
      type = 'Test';
      this.selectedTab = 4;
    } else if (event.tab.textLabel == 'Admin Disabled Version Downloads') {
      type = 'Disabled';
      this.selectedTab = 5;
    }
    this.category = type;
    this.isLoading = true;
    this.commonService.getLicences(type, this.paginate, 1, this.search).subscribe(res => {
      this.licences = res.data;
      this.dataSource = this.licences.licences;
      this.user_role = res.data.user_role;
      this.isLoading = false;
    });
  }

  confirmStatusChange(licenceId, status) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to change status of this licence?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.changeLicenceSubscriptionStatus(licenceId, status);
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }
  openLicenceComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddLicenceSubscriptionComponent, {
      height: '640px',
      width: '1000px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  changeLicenceSubscriptionStatus(licenceId, status) {
    this.isLoading = true;
    this.commonService.changeLicenceSubscriptionStatus(licenceId, status).subscribe(res => {
      this.toastr.success(res.message);
      this.isLoading = false;
      // this.isLoading = true;
      this.commonService.getLicences(this.category, this.paginate, 1, this.search).subscribe(res => {
        this.licences = res.data;
        this.dataSource = this.licences.licences;
        this.user_role = res.data.user_role;
        this.isLoading = false;
      });
      // this._router.navigate(['/downloads/delete',{type:this.url}]);
    });
  }

  openDeleteLicenceDialog(configurationId) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this licence?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deleteLicenceSubscription(configurationId).subscribe(res => {
          this.toastr.success(res.message);
          this.isLoading = false;
          this._router.navigate(['/licence/subscription/delete']);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  openEditLicenceDialog(configurationId): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddLicenceSubscriptionComponent, {
      height: '640px',
      width: '1000px',
      data: { configurationId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  getServerData($event) {
    if (this.paginate != $event.pageSize) {
      this.page = 0;
    } else {
      this.page = $event.pageIndex;
    }
    this.paginate = $event.pageSize;
    this.page = this.page + 1;
    this.commonService.getLicences(this.category, this.paginate, this.page, this.search).subscribe(res => {
      this.licences = res.data;
      this.dataSource = res.data.licences;
      this.isLoading = false;
    });
  }

}

export interface PeriodicElement {
  product_name: string;
  published: string;
}