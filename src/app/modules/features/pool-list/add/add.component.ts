import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  promotion: any;
  products: any;
  planName: any;
  url: string;
  selected;
  clicked = false;
  id: any;



  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
  ) {
    // console.log("data", data);
    if (this.data?.featureData?.id) {
      this.id = this.data?.featureData.id;

      // console.log("this.id?>>>>>>>", this.id)

    }

  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.url = parts.pop();

    // promotion
    this.form = this._formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      id: [''],
    });


    // //
    // if (this.id != undefined) {
    //   this.commonService.getFeaturePoolData(this.id).subscribe(res => {
    //     if (res.message == 'Success') {
    //       this.form = this._formBuilder.group({
    //         title: [res.data?.feature?.title, [Validators.required]],
    //         description: [res.data?.feature?.description, [Validators.required]],
    //         id: [res.data?.feature?.id]
    //       });
    //     }
    //   });
    // }

    if (this.data?.action == 'Edit') {
      this.form = this._formBuilder.group({
        title: [this.data?.featureData.title, [Validators.required]],
        description: [this.data?.featureData.description, [Validators.required]],
        id: [this.data?.featureData.id]
      });

      // this.commonService.getEditFeatureData(this.data.featureData.id).subscribe(
      //   result => {
      //     // console.log(result)
      //   }, error => {
      //     // console.log(error);

      //   },
      //   () => {
      //     // 'onCompleted' callback.
      //     // No errors, route to new page here
      //   }
      // )
    }
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }




  // save the promotion
  save() {
    // console.log("this.form", this.form.value);
    this.submitted = true;
    if (this.form.valid) {
      this.clicked = true;
      this.isLoading = true;
      if (this.data?.action == 'Edit') {

        const body: any = {
          "id": this.form.value.id,
          "title": this.form.value.title,
          "description": this.form.value.description
        }

        this.commonService.updatePoolFeature(body).subscribe(
          result => {
            // console.log(result)
            this.submitted = false;
            this.isLoading = false;
            this.toastr.success(result.message, 'Success!', { progressBar: true });
            this.matDialogRef.close();
          }, error => {
            this.isLoading = false;
            this.toastr.error(error.error.message, 'Error');
            this.matDialogRef.close();
          },
          () => {
            // 'onCompleted' callback.
            // No errors, route to new page here
          }
        )
      } else {


        // console.log(this.form.value);
        // add data in formData
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        const user_id = user.id;
        const formData = new FormData();
        formData.append("feature_id", this.form.value.id ? this.form.value.id : '');
        formData.append("title", this.form.value.title);
        formData.append("description", this.form.value.description);
        formData.append("admin_id", '1');
        formData.append("users_id", user_id);
        formData.append("status", '0');

        this.commonService.addPoolRequest(formData).subscribe(data => {
          this.submitted = false;
          this.isLoading = false;
          this.toastr.success(data.message, 'Success!', { progressBar: true });
          this.matDialogRef.close();
        }, error => {
          this.isLoading = false;
          this.toastr.error(error.error.message, 'Error');
        });
      }
    }

  }

}
