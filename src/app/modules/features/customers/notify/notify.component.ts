import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenceGenerateService } from 'app/shared/services/licence-generate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  dialogContent: any;
  notifyForm: FormGroup;
  notifyUser: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<NotifyComponent>,
    public licenceService: LicenceGenerateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    if (data) {
      this.dialogContent = data.user_id;
      // console.log("data>>>>>>>>>>>>>>>", data);
    }

    this.notifyUser.mailCard = false;
    this.notifyUser.notificationCard = false;
  }

  ngOnInit(): void {
    this.notifyForm = this.formBuilder.group({
      feedback: ['', Validators.required],
    });
  }

  /** Form submit */
  onSubmit() {
    if ((this.notifyForm.status === 'VALID') && (this.notifyUser.notificationCard || this.notifyUser.mailCard)) {

      let bothSelect: any;
      let selectuserId: any;

      if (this.notifyUser.notificationCard && this.notifyUser.mailCard) {
        bothSelect = `${"0,1"}`;
      } else if (this.notifyUser.notificationCard) {
        bothSelect = `${"1"}`;
      } else if (this.notifyUser.mailCard) {
        bothSelect = `${"0"}`;
      }

      this.spinner.show("spinner-1");
      const body = {
        user_id: this.dialogContent.toString(),
        notify_flag: bothSelect,
        feedback: this.notifyForm.value.feedback
      };
      this.licenceService.bulkNotifyUser(body).then((response: any) => {
        // console.log(response);
        if (response.status == "true") {
          this.toastr.success("Notification send successfully!");

          this.dialogRef.close();
          this.spinner.hide("spinner-1");
        } else {
          this.toastr.error(response.message);
        }
      });

    }
  }

  /** Select Card */
  selectCard(type: string) {
    if (type === 'notification') {
      this.notifyUser.notificationCard = !this.notifyUser.notificationCard;

    } else if (type === 'mail') {
      this.notifyUser.mailCard = !this.notifyUser.mailCard;
    }
  }

}
