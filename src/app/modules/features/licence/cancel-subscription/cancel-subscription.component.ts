import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrls: ['./cancel-subscription.component.scss']
})
export class CancelSubscriptionComponent implements OnInit {
    form: FormGroup;
    isLoading: boolean;
    submitted: boolean;
    userId:string;
    last_sign_in;
    loggedin_id:any;
    licence_id:any;
    subscription_id:any;
    licence_data:any;
    reason_textbox=false;
    reasonFirst:any;
    reasonFirstLabel:any;
    reasonSecond:any;
    reasonSecondLabel:any;
    reasonThird:any;
    reasonThirdLabel:any;
    reasonFive:any;
    reasonFiveLabel:any;
    clickCancelStatus:any;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<CancelSubscriptionComponent>,
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
        this.commonService.getLicenceById(this.licence_id).subscribe(res => {
            const licence_type = this.getLicencesType(res.data.licence.licence_type);
            this.licence_data = res.data.licence;
            this.licence_data.licence_type_name = licence_type;
        });
        this.commonService.getCancelSubscription(this.licence_id).subscribe(data => {
            this.subscription_id = data.data.subscription_id;
        });
        this.commonService.getSubscriptionCancelReason(10,0).subscribe(res => {
            this.reasonFirst = res.data.subscriptionCancelReasons[0].reason_id;
            this.reasonFirstLabel = res.data.subscriptionCancelReasons[0].reason;
            this.reasonSecond = res.data.subscriptionCancelReasons[1].reason_id;
            this.reasonSecondLabel = res.data.subscriptionCancelReasons[1].reason;
            this.reasonThird = res.data.subscriptionCancelReasons[2].reason_id;
            this.reasonThirdLabel = res.data.subscriptionCancelReasons[2].reason;
            this.reasonFive = res.data.subscriptionCancelReasons[3].reason_id;
            this.reasonFiveLabel = res.data.subscriptionCancelReasons[3].reason;
            // console.log("this.reasonFirst",this.reasonFirst);
            // console.log("this.reasonSecond",this.reasonSecond);
        });
        // Create the form
        this.form = this._formBuilder.group({
            licence_id: [this.licence_id],
            subscription_id: [this.subscription_id],
            reason : ['', [Validators.required]],
            reason_text : ['', [Validators.required]],
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

    changeReason(event){
      if(event.target.defaultValue == 5){
        this.reason_textbox = true;
        this.form.get('reason_text').validator = (Validators.compose([Validators.required]) as any);
        this.form.get('reason_text')?.updateValueAndValidity();
      }else{
        this.reason_textbox = false;
        this.form.get('reason_text')?.clearValidators();
        this.form.get('reason_text')?.updateValueAndValidity();
      }
    }
    /**
     * Send the message
     */
    cancelSubscription(): void
    {
        this.submitted = true;
        this.clickCancelStatus = true;
        if(this.form.valid){
            const retrivedUser = localStorage.getItem('user');
            const user = JSON.parse(retrivedUser) ?? '';
            this.loggedin_id = user.id;
            const formData = new FormData();
            formData.append("loggedin_id",this.loggedin_id);
            formData.append("licence_id",this.licence_id);
            formData.append("reason",this.form.get('reason').value);
            formData.append("subscription_id",this.subscription_id);
            if(this.form.get('reason_text').value){
              formData.append("reason_text",this.form.get('reason_text').value);
            }
            this.isLoading = true;
            this.commonService.cancelSubscription(formData).subscribe(data => {
                this.submitted = false;
                this._router.navigate(['/licences']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', {progressBar: true});
                this.matDialogRef.close();
              }, error => {
                this.isLoading = false;
                this._router.navigate(['/licences']);
                this.toastr.error(error.error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }

    clickCancel(){
        this.clickCancelStatus = true;
        // return true;
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
