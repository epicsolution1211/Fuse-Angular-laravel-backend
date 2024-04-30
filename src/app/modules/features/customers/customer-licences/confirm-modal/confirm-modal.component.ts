import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenceGenerateService } from 'app/shared/services/licence-generate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  dialogContent: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmModalComponent>,
    public licenceService: LicenceGenerateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
    if (data) {
      this.dialogContent = data.dialogData;
      // console.log("data>>>>>>>>>>>>>>>", data);
    }
  }

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    const body = {
      licence_id: this.dialogContent.licenceKeyId
    };
    this.spinner.show("spinner-1");
    this.licenceService.forRegenarateKey(body).then((licence: any) => {
      // console.log("licence>>>>>>>>>>>>>>>>", licence);
      if (licence.status === "true") {
        this.toastr.success("Please check your mail we will send verification code!!");
        const afterAction: any = {};
        if (this.dialogContent.regenrateKey) {
          afterAction.regenrateKey = true;
        }
        this.dialogRef.close(afterAction);
        this.spinner.hide("spinner-1");
      }
    });


  }

}
