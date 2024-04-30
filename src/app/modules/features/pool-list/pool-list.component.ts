import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'app/shared/services/common.service';
import { DownloadService } from 'app/shared/services/download.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddPromotionComponent } from '../promotions/add-promotion/add-promotion.component';
import { AssignPromotionComponent } from '../promotions/assign-promotion/assign-promotion.component';
import { AddComponent } from './add/add.component';
declare var $: any;
@Component({
  selector: 'app-pool-list',
  templateUrl: './pool-list.component.html',
  styleUrls: ['./pool-list.component.scss']
})
export class PoolListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }
  selectedTab: number;
  versions: any;
  selected;
  featureList: any;
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
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }


  ngOnInit(): void {
    this.getPoolData();
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      // console.log("this.features", this.features)
      this.current_url = 'pool';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission?.permissions;

      // console.log("this.feature_permission", this.feature_permission)
      this.selected = 'active';
      // if (this.feature_permission.includes('update') == false) {
      //   this.displayedColumns = ['promotion_name', 'promotion_type', 'promotion_status', 'promotion'];
      // }
    });
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.user_role = retrivedUser.role_id;
  }

  /** Get pool data */
  getPoolData() {
    this.spinner.show();
    this.commonService.getAllPoolList()
      .subscribe
      (
        result => {
          // Handle result
          if (result.message == 'Success') {
            this.featureList = result.data ? result.data : [];
            this.dataSource = new MatTableDataSource(result.data.features);
            this.spinner.hide();
            if (this.search == undefined || this.search == '') {
              this.selected = 'all';
            }
          } else {

          }
          this.spinner.hide();

        },
        error => {
          this.featureList = [];
          // console.log(error);
          this.spinner.hide();

        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );

  }

  openAddPoolComponent(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddComponent, {
      width: '1000px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getPoolData();
    });
  }

  /** Edit feature request */
  editFeature(data: any) {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddComponent, {
      width: '1000px',
      data: { featureData: data, action: 'Edit' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getPoolData();
    });
  }

  /** Delete Feature request  */
  deleteFeatureRequests(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this feature?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // console.log(confirmed)
        this.commonService.deleteFeature(data.id).subscribe(
          result => {
            // console.log(result)
            this.toastr.success(result.message, 'Success!', { progressBar: true });
            this.getPoolData();
          }, error => {
            // console.log(error);
            this.toastr.error(error.error.message, 'Error');
          },
          () => {
            // 'onCompleted' callback.
            // No errors, route to new page here
          }
        )
      }
    });
  }

  openEditPromotionDialog(id): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddComponent, {
      width: '1000px',
      data: { poolId: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getPoolData();
    });
  }


  confirmStatusChange(id, type) {
    // console.log(status);
    if (this.user_role == 1 || this.user_role == 2) {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: {
          message: 'Are you sure want to change status of this feature?',
          fromData: 'pool-reject',
          type: type,
          id,
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        }
      });


      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.getPoolData();
          const a = document.createElement('a');
          a.click();
          a.remove();
        } else {
          // console.log(confirmed);
        }
      });
    } else {
      this.toastr.error('You dont have permission to change status');

    }
  }

  changepoolStatus(id, status) {
    this.spinner.show();
    this.commonService.changepoolStatus(id, status).subscribe(res => {
      this.toastr.success(res.message);
      this.spinner.show();
      this.getPoolData();
    });
  }

  /** Save element data */
  saveFeatureData(data: any) {
    // console.log(data);
    this.commonService.featureData = data;

    this.commonService.updateCallEvent(this.commonService.featureData, 'data');
  }

  /** Filter     */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
