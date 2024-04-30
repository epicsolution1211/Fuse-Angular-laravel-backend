import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvisorService } from 'app/shared/services/advisor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-advisor',
  templateUrl: './edit-advisor.component.html',
  styleUrls: ['./edit-advisor.component.scss']
})
export class EditAdvisorComponent implements OnInit {
  editAdvisorForm: FormGroup;
  getDataFromParent: any = {};
  advisorDataGroup: any;

  constructor(
    public matDialogRef: MatDialogRef<EditAdvisorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public advisorService: AdvisorService,
    private toastr: ToastrService,
  ) {
    if (data) {
      this.getDataFromParent = data.dialogData;
      // console.log(this.getDataFromParent);
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    this.advisorDataGroup = this.fb.array(this.getAdvisorFormFields().map(formFirlds => this.fb.group(formFirlds)));
    this.editAdvisorForm = this.fb.group({
      advisorFields: this.advisorDataGroup
    });
    this.spinner.hide();

    // console.log(this.advisorDataGroup);
  }

  getAdvisorFormFields() {
    const advisorControlArray = [];

    this.getDataFromParent.advisorData.filter((data: any) => {
      advisorControlArray.push({
        id: [data.id],
        advise_slug: [data.advise_slug],
        advise_days: [data.advise_days],
        advise_variables: [data.advise_variables],
        advise_name: [data.advise_name, { disable: true }],
        advise_mail_status: [data.advise_mail_status],
        advise_message_status: [data.advise_message_status],
        advise_description: [data.advise_description]
      });
    });
    return advisorControlArray;
  }

  /** on submit edit advisor form */
  onSubmit(value) {
    // console.log(value);
    const body = {
      user_id: '1',
      advisor_settings: value.value.advisorFields
    };
    // console.log(body);
    this.spinner.show();
    this.advisorService.saveAdvisorSettings(body).then((data: any) => {
      // console.log(data);
      if (data.status == 'true') {
        const sucessData: any = {
          result: true,
          data: data.data.data[0].advisor_settings
        };
        this.toastr.success('Edit Advisor Successfully', 'Success!', { progressBar: true });
        this.matDialogRef.close(sucessData);
      } else {
        this.toastr.error('Something went wrong', 'Error', { progressBar: true });
      }
    });
    this.spinner.hide();
  }

}
