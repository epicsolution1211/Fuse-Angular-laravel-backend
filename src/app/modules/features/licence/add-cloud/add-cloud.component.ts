import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';

@Component({
    selector: 'app-add-cloud',
    templateUrl: './add-cloud.component.html',
    styleUrls: ['./add-cloud.component.scss']
})
export class AddCloudComponent implements OnInit {
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

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AddCloudComponent>,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
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

        // Create the form
        this.form = this._formBuilder.group({
            invoice_id: ['', [Validators.required]]
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
    save(): void {
        this.submitted = true;
        if (this.form.valid) {
            const formData = new FormData();
            formData.append("invoice_id", this.form.get('invoice_id').value);
            this.isLoading = true;
            this.commonService.addUnityLicence(formData).subscribe(data => {
                this.submitted = false;
                this._router.navigate(['/licences']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', { progressBar: true });
                this.matDialogRef.close(true);
            }, error => {
                this.isLoading = false;
                this._router.navigate(['/licences']);
                this.toastr.error(error.error.message, 'Error');
                this.matDialogRef.close(false);
            });
        }
    }
}
