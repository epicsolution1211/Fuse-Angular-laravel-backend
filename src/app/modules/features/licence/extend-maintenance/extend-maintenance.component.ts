import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LicenceGenerateService } from 'app/shared/services/licence-generate.service';

@Component({
  selector: 'app-extend-maintenance',
  templateUrl: './extend-maintenance.component.html',
  styleUrls: ['./extend-maintenance.component.scss']
})
export class ExtendMaintenanceComponent implements OnInit {
  form: FormGroup;
  features: any;
  isLoading: boolean;
  submitted: boolean;
  userId: string;
  selectedProduct: any;
  roles: any;
  permissions: any = [];
  employee: any;
  languages: any;
  last_sign_in;
  loggedin_id: any;
  licence_id: any;
  licence_data: any;
  maintenances: any;
  coupon_code: any;
  promotion: boolean;
  actual_price: any;
  applyResponse: any;

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<ExtendMaintenanceComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    private spinner: NgxSpinnerService,
    private licenceService: LicenceGenerateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.id) {
      this.licence_id = data.id;
    }
  }

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
    this.licence_id = this.licence_id;
    const maintenancesArr = [];
    if (this.licence_id != undefined) {
      this.commonService.getLicenceById(this.licence_id).subscribe(res => {
        const licence_type = this.getLicencesType(res.data.licence.licence_type);
        this.maintenances = res.data.maintenance;
        this.licence_data = res.data.licence;
        this.promotion = res.data.promotion;
        this.licence_data.licence_type_name = licence_type;
      });
    }
    // Create the form
    this.form = this._formBuilder.group({
      // leaseplan : ['', [Validators.required]],
      licence_id: [this.licence_id, [Validators.required]],
      maintenances: [this.maintenances, [Validators.required]],
      coupon_code: [this.coupon_code, [Validators.required]]
    });

    if (!this.promotion) {
      this.form.controls.coupon_code.clearValidators();
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
   * Save and close
   */
  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  /**
   * Discard the message
   */
  discard(): void {

  }

  /**
   * Save the message as a draft
   */
  saveAsDraft(): void {

  }

  /**
   * Send the message
   */
  extendMaintenance(): void {
    this.submitted = true;
    if (this.form.valid) {
      const retrivedUser = localStorage.getItem('user');
      const user = JSON.parse(retrivedUser) ?? '';
      this.loggedin_id = user.id;
      const formData = new FormData();

      let actualPrice: any;
      if (this.form.value.maintenances == 'AtXMain180') {
        actualPrice = 90;
      }
      else if (this.form.value.maintenances == 'AtXMain365') {
        actualPrice = 144;
      }
      else if (this.form.value.maintenances == 'AtAdvMain30') {
        actualPrice = 21;
      }
      else if (this.form.value.maintenances == 'AtAdvMain90') {
        actualPrice = 63;
      }
      else if (this.form.value.maintenances == 'AtAdvMain180') {
        actualPrice = 125;
      }
      else if (this.form.value.maintenances == 'AtAdvMain365') {
        actualPrice = 250;
      }
      else if (this.form.value.maintenances == 'AtUltMain30') {
        actualPrice = 209;
      }
      else if (this.form.value.maintenances == 'AtUltMain90') {
        actualPrice = 625;
      }
      else if (this.form.value.maintenances == 'AtUltMain180') {
        actualPrice = 1250;
      }
      else if (this.form.value.maintenances == 'AtUltMain365') {
        actualPrice = 2500;
      }
      else if (this.form.value.maintenances == 'AtStdMain30') {
        actualPrice = 11;
      }
      else if (this.form.value.maintenances == 'AtStdMain90') {
        actualPrice = 32;
      }
      else if (this.form.value.maintenances == 'AtStdMain180') {
        actualPrice = 63;
      }
      else if (this.form.value.maintenances == 'AtStdMain365') {
        actualPrice = 125;
      }
      else if (this.form.value.maintenances == 'AtProMain30') {
        actualPrice = 105;
      }
      else if (this.form.value.maintenances == 'AtProMain90') {
        actualPrice = 313;
      }
      else if (this.form.value.maintenances == 'AtProMain180') {
        actualPrice = 625;
      }
      else if (this.form.value.maintenances == 'AtProMain365') {
        actualPrice = 1250;
      }

      formData.append("actual_price", this.actual_price ? this.actual_price : actualPrice);
      // formData.append("licence_id",this.form.value.licence_id);
      formData.append("coupon_code", this.form.value.coupon_code);
      formData.append("maintenances", this.form.value.maintenances);
      // formData.append("licence_id",this.form.value.licence_id);
      formData.append("licence_id", this.licence_id);



      this.isLoading = true;
      this.commonService.extendMaintenance(formData).subscribe(data => {
        this.submitted = false;
        // this._router.navigate(['/licences']);
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        window.location.href = data.data.xsollapayment;
        // window.location.href=data.xsollapayment;
        // window.location.href='https://sandbox-secure.xsolla.com/paystation3/desktop/payment/?access_token='+data.token;
      }, error => {
        this.isLoading = false;
        this._router.navigate(['/licences']);
        this.toastr.error(error.error.message, 'Error');
        this.matDialogRef.close();
      });
    } else {
      this.toastr.error('Please fill all required fields!!');
      this.markFormTouched(this.form);
    }
  }

  getLicencesType(licenseType) {
    let license_type = "";
    if (licenseType == 'PREM1') {
      license_type = "Atavism On-Premises Advanced";
    } else if (licenseType == 'PREM2') {
      license_type = "Atavism On-Premises Ultra";
    } else if (licenseType == 'PREM3') {
      license_type = "Atavism On-Premises Standard";
    } else if (licenseType == 'PREM4') {
      license_type = "Atavism On-Premises Professional";
    } else if (licenseType == 'PREM5') {
      license_type = "Atavism On-Premises";
    } else if (licenseType == 'PREM5') {
      license_type = "Atavism On-Premises";
    } else if (licenseType == 'TRIAL') {
      license_type = "Atavism On-Premises Trial";
    } else if (licenseType != 'TRIAL') {
      license_type = "Atavism On-Premises Standard Subscription";
    }
    return license_type;
  }


  /**
    Varify coupan
  */
  varifyCoupan() {
    this.submitted = true;
    if (this.form.valid) {
      this.spinner.show('spinner-77');

      let actualPrice: any;
      if (this.form.value.maintenances == 'AtXMain180') {
        actualPrice = 90;
      }
      else if (this.form.value.maintenances == 'AtXMain365') {
        actualPrice = 144;
      }
      else if (this.form.value.maintenances == 'AtAdvMain30') {
        actualPrice = 21;
      }
      else if (this.form.value.maintenances == 'AtAdvMain90') {
        actualPrice = 63;
      }
      else if (this.form.value.maintenances == 'AtAdvMain180') {
        actualPrice = 125;
      }
      else if (this.form.value.maintenances == 'AtAdvMain365') {
        actualPrice = 250;
      }
      else if (this.form.value.maintenances == 'AtUltMain30') {
        actualPrice = 209;
      }
      else if (this.form.value.maintenances == 'AtUltMain90') {
        actualPrice = 625;
      }
      else if (this.form.value.maintenances == 'AtUltMain180') {
        actualPrice = 1250;
      }
      else if (this.form.value.maintenances == 'AtUltMain365') {
        actualPrice = 2500;
      }
      else if (this.form.value.maintenances == 'AtStdMain30') {
        actualPrice = 11;
      }
      else if (this.form.value.maintenances == 'AtStdMain90') {
        actualPrice = 32;
      }
      else if (this.form.value.maintenances == 'AtStdMain180') {
        actualPrice = 63;
      }
      else if (this.form.value.maintenances == 'AtStdMain365') {
        actualPrice = 125;
      }
      else if (this.form.value.maintenances == 'AtProMain30') {
        actualPrice = 105;
      }
      else if (this.form.value.maintenances == 'AtProMain90') {
        actualPrice = 313;
      }
      else if (this.form.value.maintenances == 'AtProMain180') {
        actualPrice = 625;
      }
      else if (this.form.value.maintenances == 'AtProMain365') {
        actualPrice = 1250;
      }

      const formData = new FormData();
      formData.append("coupon_code", this.form.value.coupon_code);
      // formData.append("licence_id",this.form.value.licence_id);
      formData.append("price", actualPrice);
      this.licenceService.varifyCoupanCode(formData).then((res: any) => {
        this.applyResponse = res;
        this.actual_price = res.actual_price;
        if (res.error == "error") {
          this.toastr.error(res.message);
        } else {
          this.toastr.success(res.message);

        }
      }, (err: any) => {
        // console.log(err);
        this.toastr.error(err.error.message);
      });
      this.spinner.hide('spinner-77');

    } else {
      this.toastr.error('Please fill all required fields!!');
      this.markFormTouched(this.form);
    }
  }

  /**Mark Form Touched*/
  markFormTouched = (group: FormGroup | FormArray) => {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
