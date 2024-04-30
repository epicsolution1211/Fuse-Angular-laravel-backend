import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { DownloadService } from 'app/shared/services/download.service';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { AssignPromotionComponent } from './assign-promotion/assign-promotion.component';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  displayedColumns: string[] = ['promotion_name', 'promotion_type', 'promotion_status', 'start_date', 'end_date', 'promotion'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }
  isLoading: boolean;
  selectedTab: number;
  versions: any;
  selected;
  promotions: any;
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
  ) {

    this.commonService.getPromotions(this.paginate, this.page, this.search).subscribe(res => {
      this.promotions = res.data;
      this.dataSource = new MatTableDataSource(res.data.promotions);
      this.isLoading = false;
      if (this.search == undefined || this.search == '') {
        this.selected = 'all';
      }
    });
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      this.current_url = 'Promotion';
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission.permissions;
      this.selected = 'active';
      // if (this.feature_permission.includes('update') == false) {
      //   this.displayedColumns = ['promotion_name', 'promotion_type', 'promotion_status', 'promotion'];
      // }
    });

    this.isLoading = true;


  }

  openDeletePromotionDialog(promotion_id) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this promotion?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deletePromotion(promotion_id).subscribe(res => {
          this.toastr.success(res.message);
          this.isLoading = false;
          this._router.navigate(['/promotions/delete']);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  openPromotionComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddPromotionComponent, {
      width: '1000px',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openEditPromotionDialog(promotion_id): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddPromotionComponent, {
      width: '1000px',
      data: { promotion_id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openAssignPromotion(promotion_id): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AssignPromotionComponent, {
      width: '1000px',
      data: { promotion_id }
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
      this.promotions = res.data;
      this.dataSource = res.data.licences;
      this.isLoading = false;
    });
  }

  confirmStatusChange(promotion_id, status) {
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
        this.changePromotionStatus(promotion_id, status);
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  changePromotionStatus(promotion_id, status) {
    this.isLoading = true;
    this.commonService.changePromotionStatus(promotion_id, status).subscribe(res => {
      this.toastr.success(res.message);
      this.isLoading = false;
      // this.isLoading = true;
      this.commonService.getPromotions(this.paginate, this.page, this.search).subscribe(res => {
        this.promotions = res.data;
        this.dataSource = res.data.promotions;
        this.isLoading = false;
        if (this.search == undefined || this.search == '') {
          this.selected = 'all';
        }
      });
      // this._router.navigate(['/downloads/delete',{type:this.url}]);
    });
  }

}

export interface PeriodicElement {
  promotion_name: string;
  promotion_status: string;
  promotion_type: string;
}