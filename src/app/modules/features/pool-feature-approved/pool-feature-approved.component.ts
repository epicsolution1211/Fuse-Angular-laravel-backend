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
import { AddComponent } from '../pool-list/add/add.component';
import { CreatePoolComponent } from './create-pool/create-pool.component';
import { ReleasePoolFeatureComponent } from './release-pool-feature/release-pool-feature.component';
import { VotePoolComponent } from './vote-pool/vote-pool.component';

@Component({
  selector: 'app-pool-feature-approved',
  templateUrl: './pool-feature-approved.component.html',
  styleUrls: ['./pool-feature-approved.component.scss']
})
export class PoolFeatureApprovedComponent implements OnInit {

  displayedColumns: string[] = ['title', 'duration', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }

  selectedTab: number;
  versions: any;
  selected;
  pooList: any;
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
  userRole: any;
  userVotingPoints: number = 0;

  constructor(
    private commonService: CommonService,
    private downloadService: DownloadService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }


  ngOnInit(): void {
    this.getApprovedPoolList();
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      this.current_url = 'Promotion';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission.permissions;
      this.selected = 'active';
    });
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.userRole = retrivedUser.role_id;
    if (this.userRole === 3) {
      this.commonService.userVotes(retrivedUser.id).subscribe(res => this.userVotingPoints = res.data.voting_points_configuration.voting_points);
    }

    // if (this.userRole == 1 || this.userRole == 2) {
    //   this.displayedColumns = ['title', 'duration', 'votes', 'status', 'action'];
    // } else {
    //   this.displayedColumns = ['title', 'duration', 'status', 'action'];
    // }
  }

  /** Get pool data */
  getApprovedPoolList() {
    this.spinner.show();
    this.commonService.getApprovedPoolList().subscribe
      (
        result => {
          // Handle result
          if (result.message == 'Success') {
            result.data.pools = result.data.pools.map((data: any) => {
              return data;
            })
            this.pooList = result.data ? result.data : [];

            // console.log("result.data.pools", result.data.pools);
            this.dataSource = new MatTableDataSource(result.data.pools);
            if (this.search == undefined || this.search == '') {
              this.selected = 'all';
            }
          } else {

          }
          this.spinner.hide();
        },
        error => {
          // console.log(error);
          this.pooList = [];
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );
  }


  /** Save element data */
  saveFeatureData(data: any) {
    // console.log(data);
    this.commonService.featureData = data;

    this.commonService.updateCallEvent(this.commonService.featureData, 'approvedList');
  }

  /** Create pool */
  createPool() {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreatePoolComponent, {
      width: '1000px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getApprovedPoolList();
    });
  }

  /** Vote Pool  */
  votePool(data: any) {
    let datas: any = {
      data: data
    }
    this._router.navigateByUrl(`${'feature_pool/show/' + data.id}`);
    this.commonService.setPoolFeatureData(datas);
    // Open the dialog
    const dialogRef = this._matDialog.open(VotePoolComponent, {
      width: '1000px',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getApprovedPoolList();
    });
  }


  startPool(data: any) {
    // console.log(data);
    if (this.userRole == 1 || this.userRole == 2) {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: {
          message: 'Are you sure want to start this pool?',
          fromData: 'pool-list',
          data,
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        }
      });


      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.getApprovedPoolList();
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


  releasePoolFeature(data: any) {
    // Open the dialog
    const dialogRef = this._matDialog.open(ReleasePoolFeatureComponent, {
      width: '1000px',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getApprovedPoolList();
    });
  }

  /** Pool status change */
  confirmStatusChange(id) {
    if (this.userRole == 1 || this.userRole == 2) {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: {
          message: 'Are you sure you want to activate this pool?',
          fromData: 'pool-status',
          id,
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        }
      });


      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();
          this.getApprovedPoolList();
        } else {
          // console.log(confirmed);
        }
      });
    } else {
      this.toastr.error('You dont have permission to change status');

    }
  }

  /** Filter     */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  /** Delete Feature request  */
  deletePool(data: any) {
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
        this.commonService.deletePool(data.id).subscribe(
          result => {
            // console.log(result)
            this.toastr.success(result.message, 'Success!', { progressBar: true });
            this.getApprovedPoolList();
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

  /** Edit pool */
  editPool(data: any) {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreatePoolComponent, {
      width: '500px',
      data: { poolData: data, actions: 'Edit' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getApprovedPoolList();
    });
  }


}

