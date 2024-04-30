import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.scss']
})
export class CreateRequirementComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;

  constructor(
    public matDialogRef: MatDialogRef<CreateRequirementComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.form = this._formBuilder.group({
      title: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      deadline: ['', Validators.required],
      description: ['', Validators.required],
      user_id: [retrivedUser.role_id === 3 ? retrivedUser.id : ""]
    });


    if (this.data?.actions == 'Edit') {
      this.form.patchValue({
        title: this.data?.poolData.title,
        budget: this.data?.poolData.budget,
        deadline: new Date(this.data?.poolData.deadline),
        description: this.data?.poolData.description,
        user_id: this.data?.poolData.user_id
      });
    }
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }


  save() {
    // console.log("this.form", this.form.value);
    this.submitted = true;

    if (this.data?.actions == 'Edit') {

      const body: any = {
        "id": this.data?.poolData.id,
        "title": this.form.value.title,
        "budget": this.form.value.budget,
        "deadline": this.form.value.deadline,
        "description": this.form.value.description,
        "user_id": this.form.value.user_id
      }
      this.spinner.show();
      this.commonService.updateCustomRequirement(body).subscribe(
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
      )
    } else {

      if (this.form.valid) {
        this.spinner.show();
        this.commonService.createCustomRequirement(this.form.value).subscribe(

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
        )
      }

    }
  }


}
