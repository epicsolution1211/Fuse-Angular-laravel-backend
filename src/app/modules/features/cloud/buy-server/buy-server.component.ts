import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CloudService } from 'app/shared/services/cloud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-server',
  templateUrl: './buy-server.component.html',
  styleUrls: ['./buy-server.component.scss']
})
export class BuyServerComponent implements OnInit {
  /** reactive form */
  buyServer: FormGroup;
  buyServerobj: any = {};
  userFilter: any = { name: '' };
  licencekey: any = { licence_key: '' };
  serverVersion: any = { version: '' };
  isLoading = false;

  constructor(
    public matDialogRef: MatDialogRef<BuyServerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public cloudService: CloudService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _router: Router,
  ) {
    this.buyServerobj.server = [];
    this.buyServerobj.licence = [];
    this.buyServerobj.serverVersion = [];
    this.buyServerobj.installationType = [
      {
        id: 1,
        name: 'With example data (Demo) - recommended'
      },
      {
        id: 2,
        name: 'Without example data (Core)'
      }
    ];
    if (data) {
      if (data.dialogData == 'Create server') {
        const userData: any = JSON.parse(localStorage.getItem('user'));
        // console.log(userData);
        this.createServer(userData.id);
      }
    }
  }

  /** create a server */
  createServer(userId: any) {
    this.spinner.show();
    this.cloudService.serverCreate(userId).then((response: any) => {
      // console.log(response);
      if (response.error.code === 200) {
        const resdata = response.error.data;
        this.buyServerobj.server = response.error.data.plans;
        this.buyServerobj.licence = Object.values(resdata.licences);
        const allversions = resdata.versions;
        for (const property in allversions) {
          // console.log(allversions[property]);
          allversions[property];
          this.buyServerobj.serverVersion.push(allversions[property]);
        }
        // console.log(this.buyServerobj);
      }
      this.spinner.hide();
    });
  }

  ngOnInit(): void {
    this.buyServer = this.formBuilder.group({
      server: ['', Validators.required],
      licence_id: ['', Validators.required],
      version: ['', Validators.required],
      installType: ['', Validators.required],
      hostname: ['', Validators.required],
    });
  }

  /** onSubmit */
  onSubmit() {
    this.isLoading = true;
    // console.log(this.buyServer);
    const userData: any = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append("server", this.buyServer.value.server);
    formData.append("licence_id", this.buyServer.value.licence_id);
    formData.append("version", this.buyServer.value.version);
    formData.append("installation_type", this.buyServer.value.installType);
    formData.append("hostname", this.buyServer.value.hostname);
    formData.append("email", userData.email);
    formData.append("userId", userData.id);
    formData.append('nn_user_id',JSON.parse(localStorage.getItem('cloudUserLoginData')).nn_user_id)
    this.cloudService.serverCreatePost(formData).then(data => {
      this._router.navigate(['/cloud']);
      this.toastr.success("Server created successfully", 'Success!', { progressBar: true });
      this.matDialogRef.close();
      this.isLoading = false;
      window.location.reload();
    }, error => {
      this.toastr.error(error.error.message, 'Error');
    });
  }
}
