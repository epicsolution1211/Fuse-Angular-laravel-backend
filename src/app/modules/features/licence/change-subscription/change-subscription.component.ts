import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';

@Component({
  selector: 'app-change-subscription',
  templateUrl: './change-subscription.component.html',
  styleUrls: ['./change-subscription.component.scss']
})
export class ChangeSubscriptionComponent implements OnInit {
    form: FormGroup;
    isLoading: boolean;
    submitted: boolean;
    userId:string;
    last_sign_in;
    loggedin_id:any;
    licence_id:any;
    licence_data:any;
    subscription_id:any;
    next_pay:any;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ChangeSubscriptionComponent>,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
        if(data.id){
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
    ngOnInit(): void
    {
        this.userId = this.data?.userId;
        this.licence_id = this.licence_id;
        if(this.licence_id != undefined){
            this.commonService.getLicenceById(this.licence_id).subscribe(res => {
                const licence_type = this.getLicencesType(res.data.licence.licence_type);
                this.licence_data = res.data.licence;
                this.licence_data.licence_type_name = licence_type;
            });
            this.commonService.getChangeSubscriptionData(this.licence_id).subscribe(res => {
                this.subscription_id = res.data.subscription_id;
                this.next_pay = res.data.next_pay;
            });
        }
        // Create the form
        this.form = this._formBuilder.group({
            subscription_id : [this.subscription_id],
            licence_id : [this.licence_id],
        });
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
    saveAndClose(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    changeSubscription(): void
    {
        this.submitted = true;

        if(this.form.valid){
            const formData = new FormData();
            formData.append("subscription_id",this.subscription_id);
            formData.append("licence_id",this.form.get('licence_id').value);
            this.isLoading = true;
            this.commonService.changeSubscription(formData).subscribe(data => {
                this.submitted = false;
                // this._router.navigate(['/licences']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', {progressBar: true});
                this.matDialogRef.close();
                window.location.href=data.data.xsollapayment;
                // window.location.href="https://sandbox-secure.xsolla.com/paystation3/desktop/subscription/?access_token="+data.token;
                // window.location.href='https://secure.xsolla.com/paystation3/desktop/payment/?access_token='+data.token;
                // window.location.href='https://sandbox-secure.xsolla.com/paystation3/?access_token='+data.token;
              }, error => {
                this.isLoading = false;
                this._router.navigate(['/licences']);
                this.toastr.error(error.error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }

    getLicencesType(licenseType){
        let license_type = "";
        if(licenseType == 'PREM1'){
          license_type = "Atavism On-Premises Advanced";
        }else if(licenseType == 'PREM2'){
          license_type = "Atavism On-Premises Ultra";
        }else if(licenseType == 'PREM3'){
          license_type = "Atavism On-Premises Standard";
        }else if(licenseType == 'PREM4'){
          license_type = "Atavism On-Premises Professional";
        }else if(licenseType == 'PREM5'){
          license_type = "Atavism On-Premises";
        }else if(licenseType == 'PREM5'){
          license_type = "Atavism On-Premises";
        }else if(licenseType == 'TRIAL'){
          license_type = "Atavism On-Premises Trial";
        }else if(licenseType != 'TRIAL'){
          license_type = "Atavism On-Premises Standard Subscription";
        }
        return license_type;
    }
}
