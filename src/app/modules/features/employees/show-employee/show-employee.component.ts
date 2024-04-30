import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-show-employee',
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.scss']
})
export class ShowEmployeeComponent implements OnInit {
  form: FormGroup;
  features: any;
  isLoading: boolean;
  submitted: boolean = false;
  userId: string;
  selectedProduct: any;
  roles: any;
  permissions: any = [];
  user: any;
  languages: any;
  last_sign_in;
  role_id;
  displayedColumns: string[] = ['licence_key', 'maintenance_expire', 'server_keepalive', 'buy_date', 'activationDate', 'server_address'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    this.commonService.getroles().subscribe(res => {
      this.roles = res.data.roles;
    });
    this.commonService.getLanguages().subscribe(res => {
      this.languages = res.data.languages;
    });
    this.isLoading = true;
    this.commonService.getUserById(this.userId).subscribe(res => {

      // console.log("res>>>>>", res);

      this.role_id = res.data.user.role_id;
      this.user = res.data.user;
      this.dataSource = this.user.licences;
      this.form = this._formBuilder.group({
        username: [res.data.user.username],
        name: [res.data.user.name],
        displayname: [res.data.user.display_name],
        email: [res.data.user.email, [Validators.required]],
        title: [res.data.user.title],
        last_sign_in: [res.data.user.lastvisitDate],
        registered_since: [res.data.user.registerDate],
        locale: [res.data.user.locale],
        role: [res.data.user.role_id],
        discord: [res.data.user.discord?.name]
      });
      // console.log(this.user);
      this.isLoading = false;
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to delete this user?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deleteUser(this.userId).subscribe(res => {
          this.toastr.success(res.message, 'OK');
          this.isLoading = false;
          this._router.navigate(['/users/delete']);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  edit() {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddEmployeeComponent, {
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

}

export interface PeriodicElement {
  licence_key: string;
  maintenance_expire: string;
  server_keepalive: string;
  buy_date: string;
  activationDate: string;
  server_address: string;
}