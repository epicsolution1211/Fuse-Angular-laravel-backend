import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrls: ['./show-customer.component.scss']
})
export class ShowCustomerComponent implements OnInit {
  form: FormGroup;
  features: any;
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
  dataSourceLength: any;

  constructor(
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userId = this.route.snapshot.params.id;
    this.commonService.getroles().subscribe(res => {
      this.roles = res.data.roles;

      // console.log(this.roles);
    });
    this.commonService.getLanguages().subscribe(res => {
      this.languages = res.data.languages;
      // console.log(this.languages);
    });

    this.form = this._formBuilder.group({
      username: [''],
      name: [''],
      displayname: [''],
      email: ['', [Validators.required]],
      title: [''],
      last_sign_in: [''],
      registered_since: [''],
      locale: [''],
      role: [''],
      discord: ['', [Validators.required]],
    });

    this.commonService.getUserById(this.userId).subscribe(res => {
      this.role_id = res.data.user.role_id;
      this.user = res.data.user;
      this.dataSource = this.user.licences;
      this.dataSourceLength = this.user.licences.length;

      // console.log("this.user", this.user);

      this.form.patchValue({
        username: [this.user.username],
        name: [this.user.name],
        displayname: [this.user.display_name],
        email: [this.user.email],
        title: [this.user.title],
        last_sign_in: [this.user.lastvisitDate],
        registered_since: [this.user.registerDate],
        locale: [this.user.locale],
        role: [this.user.role_id],
        discord: [this.user.discord],
      });
      this.form.controls.role.setValue(this.user.role_id);
      this.form.controls.locale.setValue(this.user.locale);

    });
    this.spinner.hide();
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
    const dialogRef = this._matDialog.open(AddCustomerComponent, {
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  get f() {
    return this.form.controls;
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