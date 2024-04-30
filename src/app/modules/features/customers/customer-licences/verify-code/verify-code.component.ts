import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LicenceGenerateService } from 'app/shared/services/licence-generate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  /** mat table */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['licence_key_old', 'requested_date', 'verification_date'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dialogContent: any;
  verificationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<VerifyCodeComponent>,
    public licenceService: LicenceGenerateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    if (data) {
      this.dialogContent = data.dialogData;
      // console.log("data>>>>>>>>>>>>>>>", data);
    }
  }

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      code: ['', Validators.required],
    });

    /** call history get function  */
    this.historyOfLicence();
  }

  /** Get all licence history */
  historyOfLicence() {
    const body = {
      licence_id: this.dialogContent.licenceKeyId
    };
    this.licenceService.licenceKeyHistory(body).then((licenceHistory: any) => {
      if (licenceHistory.message === "Success") {
        this.dataSource = new MatTableDataSource(licenceHistory.data.getAllRegenerateLicence);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  /** Form submit */
  onSubmit() {
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    // console.log(retrivedUser);
    if (this.verificationForm.status === 'VALID') {
      this.spinner.show("spinner-1");
      const body = {
        user_id: retrivedUser.id,
        licence_id: this.dialogContent.licenceKeyId,
        verification_code: this.verificationForm.value.code
      };
      this.licenceService.verificationCode(body).then((response: any) => {
        if (response.status == "true") {
          this.toastr.success(response.message);
          const afterAction: any = {};
          if (this.dialogContent.regenrateKey) {
            afterAction.verifyCode = true;
          }
          this.dialogRef.close(afterAction);
          this.spinner.hide("spinner-1");
        } else {
          this.toastr.error(response.message);
        }
      });

    }
  }

}

export interface PeriodicElement {
  servername: string;
  dedicatedip: string;
  domain: string;
  name: string;
  mysqlpass: string;
  vpsstatus: string;
  bandwidth: string;
}
