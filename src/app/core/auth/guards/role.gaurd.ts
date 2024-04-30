import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/shared/services/common.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivateChild {
  permissions: any = [];
  features: any;
  feature_permission: any;
  current_url: any;
  role_id: any;
  check: any;
  redirectURL;
  url;

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
  ) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const permissions = localStorage.getItem('permissions');
    const permission_arr = JSON.parse(permissions);
    permission_arr.map(permission => {
      this.permissions.push(permission.feature.name);
    });
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.current_url = parts[1];
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.role_id = user.role_id;

    this.commonService.getRolePermissionsByUser(this.role_id).subscribe(res => {
      this.check = res.data.feature.includes(this.current_url);
      if (this.current_url == "employees") {
        this.commonService.getRolePermissionsByUser(this.role_id).subscribe(res => {
          // console.log('res',res);
          this.check = res.data.feature.includes(this.current_url);
          if (!this.check) {
            this.toastr.error("You Don't have rights to access this page.", 'OK');
            this.router.navigate(['/dashboard']);
          }
        });
      }
    });
    return true;
  }

  /*canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.user;
    const role = user.role;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    const permissions = localStorage.getItem('permissions');
    const permission_arr = JSON.parse(permissions);

    permission_arr.map(permission => {
      this.permissions.push(permission.feature.name);
    });

    if(parts[1].includes('-')){
      const url = parts[1].split('-');
      this.url = url[1];
    }
    if(parts[1].includes('redirectURL')){
        this.redirectURL = this.activatedRoute.snapshot.params['redirectURL'];
        if( this.permissions.includes(this.redirectURL) || this.permissions.includes(parts[1]) || parts[1] == 'sign-in' || parts[1] == ''){
          return true;
        }else{
          this.toastr.error("You Don't have rights to access this page.", 'OK');
          this.router.navigate(['/dashboard']);
        }
    }

    if( this.permissions.includes(this.redirectURL) || this.permissions.includes(parts[1]) || this.permissions.includes(this.url) ||parts[1] == 'sign-in' || parts[1] == ''){
      return true;
    }else{
      this.toastr.error("You Don't have rights to access this page.", 'OK');
      this.router.navigate(['/dashboard']);
    }
    return true;

  }*/
}
