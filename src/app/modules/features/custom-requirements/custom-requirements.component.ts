import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateRequirementComponent } from './create-requirement/create-requirement.component';
import { MakeOfferComponent } from './make-offer/make-offer.component';
import { ShowOfferComponent } from './show-offer/show-offer.component';

@Component({
  selector: 'app-custom-requirements',
  templateUrl: './custom-requirements.component.html',
  styleUrls: ['./custom-requirements.component.scss']
})
export class CustomRequirementsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'budget', 'username', 'deadline', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }

  selected: any;
  requirementsList: any;
  paginate = 10;
  page = 0;
  userRole: any;
  search = '';
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCustomRequirements();
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.userRole = retrivedUser.role_id;
  }

  getCustomRequirements() {
    this.spinner.show();
    this.commonService.getCustomRequirements().subscribe(
      result => {
        // Handle result
        if (result.message == 'Success') {
          result.data.custom_requirements = result.data.custom_requirements.map((data: any) => {
            return data;
          })
          this.requirementsList = result.data ? result.data : [];

          // console.log("result.data.custom_requirements", result.data.custom_requirements);
          this.dataSource = new MatTableDataSource(result.data.custom_requirements);
          if (this.search == undefined || this.search == '') {
            this.selected = 'all';
          }
        } else {

        }
        this.spinner.hide();
      },
      error => {
        this.requirementsList = [];
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    )
  }

  
  /** Create pool */
  createRequirement() {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateRequirementComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getCustomRequirements();
    });
  }

  /** Filter     */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  /** Edit pool */
  editReq(data: any) {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateRequirementComponent, {
      width: '500px',
      data: { poolData: data, actions: 'Edit' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getCustomRequirements();
    });
  }

  makeOffer(id:any){
    const dialogRef = this._matDialog.open(MakeOfferComponent, {
      width: '500px',
      data: { custom_requirement_id: id}
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getCustomRequirements();
    });
  }

  showOffer(id:any){
    const dialogRef = this._matDialog.open(ShowOfferComponent, {
      width: '500px',
      minHeight: '300px',
      data: { custom_requirement_id: id}
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
      this.getCustomRequirements();
    });
  }

}
