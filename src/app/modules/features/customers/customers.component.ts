import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationDialog } from "app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CommonService } from "app/shared/services/common.service";
import { ToastrService } from "ngx-toastr";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { MatSort } from "@angular/material/sort";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { debounceTime, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CustomerLicencesComponent } from "../customers/customer-licences/customer-licences.component";
import { AddCustomerComponent } from "./add-customer/add-customer.component";
import { AssignUserPromotionComponent } from "../promotions/assign-user-promotion/assign-user-promotion.component";
import { SelectionModel } from "@angular/cdk/collections";
import { NgxSpinnerService } from "ngx-spinner";
import { CcuUsasesComponent } from "./ccu-usases/ccu-usases.component";
import { NotifyComponent } from "./notify/notify.component";
import { DatePipe } from "@angular/common";
import { FuseConfigService } from "@fuse/services/config";
import { AppConfig } from "app/core/config/app.config";
import moment from "moment";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  config: AppConfig;
  moment: any = moment;
  public daterange: any = {};
  public options: any = {
    showCustomRangeLabel: true,
    autoApply: true,
    autoUpdateInput: true,
    locale: { format: "YYYY-MM-DD" },
    alwaysShowCalendars: false,
  };

  displayedColumns: string[] = [
    "select",
    "username",
    "licences",
    "discord",
    "registerDate",
    "lastvisitDate",
    "status",
    "ccuUses",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set sort(value: MatSort) {
    this.dataSource.sort = value;
  }

  isLoading = false;
  paginate = 25;
  page = 0;
  licences: any = [];
  filter: FormControl = new FormControl();
  filter1: FormControl = new FormControl();
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  users: any;
  features: any;
  feature_permission: any;
  current_url: any;
  selected;
  selectedStatus = "";
  searchValue;
  roles;
  selectedType = "";

  customerObje: any = {};

  userFilter: any = { name: "" };
  username: any = { name: "" };
  licenceKyeS: any = { name: "" };
  licenceTypes: any = { name: "" };

  /** reactive form */

  advanceSearch: FormGroup;

  /**
   * Constructor
   */
  constructor(
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    public _datePipe: DatePipe,
    private _fuseConfigService: FuseConfigService
  ) {
    this.customerObje.selectRows = [];
    this.customerObje.discordName = [];
    this.customerObje.userName = [];
    this.customerObje.email = [];
    this.customerObje.licenceKey = [];
    this.customerObje.licenceType = [];
    this.customerObje.avanceFilterMode = false;

    this.customerObje.dataOfAdcanceFilter = false;

    this.customerObje.customCss = false;
    this.customerObje.customCssServer = false;

    this.commonService.getFeatures().subscribe((res) => {
      this.features = res.data.features;
      const feature_id = this.features.find(
        (feature) => feature.name == this.current_url
      );
      const permissions = localStorage.getItem("permissions");
      const permission_arr = JSON.parse(permissions);
      this.feature_permission = permission_arr.find(
        (p) => p.feature_id == feature_id.id
      );
      this.feature_permission = this.feature_permission?.permissions
        ? this.feature_permission?.permissions
        : null;
      this.selected = "active";
    });
  }

  /** Ngonint */
  ngOnInit() {
    this.selected = "";
    const hash = window.location.pathname;
    const parts = hash.split("/");
    this.current_url = parts[1];

    this.commonService.getUserFilter().subscribe((res) => {
      this.roles = res.data.roles;
      this.selected = "";
    });
    this.spinner.show();

    /** Get licenceType list */
    this.commonService.getLicenceTypes().subscribe((res) => {
      this.licenceTypes = res.data.licenceTypes;
    });

    /** Get customer list */
    this.commonService
      .getCustomers(
        this.paginate,
        this.page,
        this.selectedStatus,
        this.selectedType
      )
      .subscribe((res) => {
        this.users = res.data;

        // this.customerObje.discordName = res.discordData;
        // this.customerObje.userName = res.userName;
        // this.customerObje.licenceKey = res.licenceKey;

        // this.customerObje.licenceType = res.licenceType;

        // res.licenceKey.map((key) => {
        //   if (key.licence_key) {
        //     key.name = key.licence_key;
        //     this.customerObje.licenceKey.push(key);
        //   }
        // });

        // this.customerObje.licenceType = this.customerObje.licenceType.map((key) => {
        //   if (key.licence_type != '') {
        //     key.name = key.licence_type;

        //     return key;
        //   }
        // });

        // const result = this.customerObje.licenceType.reduce((unique, o) => {
        //   if (!unique.some((obj) => obj.name === o.name)) {
        //     unique.push(o);
        //   }
        //   return unique;
        // }, []);
        // // console.log(result);

        // this.customerObje.licenceType = result;

        this.customerObje.userLength = this.users.users.length;
        /** discord name filter */
        this.users.users.filter((user) => {
          /** discord name push */
          // if (user.discord.length > 0) {
          //   user.discord.filter((disc) => {
          //     this.customerObje.discordName.push(disc);
          //   });
          // }
          /** Username info */
          // if (user.username) {
          //   this.customerObje.userName.push({
          //     name: user.username
          //   });
          // }
          /** licency key  */
          // if (user.licences.length > 0) {
          //   this.customerObje.licenceKey.push({
          //     name: user.licences[0]
          //   });
          // }
          /** licence type */
          // if (user.licence_type.length > 0) {
          //   this.customerObje.licenceType.push({
          //     name: user.licence_type
          //   });
          //   var result = this.customerObje.licenceType.reduce((unique, o) => {
          //     if (!unique.some(obj => obj.name === o.name)) {
          //       unique.push(o);
          //     }
          //     return unique;
          //   }, []);
          //   // console.log(result);
          //   this.customerObje.licenceType = result;
          // }
        });
        this.dataSource = new MatTableDataSource(res.data.users);

        if (this.commonService.getAdvanceSearchField != undefined) {
          this.commonService
            .searchCustomers(this.commonService.getAdvanceSearchField)
            .subscribe((res) => {
              this.users = res.data;
              this.dataSource = new MatTableDataSource(res.data.users);

              this.customerObje.dataOfAdcanceFilter = true;

              this.advanceSearch.patchValue({
                discordName:
                  this.commonService.getAdvanceSearchField.discordName,
                userName: this.commonService.getAdvanceSearchField.userName,
                email: this.commonService.getAdvanceSearchField.email,
                licenceKey: this.commonService.getAdvanceSearchField.licenceKey,
                licenceType:
                  this.commonService.getAdvanceSearchField.licenceType,
                loginTo: this.commonService.getAdvanceSearchField.loginTo,
                loginFrom: this.commonService.getAdvanceSearchField.loginFrom,
                serverTo: this.commonService.getAdvanceSearchField.serverTo,
                serverFrom: this.commonService.getAdvanceSearchField.serverFrom,
                maintenance:
                  this.commonService.getAdvanceSearchField.maintenance,
                subscription:
                  this.commonService.getAdvanceSearchField.subscription,
              });

              if (
                this.commonService.getAdvanceSearchField.discordName != "" ||
                this.commonService.getAdvanceSearchField.userName != "" ||
                this.commonService.getAdvanceSearchField.email != "" ||
                this.commonService.getAdvanceSearchField.licenceKey != "" ||
                this.commonService.getAdvanceSearchField.licenceType != "" ||
                this.commonService.getAdvanceSearchField.loginTo != "" ||
                this.commonService.getAdvanceSearchField.serverTo != "" ||
                this.commonService.getAdvanceSearchField.maintenance != "" ||
                this.commonService.getAdvanceSearchField.subscription != ""
              ) {
                this.customerObje.avanceFilterMode = true;
              }
            });
        }
        this.spinner.hide();
      });

    // console.log(this.searchInputControl.value);

    if (this.searchInputControl.value != null) {
      this.searchInputControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe((value) => {
          setTimeout(() => {
            // console.log(value);

            this.commonService.setAdvanceSearchField(this.advanceSearch.value);
            this.filerData(value);
            this.spinner.hide();
          }, 1000);
        });
    }
    /** Advance search form */

    this.advanceSearch = this.formBuilder.group({
      page: [1],
      paginate: [25],
      discordName: [null],
      userName: [null],
      email: [null],
      licenceKey: [null],
      licenceType: [null],
      loginTo: [null],
      loginFrom: [null],
      serverTo: [null],
      serverFrom: [null],
      maintenance: [null],
      subscription: [null],
      search: [
        this.searchInputControl.value ? this.searchInputControl.value : null,
      ],
      // status: ['']
    });

    // Subscribe to config changes
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: AppConfig) => {
        // Store the config
        this.config = config;

        // console.log("this._fuseConfigService.config>>>>>>", this.config);
        if (this.config.scheme == "light") {
          // this.customerObje.customCssServer = true;
        }
        {
          this.customerObje.customCssServerDark = true;
          this.customerObje.customCssLoginDate = true;
        }
        // Update the layout
      });
  }

  /** Advance search filter submit form */
  onSubmit() {
    this.commonService
      .searchCustomers(this.advanceSearch.value)
      .subscribe((res) => {
        // console.log(res);
        this.users = res.data;
        this.dataSource = new MatTableDataSource(res.data.users);
        this.customerObje.dataOfAdcanceFilter = true;

      });
  }

  /** Reset advance filter form */
  resetForm() {
    this.spinner.show();
    this.advanceSearch.reset();
    this.commonService.setAdvanceSearchField(undefined);
    if (this.searchInputControl.value) {
      this.onSubmit();
      this.spinner.hide();
    } else {
      this.customerObje.customCssServer = false;
      this.customerObje.customCssServerDark = true;
      this.customerObje.customCss = false;
      this.customerObje.customCssLoginDate = true;
      this.paginate = 25;
      this.page = 1;
      this.commonService
        .getCustomers(
          this.paginate,
          this.page,
          this.selectedStatus,
          this.selectedType
        )
        .subscribe((res) => {
          this.users = res.data;
          this.customerObje.userLength = this.users.users.length;
          this.dataSource = new MatTableDataSource(res.data.users);
          this.spinner.hide();
        });
      this.customerObje.dataOfAdcanceFilter = false;
    }
  }

  /** Advance Search filter mode on */
  advanceFilter() {
    this.spinner.show();
    this.customerObje.avanceFilterMode = !this.customerObje.avanceFilterMode;
    this.spinner.hide();
  }

  /** Advance filter show */

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.advanceSearch = this.formBuilder.group({
      page: [1],
      paginate: [25],
      discordName: [""],
      userName: [""],
      email: [""],
      licenceKey: [""],
      licenceType: [""],
      loginTo: [""],
      loginFrom: [""],
      serverTo: [""],
      serverFrom: [""],
      maintenance: [""],
      subscription: [""],
      search: [
        this.searchInputControl.value ? this.searchInputControl.value : null,
      ],
      // status: ['']
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.customerObje.selectRows = [];
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => {
        this.selection.select(row);
        this.customerObje.selectRows.push(row.id);
      });
  }

  /** Single select check box */
  singleCheckBox(event: any, data: any) {
    if (event.checked) {
      this.customerObje.selectRows.push(data.id);
    } else {
      this.customerObje.selectRows.splice(
        this.customerObje.selectRows.indexOf(data.id),
        1
      );
    }
  }

  openComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddCustomerComponent, {
      height: "575px",
      width: "1000px",
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openDialog(userId) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: "Are you sure want to delete this customer?",
        buttonText: {
          ok: "Yes",
          cancel: "No",
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.commonService.deleteCustomer(userId).subscribe((res) => {
          this.toastr.success(res.message, "OK");
          this._router.navigate(["/customers/delete"]);
        });
        const a = document.createElement("a");
        a.click();
        a.remove();
      } else {
      }
    });
  }

  confirmStatusChange(userId, status) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: "Are you sure want to change status of this customer?",
        buttonText: {
          ok: "Yes",
          cancel: "No",
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.changeCustomerStatus(userId, status);
        const a = document.createElement("a");
        a.click();
        a.remove();
      } else {
      }
    });
  }

  openEditDialog(userId): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddCustomerComponent, {
      height: "575px",
      width: "1000px",
      data: { userId },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openChangePasswordDialog(userId): void {
    const dialogRef = this._matDialog.open(ChangePasswordComponent, {
      data: { userId, back: "/customers/delete" },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openLicencesDialog(userId, status = null): void {
    const dialogRef = this._matDialog.open(CustomerLicencesComponent, {
      data: { userId, status },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  /** Assign Promotion modal */
  openAssignPromotion(user_id): void {
    // console.log(user_id);
    // if (user_id.length > 1) {
    //   user_id = [];
    // }
    // console.log("user_id", user_id);
    const dialogRef = this._matDialog.open(AssignUserPromotionComponent, {
      height: "375px",
      width: "800px",
      data: { user_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  /** Notify user */
  notifyUser(user_id): void {
    const dialogRef = this._matDialog.open(NotifyComponent, {
      data: { user_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.selection.clear();
      this.customerObje.selectRows = [];
      this.cd.detectChanges();
    });
  }

  /**Next page event */
  getServerData($event) {
    this.spinner.show();
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    if (this.customerObje.dataOfAdcanceFilter) {
      this.commonService
        .searchCustomers(this.advanceSearch.value)
        .subscribe((res) => {
          // console.log(res);
          this.users = res.data;
          this.dataSource = new MatTableDataSource(res.data.users);
          this.spinner.hide();
        });
    } else {
      this.commonService
        .getCustomers(
          this.paginate,
          this.page,
          this.selectedStatus,
          this.selectedType
        )
        .subscribe((res) => {
          this.users = res.data;
          this.dataSource = new MatTableDataSource(res.data.users);
          this.spinner.hide();
        });
    }
  }

  /** View user detail */
  viewUser(userId): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddCustomerComponent, {
      data: { userId, preview: true },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  changeCustomerStatus(user_id, val) {
    this.commonService.changeCustomerStatus(user_id, val).subscribe((res) => {
      this.toastr.success(res.message, "OK");
      this._router.navigate(["/customers/delete"]);
    });
  }

  sortData($event) { }

  searching() {
    this.commonService
      .getCustomers(
        this.paginate,
        this.page,
        this.selectedStatus,
        this.selectedType
      )
      .subscribe((res) => {
        this.users = res.data;
        this.dataSource = new MatTableDataSource(res.data.users);
      });
  }

  filerData(val) {
    // this.isLoading = true;
    this.spinner.show();
    this.commonService
      .getCustomers(
        this.paginate,
        this.page,
        this.selectedStatus,
        this.selectedType
      )
      .subscribe((res) => {
        this.users = res.data;
        this.dataSource = new MatTableDataSource(res.data.users);
        this.spinner.hide();
      });
  }

  /** Type change */
  typeChange($event) {
    // console.log("$event", $event);
    this.spinner.show();
    this.selectedType = $event.value;
    this.commonService
      .getCustomers(
        this.paginate,
        this.page,
        this.selectedStatus,
        this.selectedType
      )
      .subscribe((res) => {
        this.users = res.data;
        this.dataSource = new MatTableDataSource(res.data.users);
        this.spinner.hide();
      });
  }

  /** Status change */
  statusDropdownChange($event) {
    this.spinner.show();
    this.selectedStatus = $event.value;
    this.commonService
      .getCustomers(
        this.paginate,
        this.page,
        this.selectedStatus,
        this.selectedType
      )
      .subscribe((res) => {
        this.users = res.data;
        this.dataSource = new MatTableDataSource(res.data.users);
        this.spinner.hide();
      });
  }

  /** Open ccu-usases component */

  openCcuUsesComponent(licences: any): void {
    const dialogRef = this._matDialog.open(CcuUsasesComponent, {
      width: "1000px",
      data: { licences },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Compose dialog was closed!');
    });
  }

  /** Select login to from date*/
  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    // console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    const startDate = this._datePipe.transform(
      value.start._d,
      "dd-MM-yyyy hh:mm:ss"
    );
    const endDate = this._datePipe.transform(
      value.end._d,
      "dd-MM-yyyy hh:mm:ss"
    );

    // console.log(startDate, endDate);

    this.advanceSearch.patchValue({
      loginTo: startDate,
      loginFrom: endDate,
    });

    this.customerObje.customCss = true;
    this.customerObje.customCssLoginDate = false;

    // console.log(this.daterange);
  }

  /** Select server to from date*/
  public selectedDateServer(value: any, datepicker?: any) {
    // console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    const startDate = this._datePipe.transform(
      value.start._d,
      "dd-MM-yyyy hh:mm:ss"
    );
    const endDate = this._datePipe.transform(
      value.end._d,
      "dd-MM-yyyy hh:mm:ss"
    );

    this.customerObje.customCssServer = true;
    this.customerObje.customCssServerDark = false;

    this.advanceSearch.patchValue({
      serverTo: startDate,
      serverFrom: endDate,
    });
    // console.log(this.daterange);
  }
}

export interface PeriodicElement {
  username: string;
  email: string;
  licencekey: string;
  discord: string;
  registerDate: string;
  last_sign_in: string;
  status: string;
}
