import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { DownloadService } from 'app/shared/services/download.service';
import { AddDownloadComponent } from './add-download/add-download.component';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'date', 'status', 'downloads'];
  dataSource = new MatTableDataSource<PeriodicElement>(); selectedTab: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  versions: any;
  selected;
  downloads: any;
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
    private _router: Router,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      this.current_url = 'downloads';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);

      const testDownload = permission_arr.find(p => p.feature_id == 11);
      if (testDownload?.permissions) {
        this.testDownloadDisabled = true;
      }

      const disableDownload = permission_arr.find(p => p.feature_id == 12);
      if (disableDownload?.permissions) {
        this.disabledDownloadDisabled = true;
      }

      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission.permissions;

      this.selected = 'active';
      if (this.feature_permission.includes('update') == false) {

        this.displayedColumns = ['name', 'date', 'downloads'];
      }

      this.cd.markForCheck();
    });

    this.category = 'Atavism Server';
    this.spinner.show();
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const part = parts[2].split(';');
    this.url = part[0];
    if (part.length > 1) {
      const search = part[1].split('=');
      this.search = search[1];
      this.selected = this.search;
    }
    /*this.downloadService.getDownloads('Atavism Server', this.url, this.paginate, this.page, this.search).then(res => {
      // console.log("Response = ", res);
        this.downloads = res;
        this.versions = this.downloads.releases;
        this.user_role = this.downloads.user_role;
        this.latest = this.versions.shift();
        this.dataSource = this.downloads.downloads;

        this.spinner.hide();
        const newVersion =  new Array();
        newVersion['version'] = 'all';
        newVersion['name'] = 'All Versions';
        this.versions.unshift(newVersion);
        if(this.search == undefined || this.search == '' ){
          this.selected = 'all';
        }
    });*/

    // this.downloadService.getDownloads('Atavism Server', this.url, this.paginate, this.page, this.search).subscribe(res => {
    //   this.downloads = res.data;
    //   this.versions = res.data.releases;
    //   this.user_role = res.data.user_role;
    //   this.latest = this.versions.shift();
    //   this.dataSource = res.data.downloads;

    //   this.spinner.hide();
    //   const newVersion =  new Array();
    //   newVersion['version'] = 'all';
    //   newVersion['name'] = 'All Versions';
    //   this.versions.unshift(newVersion);
    //   if(this.search == undefined || this.search == '' ){
    //     this.selected = 'all';
    //   }
    // });

    this.commonService.getDownloads('Atavism Server', this.url, this.paginate, this.page, this.search).subscribe(res => {
      this.downloads = res.data;
      this.versions = res.data.releases;
      this.user_role = res.data.user_role;
      this.latest = this.versions.shift();
      this.dataSource = res.data.downloads;

      this.spinner.hide();
      const newVersion: any = new Array();
      newVersion.version = 'all';
      newVersion.name = 'All Versions';
      this.versions.unshift(newVersion);
      if (this.search == undefined || this.search == '') {
        this.selected = 'all';
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getDownloads(event) {
    // this.downloadService.getDownloads(event.tab.textLabel, this.url, this.paginate, this.page, this.search).then(res=> {
    //   this.downloads = res;
    //   this.dataSource = this.downloads.downloads;
    //   this.user_role = this.downloads.user_role;
    //   this.spinner.hide();
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
    this.spinner.hide();
    this.commonService.getDownloads(type, this.url, this.paginate, 1, this.search).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = this.downloads.downloads;
      this.user_role = res.data.user_role;
      this.spinner.hide();
    });
  }

  versionChange($event, val) {
    this.search = $event.value;
    this.commonService.getDownloads(this.category, this.url, this.paginate, 1, this.search).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.user_role = res.data.user_role;
      this.spinner.hide();
    });
  }

  confirmStatusChange(userId, status) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to change status of this download?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // console.log("userId, status", userId, status);
        this.changeStatus(userId, status);
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }
  openComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddDownloadComponent, {
      height: '810px',
      width: '1000px',
      data: { category: this.category, latest_version: this.search }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  changeStatus(download_id, val) {
    this.spinner.hide();
    this.commonService.changeDownloadStatus(download_id, val).subscribe(res => {
      this.toastr.success(res.message, 'OK');
      this.spinner.hide();
      let type = "";
      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      if (this.selectedTab == 0) {
        type = 'Atavism Server';
        this.selectedTab = 0;
      } else if (this.selectedTab == 1) {
        type = 'Unity';
        this.selectedTab = 1;
      } else if (this.selectedTab == 2) {
        type = 'Other';
        this.selectedTab = 2;
      } else if (this.selectedTab == 3) {
        type = 'Asset';
        this.selectedTab = 3;
      } else if (this.selectedTab == 4) {
        type = 'Test';
        this.selectedTab = 4;
      } else if (this.selectedTab == 5) {
        type = 'Disabled';
        this.selectedTab = 5;
      }
      // this.spinner.hide();
      this.commonService.getDownloads(type, this.url, this.paginate, 1, this.search).subscribe(res => {
        this.downloads = res.data;
        this.dataSource = res.data.downloads;
        this.user_role = res.data.user_role;
        this.spinner.hide();
        this.cd.markForCheck();
      });
      // this._router.navigate(['/downloads/delete',{type:this.url}]);
    });
  }

  openDialog(downloadId) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this download?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deleteDownload(downloadId).subscribe(res => {
          this.toastr.success(res.message, 'OK');
          this.spinner.hide();
          this._router.navigate(['/downloads/delete', { type: this.url }]);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  downloadLog(download, downloadId, version) {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    const formData = new FormData();
    this.url = parts[2];
    this.user_id = user.id;
    formData.append("user_id", this.user_id);
    formData.append("download_id", downloadId);
    formData.append("version", version);
    this.commonService.downloadLogs(formData).subscribe(res => {
      if (res.status) {
        window.location.href = download;
      }
    });
  }

  openEditDialog(downloadId, version): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddDownloadComponent, {
      height: '700px',
      width: '1000px',
      data: { downloadId, category: this.category, version }
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
    this.commonService.getDownloads(this.category, this.url, this.paginate, this.page, this.search).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.user_role = res.data.user_role;
      this.spinner.hide();
    });
  }

}

export interface PeriodicElement {
  name: string;
  description: string;
  date: number;
  download: string;
}