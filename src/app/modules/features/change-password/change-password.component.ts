import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordValidation } from '../employees/passwordMatch/passwordmatch';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean;
  submitted: boolean = false;
  userId:string;
  selectedProduct: any;
  roles: any;
  loggedin_id:any;

  get f() { return this.form.controls; }

  constructor(
    public matDialogRef: MatDialogRef<ChangePasswordComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userId = this.data?.userId;
    this.form = this._formBuilder.group({
      password : ['', [Validators.required,Validators.minLength(6)]],
      confirm_password: ['', [Validators.required,Validators.minLength(6)]],
      }, {
            validator: PasswordValidation.MatchConfirmPassword
    });
  }

  saveAndClose(): void
    {
        // Save the message as a draft

        // Close the dialog
        this.matDialogRef.close();
    }

    save(): void
    {
        this.submitted = true;
        if(this.form.valid){
            const retrivedUser = localStorage.getItem('user');
            const user = JSON.parse(retrivedUser) ?? '';
            this.loggedin_id = user.id;
            const formData = new FormData();
            formData.append("loggedin_id",this.loggedin_id);
            formData.append("userId",this.userId);
            formData.append("password",this.form.get("password").value);
            formData.append("confirm_password",this.form.get("confirm_password").value);
            this.isLoading = false;
            this.commonService.updatePassword(formData).subscribe(data => {
                this.submitted = false;
                this._router.navigate([this.data.back]);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', {progressBar: true});
                this.matDialogRef.close();
              }, error => {
                // console.log(error);
                this.isLoading = false;
                this._router.navigate([this.data.back]);
                this.toastr.error(error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }

}
