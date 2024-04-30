import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-voting-points-configutaions',
  templateUrl: './create-voting-points-configutaions.component.html',
  styleUrls: ['./create-voting-points-configutaions.component.scss']
})
export class CreateVotingPointsConfigutaionsComponent implements OnInit {

  form: FormGroup;
  options: any = [];
  loading: boolean = true;
  submitted: boolean = false;
  spinner1 = "spinner1";


  get f() {
    return this.form.controls;
  }

  constructor(
    public matDialogRef: MatDialogRef<CreateVotingPointsConfigutaionsComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    if (this.data?.id) {
      this.form = this._formBuilder.group({
        user_id: [{ id: this.data.user_id, username: this.data.username }, [Validators.required]],
        voting_points: [this.data.voting_points, [Validators.required, Validators.pattern("^[0-9]*$")]],
        per_month_purchase_vote: [this.data.per_month_purchase_vote, [Validators.required, Validators.pattern("^[0-9]*$")]],
        vote_purchase_price: [this.data.vote_purchase_price, [Validators.required, Validators.pattern("^[0-9]*$")]],
      });

      this.commonService.getCustomersList(this.data.username).subscribe(res => {
        this.options = res.data.customers
        this.loading = false
      })
    } else {
      this.form = this._formBuilder.group({
        user_id: ['', [Validators.required]],
        voting_points: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        per_month_purchase_vote: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        vote_purchase_price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      });
      this.commonService.getCustomersList().subscribe(res => {
        this.options = res.data.customers
        this.loading = false
      })
    }

    this.form.get('user_id')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.loading = true),
        switchMap(value => this.commonService.getCustomersList(value)
          .pipe(
            finalize(() => this.loading = false),
          )
        )

      ).subscribe(res => this.options = res.data.customers)


  }

  saveAndClose() {
    this.matDialogRef.close();
  }

  matdisplayFN(option: any) {
    return option && option.username ? option.username : ''
  }

  handleSubmit() {

    this.submitted = true;

    if (this.form.valid) {
      const formData = new FormData();
      if (this.data?.id) {
        formData.append('id', this.data.id);
        formData.append('purchase_status', this.data.purchase_status);
        formData.append('status', this.data.status);
      } else {
        formData.append('purchase_status', '1');
        formData.append('status', '1');
      }
      formData.append('user_id', this.form.get('user_id').value.id);
      formData.append('voting_points', this.form.get('voting_points').value);
      formData.append('per_month_purchase_vote', this.form.get('per_month_purchase_vote').value);
      formData.append('vote_purchase_price', this.form.get('vote_purchase_price').value);
      this.spinner.show("spinner1");
      if (this.data?.id) {
        this.commonService.updateVote(formData).subscribe(
          res => {
            this.submitted = false;
            window.location.reload();
            this.spinner.hide("spinner1");
            this.toastr.success(res.message, "Success!", { progressBar: true });
            this.matDialogRef.close();
          },
          (error) => {
            this.spinner.hide("spinner1");
            this.toastr.error(error.error.message, "Error");
          }
        )
      } else {
        this.commonService.createVote(formData).subscribe(
          res => {
            this.submitted = false;
            window.location.reload();
            this.spinner.hide("spinner1");
            this.toastr.success(res.message, "Success!", { progressBar: true });
            this.matDialogRef.close();
          },
          (error) => {
            this.spinner.hide("spinner1");
            this.toastr.error(error.error.message, "Error");
          }
        )
      }
    }
  }

}
