import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  ComponentFactoryResolver,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CommonService } from "app/shared/services/common.service";
import { ToastrService } from "ngx-toastr";
import * as _moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit {
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
  customer_main:
    | "add_customer_main"
    | "edit_customer_main"
    | "view_customer_main";
  spinner1 = "spinner1";
  preview: boolean = false;
  loading: boolean = true;

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<AddCustomerComponent>,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService
  ) { }
  get f() {
    return this.form.controls;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.userId = this.data?.userId;
    this.preview = this.data?.preview || false;

    this.commonService.getFeatures().subscribe((res) => {
      this.features = res.data.features;
    });

    this.commonService.getroles().subscribe((res) => {
      this.roles = res.data.roles;
    });
    this.commonService.getLanguages().subscribe((res) => {
      this.languages = res.data.languages;
    });

    // Create the form
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      displayname: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      title: new FormControl("New User", [Validators.required]),
      locale: new FormControl("", [Validators.required]),
      role: new FormControl(3, [Validators.required]),
      discord: new FormControl(""),
    });

    this.customer_main = "add_customer_main";
    if (this.userId != null) {
      this.customer_main = "edit_customer_main";
      if (this.preview) {
        this.customer_main = "view_customer_main";
      }
      this.spinner.show("spinner1");

      this.commonService.getUserById(this.userId).subscribe((res) => {
        // console.log(res);
        // const datepipe: DatePipe = new DatePipe('en-US')
        // console.log(typeof(res.data.user.lastvisitDate));
        const date = new Date(res.data.user.lastvisitDate);
        // this.last_sign_in = datepipe.transform(res.data.user.lastvisitDate, 'dd-MM-YYYY HH:mm:ss')
        // console.log(typeof(date));
        // console.log("res.data.user.role_id",res.data.user.role_id);
        this.user = res.data.user;

        // console.log("this.user", this.user);

        this.form = new FormGroup({
          username: new FormControl(
            { value: res.data.user.username, disabled: this.preview },
            [Validators.required]
          ),
          name: new FormControl(
            { value: res.data.user.name, disabled: this.preview },
            [Validators.required]
          ),
          displayname: new FormControl(
            { value: res.data.user.display_name, disabled: this.preview },
            [Validators.required]
          ),
          email: new FormControl(
            { value: res.data.user.email, disabled: this.preview },
            [Validators.required, Validators.email]
          ),
          title: new FormControl(
            { value: res.data.user.title, disabled: this.preview },
            [Validators.required]
          ),
          last_sign_in: new FormControl({
            value: res.data.user.lastvisitDate,
            disabled: this.preview,
          }),
          registered_since: new FormControl({
            value: res.data.user.registerDate,
            disabled: this.preview,
          }),
          locale: new FormControl(
            { value: res.data.user.locale, disabled: this.preview },
            [Validators.required]
          ),
          role: new FormControl(
            { value: res.data.user.role_id, disabled: this.preview },
            [Validators.required]
          ),
          discord: new FormControl({
            value: res.data.user.discord,
            disabled: this.preview,
          }),
          dateControl: new FormControl({ disabled: this.preview }),
        });
        this.loading = false;
        this.spinner.hide("spinner1");
      });
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("userId", this.userId);
      formData.append("name", this.form.get("name").value);
      formData.append("username", this.form.get("username").value);
      formData.append("displayname", this.form.get("displayname").value);
      formData.append("email", this.form.get("email").value);
      formData.append("title", this.form.get("title").value);
      formData.append("locale", this.form.get("locale").value);
      formData.append("role", this.form.get("role").value);
      formData.append("discord", this.form.get("discord").value);

      this.spinner.show("spinner1");
      this.commonService.addCustomer(formData).subscribe(
        (data) => {
          this.submitted = false;
          // this._router.navigate(['/customers/delete']);
          window.location.reload();
          this.spinner.hide("spinner1");
          this.toastr.success(data.message, "Success!", { progressBar: true });
          this.matDialogRef.close();
        },
        (error) => {
          this.spinner.hide("spinner1");
          this.toastr.error(error.error.message, "Error");
          this._router.navigate(["/customers/delete"]);
          // this.matDialogRef.close();
        }
      );
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the copy field with the given field name
   *
   * @param name
   */

  /**
   * close
   */
  close(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  setPreview(preview: boolean): void {
    this.preview = preview;
    if (!this.preview) {
      this.customer_main = "edit_customer_main";
      this.form.enable();
    } else {
      this.customer_main = "view_customer_main";
      this.form.disable();
    }
  }

  /**
   * Send the message
   */
  save(): void {
    this.submitted = true;
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("userId", this.userId);
      formData.append("name", this.form.get("name").value);
      formData.append("username", this.form.get("username").value);
      formData.append("displayname", this.form.get("displayname").value);
      formData.append("email", this.form.get("email").value);
      formData.append("title", this.form.get("title").value);
      formData.append("locale", this.form.get("locale").value);
      formData.append("role", this.form.get("role").value);
      formData.append("discord", this.form.get("discord").value);

      this.spinner.show();
      this.commonService.addCustomer(formData).subscribe(
        (data) => {
          this.submitted = false;
          this._router.navigate(["/customers/delete"]);
          this.spinner.hide();
          this.toastr.success(data.message, "Success!", { progressBar: true });
          this.matDialogRef.close();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error.error.message, "Error");
          this._router.navigate(["/customers/delete"]);
          // this.matDialogRef.close();
        }
      );
    }
  }
}
