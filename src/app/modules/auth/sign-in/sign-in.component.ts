import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ConstantsService } from 'app/shared/services/constants.service';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    userRole: any;
    defaultUrl:any;
    user: SocialUser;
    loggedIn: boolean;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private constants: ConstantsService,
        private toastr: ToastrService,
        private authService: SocialAuthService
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
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {
                    const user = this._authService.user;
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    // console.log(this._activatedRoute.snapshot.queryParamMap.get('redirectURL'));
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
                    // console.log(redirectURL);
                    // Navigate to the redirect url
                    this.toastr.success('Login Successfully', 'Success!', {progressBar: true});
                    this.showAlert = true;
                    this._router.navigateByUrl(redirectURL);
                },
                (response) => {
                    const message = response.error.message;
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message
                    };

                    // Show the alert
                    this.showAlert = true;
                }
        );
    }

    submitLogin(){
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
            if(this.loggedIn == true){
                const formData = new FormData();
                formData.append("email",this.user.email);

                this._authService.loginWithFacebook(formData).subscribe(res => {
                    // Navigate to the redirect url
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
                    this._router.navigate(['dashboard']);
                    const permissions = res.data.user.user_role.permissions;
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    localStorage.setItem('accessToken', res.data.token);
                    localStorage.setItem('permissions',JSON.stringify(permissions));
                    this.toastr.success('Login Successfully', 'Success!', {progressBar: true});
                    this.showAlert = true;
                    this._router.navigateByUrl(redirectURL);
                }, error => {
                     // Set the alert
                     this.alert = {
                        type   : 'error',
                        message: error.error.message
                    };

                    // Show the alert
                    this.showAlert = true;
                });
            }
            // console.log(this.user,this.loggedIn);
        });
    }
}
