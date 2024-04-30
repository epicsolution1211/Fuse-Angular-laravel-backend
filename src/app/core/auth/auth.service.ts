import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { ConstantsService } from 'app/shared/services/constants.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private constants: ConstantsService,
        private router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set user(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    get user(): any {
        const retrivedUser = localStorage.getItem('user');
        return JSON.parse(retrivedUser) ?? '';
    }

    set role(role) {
        localStorage.setItem('role', role);
    }

    get role(): string {
        return localStorage.getItem('role') ?? '';
    }

    set permissions(permissions) {
        localStorage.setItem('permissions', JSON.stringify(permissions));
    }

    get permissions(): string {
        const permissions = localStorage.getItem('permissions');
        return JSON.parse(permissions) ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.constants.LOGIN, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.data.token;
                this.user = response.data.user;
                this.role = response.data.user.user_role.role;
                this.permissions = response.data.user.user_role.permissions;
                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.data.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {

        // Renew token
        return this._httpClient.post(this.constants.REFREST_ACCESS_TOKEN, {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.data.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.data.user;
                this.user = response.data.user;
                this.role = response.data.user.Role;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        // Remove the user from the local storage
        localStorage.removeItem('user');
        // Remove the role from the local storage
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
        // localStorage.clear();

        // Set the authenticated flag to false
        this._authenticated = false;
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // console.log(this._authenticated,!this.accessToken,AuthUtils.isTokenExpired(this.accessToken));
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }
        // Check the access token availability
        if (!this.accessToken) {
            // this.router.navigate(['/sign-in']);
            return of(false);
        }
        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    loginWithFacebook(postData: object) {
        return this._httpClient.post<any>(this.constants.FACEBOOK_LOGIN, postData).pipe(
            map(data => {
                return data;
            })
        );
    }
}
