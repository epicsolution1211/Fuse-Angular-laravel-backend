import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateRequirementComponent } from '../../custom-requirements/create-requirement/create-requirement.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  fileError: string;

  constructor(
    public matDialogRef: MatDialogRef<CreateRequirementComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));

    this.form = this._formBuilder.group({
      subject: ['', [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      allow_access_to_server: [false],
      licence: [{ value: '', disabled: true }, Validators.required],
      server_ip: [{ value: '', disabled: true }, Validators.required],
      description: ['', [Validators.required]],
      file: ''
    });

    this.form.get('allow_access_to_server').valueChanges.subscribe(checked => {
      if (checked) {
        this.form.get('licence').enable();
        this.form.get('server_ip').enable();
      } else {
        this.form.get('licence').disable();
        this.form.get('server_ip').disable();
      }
    });
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  onChangeFile(target: any) {
    const file = target.files[0];
    if (file.size / (1024 * 1024) <= 20) {
      // this.file = file;
      this.form.get('file').setValue(file);
      this.fileError = ""
    } else {
      this.fileError = "File size must be less than 20MB"
      this.form.get('file').setValue('');
      target.value = "";
    }

  }

  save() {
    if (this.form.valid) {
      const body = new FormData();

      body.append('subject', this.form.value.subject);
      body.append('email', this.form.value.email);
      body.append('allow_access_to_server', this.form.value.allow_access_to_server);
      if (this.form.value.allow_access_to_server) {
        body.append('licence', this.form.value.licence);
        body.append('server_ip', this.form.value.server_ip);
      }
      body.append('description', this.form.value.description);
      body.append('file', this.form.value.file);
      body.append('token', localStorage.getItem('zohoTokens'));
      // const body: any = {
      //   "subject": this.form.value.subject,
      //   "email": this.form.value.email,
      //   "description": this.form.value.description,
      //   "file": this.form.value.file,
      //   "token": localStorage.getItem('zohoTokens')
      // }
      this.spinner.show();
      this.commonService.createTicketZoho(body)
        .subscribe(
          (res) => {
            this.toastr.success(res.message, 'Success!', { progressBar: true });
            this.matDialogRef.close();
            this.spinner.hide();
          }
        )
    }

  }
}
