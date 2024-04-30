import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { PasswordValidation } from '../passwordMatch/passwordmatch';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
    form: FormGroup;
    features: any;
    isLoading: boolean;
    submitted: boolean;
    userId: string;
    selectedProduct: any;
    roles: any;
    permissions: any = [];
    employee: any;
    languages: any;
    last_sign_in;
    loggedin_id: any;
    hide = true;
    hides = true;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AddEmployeeComponent>,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    get f() {
        return this.form.controls;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userId = this.data?.userId;

        this.commonService.getFeatures().subscribe(res => {
            this.features = res.data.features;
        });

        this.commonService.getroles().subscribe(res => {
            this.roles = res.data.roles;
        });
        this.commonService.getLanguages().subscribe(res => {
            this.languages = res.data.languages;
        });

        // Create the form
        this.form = this._formBuilder.group({
            username: ['', [Validators.required]],
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            password_confirmation: ['', [Validators.required]],
            verify_code: ['']
        }, {
            validator: PasswordValidation.MatchPassword
        });

        if (this.userId != null) {
            this.isLoading = true;
            this.commonService.getEmployeeById(this.userId).subscribe(res => {
                this.employee = res.data.employee;
                this.form = this._formBuilder.group({
                    username: [res.data.employee.username, [Validators.required]],
                    name: [res.data.employee.name, [Validators.required]],
                    email: [res.data.employee.email, [Validators.required, Validators.email]]
                });
                this.isLoading = false;
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */

    /**
     * Save and close
     */
    saveAndClose(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {

    }

    /**
     * Send the message
     */
    save(): void {
        if(!this.userId){
            this.form.controls.password_confirmation.markAsTouched();
            this.form.controls.password.markAsTouched();
            this.form.controls.email.markAsTouched();
            this.form.controls.name.markAsTouched();
        }
        this.submitted = true;
        if (this.form.valid) {
            const retrivedUser = localStorage.getItem('user');
            const user = JSON.parse(retrivedUser) ?? '';
            this.loggedin_id = user.id;
            const formData = new FormData();
            formData.append("loggedin_id", this.loggedin_id);
            formData.append("userId", this.userId);
            formData.append("name", this.form.get("name").value);
            formData.append("username", this.form.get("username").value);
            formData.append("email", this.form.get("email").value);
            if (!this.employee) {
                formData.append("password", this.form.get("password").value);
                formData.append("password_confirmation", this.form.get("password_confirmation").value);
            }
            this.isLoading = true;
            this.commonService.addUser(formData).subscribe(data => {
                this.submitted = false;
                this._router.navigate(['/employee/delete']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', { progressBar: true });
                this.matDialogRef.close();
            }, error => {
                this.isLoading = false;
                this._router.navigate(['/employee/delete']);
                this.toastr.error(error.error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }
}
