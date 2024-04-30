import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ChangeEmployeePasswordComponent } from './change-password/change-password.component';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EmployeeLicencesComponent } from './employee-licences/employee-licences.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['username', 'owner_name', 'registered_since', 'status', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  isLoading = false;
  paginate = 100;
  page = 0;
  licences: any = [];
  filter: FormControl = new FormControl();
  filter1: FormControl = new FormControl();
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  employees: any;
  features: any;
  feature_permission: any;
  current_url: any;
  selected;
  status: any;
  selectedType = 'all';
  selectedStatus = 2;
  searchValue = '';
  role_id;

  /**
   * Constructor
   */
  constructor(
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // console.log(this.route.queryParams);
    // console.log(this.filter.value());
    const retrivedUser = localStorage.getItem('user');
    const user = JSON.parse(retrivedUser) ?? '';
    this.role_id = user.role_id;
    this.selected = 'all';
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.current_url = parts[1];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.isLoading = true;
    this.commonService.getFeatures().subscribe(res => {
      this.features = res.data.features;
      const feature_id = this.features.find(feature => feature.name == this.current_url);
      const permissions = localStorage.getItem('permissions');
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
      this.feature_permission = this.feature_permission.permissions;
      this.selected = 'active';
      // this.isLoading = false;
    });

    this.isLoading = true;
    this.commonService.getEmployees().subscribe(res => {
      this.employees = res.data;
      this.dataSource = res.data.employees;
      this.isLoading = false;
    });

    this.isLoading = true;

    this.searchInputControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.searchValue = value;
        this.filerData(value);
      });

    this.selectedStatus = 2;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.paginator.page.pipe(
    //     tap(() => this.loadLessonsPage())
    // ).subscribe();
  }

  openComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddEmployeeComponent, {
      // height: '420px',
      // width: '1000px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openDialog(userId) {
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
        this.commonService.deleteUser(userId).subscribe(res => {
          this.toastr.success(res.message);
          this.isLoading = false;
          this._router.navigate(['/employee/delete']);
        });
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  confirmStatusChange(userId, status) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure want to change status of this user?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.changeStatus(userId, status);
        const a = document.createElement('a');
        a.click();
        a.remove();
      } else {
        // console.log(confirmed);
      }
    });
  }

  openEditDialog(userId): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddEmployeeComponent, {
      // height: '420px',
      // width: '1000px',
      data: { userId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openChangePasswordDialog(userId): void {
    const dialogRef = this._matDialog.open(ChangeEmployeePasswordComponent, {
      data: { userId, back: '/employee/delete' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  openLicencesDialog(userId, status = null): void {
    const dialogRef = this._matDialog.open(EmployeeLicencesComponent, {
      data: { userId, status }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  getServerData($event) {
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    this.commonService.getEmployees(this.paginate, this.page).subscribe(res => {
      this.employees = res.data;
      this.dataSource = res.data.employees;
      this.isLoading = false;
    });
  }

  viewUser(id) {
    this._router.navigate(['/employee/show/' + id]);
  }

  changeStatus(user_id, val) {
    this.isLoading = true;
    this.commonService.changeStatus(user_id, val).subscribe(res => {
      this.toastr.success(res.message);
      this.isLoading = false;
      this._router.navigate(['/employee/delete']);
    });
  }

  sortData($event) {
    // console.log($event);
  }

  searching() {
    this.commonService.getEmployees(this.paginate, this.page).subscribe(res => {
      this.employees = res.data;
      this.dataSource = res.data.employees;
      this.isLoading = false;
    });
  }

  filerData(val) {
    // this.isLoading = true;
    this.commonService.getEmployees(this.paginate, this.page, val, this.selectedType, this.selectedStatus).subscribe(res => {
      this.employees = res.data;
      this.dataSource = res.data.employees;
      this.isLoading = false;
    });
  }

  statusDropdownChange($event) {
    this.selectedStatus = $event.value;
    // console.log(this.selectedStatus);
    this.commonService.getEmployees(this.paginate, this.page, this.searchValue, this.selectedType, this.selectedStatus).subscribe(res => {
      this.employees = res.data;
      this.dataSource = res.data.employees;
    });
  }
}

export interface PeriodicElement {
  username: string;
  email: string;
  owner_id: string;
  owner_name: string;
  licencekey: string;
  discord: string;
  registered_since: string;
  last_sign_in: string;
  status: string;
}