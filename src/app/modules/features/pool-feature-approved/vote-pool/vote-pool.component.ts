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
import { CreatePoolComponent } from '../create-pool/create-pool.component';

@Component({
  selector: 'app-vote-pool',
  templateUrl: './vote-pool.component.html',
  styleUrls: ['./vote-pool.component.scss']
})
export class VotePoolComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'votesCount', 'actions',];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }
  paginate = 10;
  page = 0;
  form: FormGroup;
  submitted: boolean;
  approvedPoolist: any = [];
  votedFeature: any;
  currentRole: any;

  constructor(
    public matDialogRef: MatDialogRef<VotePoolComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
  ) {

    // console.log(this.data)
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    const user_id = user.id;

    this.currentRole = user.role_id;
    // console.log(this.currentRole)

    if (this.currentRole == 1 || this.currentRole == 2) {
      this.displayedColumns = ['title', 'description', 'votesCount'];
    } else {
      this.displayedColumns = ['title', 'description', 'votesCount', 'actions'];
    }

    this.form = this._formBuilder.group({
      pool_id: [this.data.data.id],
      feature_id: [''],
      user_id: [user_id],
      vote: ['', [Validators.required]]
    });

    this.approvedPoolist = this.data.data.featureRequests;
    this.dataSource = new MatTableDataSource(this.approvedPoolist);

    /** get-votes-pool-features */
    this.getVotesPoolFeatures(this.data.data.id)


    this.data.data.featureRequests.map((data: any) => {
      this.data.data.poolFeatures.map((rs: any) => {
        if (data.id == rs.feature_id) {
          data.selected = rs.selected;
        }
      });
    });
  }

  /** get-votes-pool-features functions*/
  getVotesPoolFeatures(id: any) {
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
              });
            });
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
    // Close the dialog
    this.matDialogRef.close();
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
    // console.log("this.form", this.form.value);
    this.submitted = true;

    // if (this.form.valid) {
    //   // console.log(this.form.value);
    //   // add data in formData
    //   const formData = new FormData();
    //   formData.append("pool_id", this.form.get('pool_id').value);
    //   formData.append("user_id", this.form.get('user_id').value);
    //   formData.append("feature_id", this.form.get('feature_id').value);
    //   formData.append("vote", this.form.get('vote').value);
    //   this.commonService.votePool(formData).subscribe(result => {
    //     // Handle result
    //     if (result.status == 'true') {
    //       this.toastr.success(result.message);
    //     } else {

    //     }
    //     this.matDialogRef.close(true);

    //   },
    //     error => {
    //       // console.log(error);
    //       this.toastr.error(error.error.message);
    //       this.matDialogRef.close(true);
    //     },
    //     () => {
    //       // 'onCompleted' callback.
    //       // No errors, route to new page here
    //     });
    // }

    this.matDialogRef.close(true);

  }

  /** Pool vote */
  poolVote(data: any, type: any) {
    // console.log(data);
    this.votedFeature = data.id;
    this.form.get('vote').setValue(1);
    this.form.get('feature_id').setValue(data.id);

    if (this.form.valid) {
      this.spinner.show();
      // console.log(this.form.value);
      // add data in formData
      const formData = new FormData();
      formData.append("pool_id", this.form.get('pool_id').value);
      formData.append("user_id", this.form.get('user_id').value);
      formData.append("feature_id", this.form.get('feature_id').value);
      formData.append("vote", this.form.get('vote').value);
      this.commonService.votePool(formData).subscribe(result => {
        // Handle result
        if (result.status == 'true') {
          this.toastr.success(result.message);
          this.spinner.hide();
        } else {

        }
        this.spinner.hide();
      },
        error => {
          // console.log(error);
          this.toastr.error(error.error.message);
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          // 'onCompleted' callback.
          // No errors, route to new page here
        });
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

}
