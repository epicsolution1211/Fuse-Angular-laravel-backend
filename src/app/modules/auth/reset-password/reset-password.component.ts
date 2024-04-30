import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    token;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private router: Router,
        public route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                email          : ['', Validators.required],
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );

        this.route.queryParams.subscribe((params) => {
            this.token = params.token;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;


            const formData = new FormData();
            formData.append("email",this.resetPasswordForm.get("email").value);
            formData.append("password",this.resetPasswordForm.get("password").value);
            formData.append("password_confirmation",this.resetPasswordForm.get("passwordConfirm").value);
            formData.append("passwordToken",this.token);

            this.commonService.changePassword(formData).subscribe(data => {
              this.resetPasswordForm.reset();
              this.router.navigate(['/sign-in']);
              this.toastr.success(data.message, 'Success!', {progressBar: true});
            }, error => {
              this.toastr.error(error, 'Error');
            });

        // Send the request to the server
        // this._authService.resetPassword(this.resetPasswordForm.get('password').value)
        //     .pipe(
        //         finalize(() => {

        //             // Re-enable the form
        //             this.resetPasswordForm.enable();

        //             // Reset the form
        //             this.resetPasswordNgForm.resetForm();

        //             // Show the alert
        //             this.showAlert = true;
        //         })
        //     )
        //     .subscribe(
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'success',
        //                 message: 'Your password has been reset.'
        //             };
        //         },
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Something went wrong, please try again.'
        //             };
        //         }
        //     );
    }
}
