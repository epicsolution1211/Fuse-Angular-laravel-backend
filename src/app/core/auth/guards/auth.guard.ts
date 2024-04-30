import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'app/shared/services/common.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    permissions: any = [];
    redirectURL;
    url;
    features: any;
    feature_permission: any;
    current_url: any;
    role_id: any;
    check: any;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private commonService: CommonService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const user = this._authService.user;
        const role = user.role;
        const hash = window.location.pathname;
        const parts = hash.split('/');
        const permissions = localStorage.getItem('permissions');
        const permission_arr = JSON.parse(permissions);
        this.current_url = parts[1];
        /*permissions.map(permission => {
          this.permissions.push(permission.feature.name);
        });*/
        /*permission_arr.forEach(permission => {
            this.permissions.push(permission.feature.name);
        });*/
        // console.log("this.permissions",this.permissions);

        this.permissions.push(permission_arr);
        const retrivedUser = localStorage.getItem('user');
        this.role_id = user.role_id;
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.redirectURL && params.redirectURL != null && params.redirectURL != '') {
                const permissionCheck = this.permissions.includes(params.redirectURL.replace("/", ""));
                if (permissionCheck == false) {
                    this.toastr.error("You Don't have rights to access this page.", 'OK');
                    window.location.reload();
                }
            } else {
                if (this.current_url == "employees" || this.current_url == "customers" || this.current_url == "downloads" || this.current_url == "licence") {
                    this.commonService.getRolePermissionsByUser(this.role_id).subscribe(res => {
                        if (this.current_url == "licence") {
                            this.current_url = "Licences Management";
                        }
                        this.check = res.data.feature.includes(this.current_url);
                        if (!this.check) {
                            this.toastr.error("You Don't have rights to access this page.", 'OK');
                            this._router.navigate(['/dashboard']);
                        }
                    });
                }
            }
        });
        const redirectUrl = state.url === '/sign-out' ? '/dashboard' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/dashboard' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {
                    // console.log(authenticated);
                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page
                        this._router.navigate(['sign-in'], { queryParams: { redirectURL } });
                        // Prevent the access
                        return of(false);
                    }

                    // Allow the access
                    return of(true);
                })
            );
    }
}
