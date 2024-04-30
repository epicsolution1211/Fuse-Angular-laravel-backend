import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


export interface PeriodicElement {
  title: string;
  description: string;
}

@Component({
  selector: 'app-create-pool',
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss']
})
export class CreatePoolComponent implements OnInit {
  displayedColumns: string[] = ['select', 'title', 'description'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }

  form: FormGroup;
  submitted: boolean;
  approvedPoolist: any = [];
  selection = new SelectionModel<PeriodicElement>(true, []);
  paginate = 10;
  page = 0;
  constructor(
    public matDialogRef: MatDialogRef<CreatePoolComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
  ) {
    // console.log("data>>>>>>>>>>", data);
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      title: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      feature_ids: []
    });

    if (this.data?.actions == 'Edit') {
      this.form.patchValue({
        title: this.data?.poolData.title,
        duration: this.data?.poolData.duration
      });
    }

    this.approvedFeatuelist();
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

    if (this.data?.actions == 'Edit') {

      const body: any = {
        "id": this.data?.poolData.id,
        "title": this.form.value.title,
        "duration": this.form.value.duration
      }

      this.commonService.upadatePool(body).subscribe(
        result => {
          // console.log(result)
          this.submitted = false;
          this.toastr.success(result.message, 'Success!', { progressBar: true });
          this.matDialogRef.close();
        }, error => {
          this.toastr.error(error.error.message, 'Error');
          this.matDialogRef.close();
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      )

    } else {
      if (this.form.valid) {

        const featureSelected: any = [];

        this.selection.selected.forEach((s: any) => featureSelected.push(s.id));

        if (featureSelected.length > 0) {
          this.form.get('feature_ids').setValue(featureSelected);
          this.spinner.show();
          this.commonService.createPoolList(this.form.value)

            .subscribe
            (
              result => {
                // Handle result
                this.submitted = false;
                this.toastr.success(result.message, 'Success!', { progressBar: true });
                this.matDialogRef.close();
                this.spinner.hide();
              },
              error => {
                this.spinner.hide();
                this.toastr.error(error.error.message, 'Error');
              },
              () => {
                this.spinner.hide();
                // 'onCompleted' callback.
                // No errors, route to new page here
              }
            );
        } else {
          this.toastr.error('Please select feature', 'Error');
        }
      } else {

      }
    }


  }

  /** Get approved feature list */
  approvedFeatuelist() {
    this.spinner.show();
    this.commonService.approvedFeatuelist().subscribe
      (
        result => {
          // Handle result
          if (result.message == 'Success') {
            this.approvedPoolist = result.data.features ? result.data.features : [];
            this.dataSource = new MatTableDataSource(result.data.features);
            this.approvedPoolist = this.approvedPoolist.map((data: any) => {
              data.selected = false;
              return data;
            })
          } else {

          }
          // console.log(result)
          this.spinner.hide();
        },
        error => {
          // console.log(error);
          this.approvedPoolist = [];
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );
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

  /** Filter     */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
