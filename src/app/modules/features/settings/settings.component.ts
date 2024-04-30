import { Component, Inject, OnInit, Optional, ViewChild, ComponentFactoryResolver, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean;
  submitted: boolean = false;
  selectLocale:any;
  selectedLocale:any;
  userId:string;
  user:any;
  roles: any;
  loggedin_id:any;
  languages: any;
  errorMsg:any;

  get f() { return this.form.controls; }

  constructor(
    public matDialogRef: MatDialogRef<SettingsComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.userId = data;
    this.user = data;
  }

  ngOnInit(): void {
    this.errorMsg = true;
    this.form = this._formBuilder.group({
        email: [this.user.user.email,[Validators.required]],
        display_name: [this.user.user.display_name,[Validators.required]],
        locale: ['',[Validators.required]],
        password : ['', [Validators.minLength(6)]],
        confirm_password: ['', [Validators.minLength(6)]],
        current_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password'),
    });
    this.commonService.getLanguages().subscribe(res => {
      if(res){
        this.languages = res.data.languages;
        const lan = this.languages.find(d => {
          if(d.language == this.user.user.locale) {
            return d;
          }
        });
        this.form = this._formBuilder.group({
            email: [this.user.user.email,[Validators.required]],
            display_name: [this.user.user.display_name,[Validators.required]],
            locale: [lan.id ? lan.id : '',[Validators.required]],
            password : ['', [Validators.minLength(6)]],
            confirm_password: ['', [Validators.minLength(6)]],
            current_password: ['', [Validators.required]]
        }, {
          validator: ConfirmedValidator('password', 'confirm_password')
        });
      }
    });

  }

  checkPassword(password): void{
    const formData = new FormData();
    formData.append("userId",this.user.user.id);
    formData.append("password",password);
    this.commonService.checkPassword(formData).subscribe(data => {
      this.errorMsg = !data.status;
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
            const lan = this.languages.find(d => {
              if(d.id == this.form.value.locale) {
                return d;
              }
            });
            const retrivedUser = localStorage.getItem('user');
            const user = JSON.parse(retrivedUser) ?? '';
            this.loggedin_id = user.id;
            const formData = new FormData();
            formData.append("loggedin_id",this.loggedin_id);
            formData.append("userId",this.user.user.id);
            formData.append("password",this.form.get("password").value);
            formData.append("confirm_password",this.form.get("confirm_password").value);
            formData.append("locale",lan.language);
            this.isLoading = false;
            this.commonService.updatePassword(formData).subscribe(data => {
                this.submitted = false;
                this._router.navigate(['/dashboard']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', {progressBar: true});
                this.matDialogRef.close();
              }, error => {
                // console.log(error);
                this.isLoading = false;
                this._router.navigate(['/dashboard']);
                this.toastr.error(error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }

}
export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}