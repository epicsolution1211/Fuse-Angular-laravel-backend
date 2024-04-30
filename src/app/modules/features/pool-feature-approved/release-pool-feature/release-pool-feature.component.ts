import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoolFeatureVotersComponent } from './pool-feature-voters/pool-feature-voters.component';
import { MatDialog } from '@angular/material/dialog';
export interface PeriodicElement {
  title: string;
  description: string;
}

@Component({
  selector: 'app-release-pool-feature',
  templateUrl: './release-pool-feature.component.html',
  styleUrls: ['./release-pool-feature.component.scss']
})
export class ReleasePoolFeatureComponent implements OnInit {
  displayedColumns: string[] = ['select', 'title', 'description', 'votesCount'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }
  paginate = 10;
  page = 0;
  form: FormGroup;
  submitted: boolean;
  approvedPoolist: any = [];
  votedFeature: any;
  selectedRow: any = [];
  poolFeatureReleased: boolean = false;
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(
    public matDialogRef: MatDialogRef<ReleasePoolFeatureComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private _matDialog: MatDialog,
  ) {

  }

  get f() {
    return this.form.controls;
  }
  
  showVoters(el: any) {

    this._matDialog.open(PoolFeatureVotersComponent, {
      width: '500px',
      data: {
        data: {pool_id: this.data.data.id,...el}
      }
    })
  }

  ngOnInit(): void {

    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    const user_id = user.id;
    this.form = this._formBuilder.group({
      pool_id: [this.data.data.id],
      feature_id: [''],
      user_id: [user_id],
      vote: ['', [Validators.required]]
    });

    
    
    this.approvedPoolist = this.data.data.featureRequests;
    this.dataSource = new MatTableDataSource(this.approvedPoolist);

    /** get-votes-pool-features */
    this.getVotesPoolFeatures(this.data.data.id);

    this.data.data.featureRequests.map((data: any) => {
      this.data.data.poolFeatures.map((rs: any) => {
        if (data.id == rs.feature_id) {
          data.selected = rs.selected;
          this.poolFeatureReleased = true;
        }
      });
    });
  }

  /** get-votes-pool-features functions*/
  getVotesPoolFeatures(id: any) {
    this.spinner.show();
    this.commonService.getVotesPoolFeatures(id).subscribe
      (
        result => {
          // Handle result
          if (result.message == 'Success') {

            this.data.data.featureRequests.map((data: any) => {
              result.data.pool_features.map((rs: any) => {
                if (data.id == rs.feature_id) {
                  data.votesCount = rs.votesCount;
                }
              })
            })

          } else {

          }
          this.spinner.hide();
        },
        error => {
          // console.log(error);
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );
  }


  saveAndClose(): void {
    this.matDialogRef.close(true);
  }


  // number only function
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  // save the promotion
  save() {
    this.spinner.show();

    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    const user_id = user.id;

    const featureSelected: any = [];

    this.selection.selected.forEach((s: any) => featureSelected.push(s.id));

    if (featureSelected.length > 0) {

      const body: any = {
        "pool_id": this.data.data.id,
        "user_id": user_id,
        "feature_id": featureSelected
      }
      this.commonService.releasePoolFeature(body).subscribe
        (
          result => {
            // Handle result
            if (result.status == 'true') {
              this.toastr.success(result.message, 'Success!', { progressBar: true });
              this.matDialogRef.close();

            } else {

            }
            this.spinner.hide();
            this.matDialogRef.close();

          },
          error => {
            // console.log(error);
            this.spinner.hide();
            this.toastr.success(error.error.message, 'Success!', { progressBar: true });
            this.matDialogRef.close();
          },
          () => {
            this.spinner.hide();
            // 'onCompleted' callback.
            // No errors, route to new page here
          }
        );
      // Close the dialog

    } else {
      this.toastr.error('Please select feature', 'Error');
    }





  }

  radioSelected() {
    // console.log(this.selectedRow);
  }

  /** Filter     */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.approvedPoolist.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.selection.clear()
    this.approvedPoolist.forEach(row => this.selection.select(row));

    // console.log("this.selection", this.selection)
  }

  logSelection() {
    this.selection.selected.forEach((s: any) => console.log(s.name));
  }


}
