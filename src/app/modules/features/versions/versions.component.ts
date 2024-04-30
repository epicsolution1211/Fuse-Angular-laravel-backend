import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AddVesionComponent } from './add-vesion/add-vesion.component';
import { AddDownloadComponent } from '../downloads/add-download/add-download.component';

@Component({
  selector: 'app-versions',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss']
})
export class VersionsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'version', 'release_date', 'status', 'downloads'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  isLoading = false;
  versions;
  paginate = 10;
  page: any;
  category;
  search = '';

  constructor(
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.category = 'Atavism Server';
    this.isLoading = true;
    this.commonService.getVersions().subscribe(res => {
      // console.log(res.data);
      this.versions = res.data;
      this.dataSource = res.data.versions;
      this.isLoading = false;

    });
  }

  sortData($event) {
    // console.log($event.value);
  }

  getServerData($event) {
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    this.commonService.getVersions(this.paginate, this.page).subscribe(res => {
      this.versions = res.data;
      this.dataSource = res.data.versions;
      this.isLoading = false;
    });
  }

  openDialog(downloadId) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this release and all its related downloads?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deleteVersion(downloadId).subscribe(res => {
          this.toastr.success(res.message, 'OK');
          this.isLoading = false;
          this._router.navigate(['/releases/delete']);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  openEditDialog(releaseId): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddVesionComponent, {
      height: '400px',
      width: '800px',
      data: { releaseId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddVesionComponent, {
      height: '400px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openComposeDialogAddDownload(version): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddDownloadComponent, {
      height: '575px',
      width: '1000px',
      data: { category: this.category, latest_version: this.search, version }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }


  confirmStatusChange(releaseId, status) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to change status of this release?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      // console.log('confirmed', confirmed);
      if (confirmed) {
        this.changeStatus(releaseId, status);
        this.commonService.getVersions().subscribe(res => {
          // console.log(res.data);
          this.versions = res.data;
          this.dataSource = res.data.versions;
          this.isLoading = false;

        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }


  /** change status*/
  changeStatus(releaseID, val) {
    this.isLoading = true;
    this.commonService.statusUpdate(releaseID, val).subscribe(res => {
      this.toastr.success(res.message);
      this.isLoading = false;
    });
  }

}

export interface PeriodicElement {
  username: string;
  email: string;
  licencekey: string;
  discord: string;
  registered_since: string;
  last_sign_in: string;
  status: string;
}
