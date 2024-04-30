import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-make-offer',
  templateUrl: './make-offer.component.html',
  styleUrls: ['./make-offer.component.scss']
})
export class MakeOfferComponent implements OnInit {


  form: FormGroup;
  submitted: boolean;

  constructor(
    public matDialogRef: MatDialogRef<MakeOfferComponent>,
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
    this.form = this._formBuilder.group({
      amount: ['', [Validators.required]],
      deadline: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.form.patchValue({
      custom_requirement_id: this.data?.custom_requirement_id
    });
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  save () {

    this.submitted = true;
    const body: any = {
      "custom_requirement_id": this.data?.custom_requirement_id,
      "amount": this.form.value.amount,
      "deadline": this.form.value.deadline,
      "description": this.form.value.description,
    }
    this.spinner.show();
    this.commonService.makeOffer(body).subscribe(
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
