import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/shared/services/common.service';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private commonService : CommonService
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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // console.log(this.forgotPasswordForm.valid);
        // Disable the form
        if(this.forgotPasswordForm.valid){
            this.forgotPasswordForm.disable();
        }

        // Hide the alert
        this.showAlert = false;

          const formData = new FormData();
          formData.append("email",this.forgotPasswordForm.get("email").value);

          this.commonService.forgetPassword(formData).subscribe(data => {
              const message = data.message;
              this.forgotPasswordForm.enable();

            // Reset the form
            this.forgotPasswordNgForm.resetForm();

            // Show the alert
            this.showAlert = true;
              // Set the alert
              this.alert = {
                type   : 'success',
                message
            };
          }, error => {
            this.alert = {
                type   : 'error',
                message: error
            };
          });

        // Forgot password
        // this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
        //     .pipe(
        //         finalize(() => {

        //             // Re-enable the form
        //             this.forgotPasswordForm.enable();

        //             // Reset the form
        //             this.forgotPasswordNgForm.resetForm();

        //             // Show the alert
        //             this.showAlert = true;
        //         })
        //     )
        //     .subscribe(
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'success',
        //                 message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
        //             };
        //         },
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Email does not found! Are you sure you are already a member?'
        //             };
        //         }
        //     );
    }
}
