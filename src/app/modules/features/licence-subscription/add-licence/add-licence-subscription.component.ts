import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-licence-subscription',
  templateUrl: './add-licence-subscription.component.html',
  styleUrls: ['./add-licence-subscription.component.scss']
})

export class AddLicenceSubscriptionComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  licence:any;
  url: string;
  versions: any;
  clicked = false;
  selected;
  public multiserver = [
  {"id": 0, "name": "No"},
  {"id": 1, "name": "Yes"}
  ];
  public status = [
  {"id": 0, "name": "Inactive"},
  {"id": 1, "name": "Active"}
  ];
  public selectedCategory = "Atavism Server";
  public selectedMutliserver2 = this.multiserver[1].id;
  public selected2 = this.status[1].id;
  public selectedVersionArr = [];

  constructor(
    public matDialogRef: MatDialogRef<AddLicenceSubscriptionComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    if(data.category){
      this.selectedCategory = data.category;
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.url = parts.pop();

    this.commonService.getAllVersions().subscribe(res => {
      this.versions = res.data.versions;
    });
    this.form = this._formBuilder.group({
      plan_name: ['', [Validators.required]],
      plan_discription : ['',[Validators.required]],
      trial_period_days : ['', [Validators.required]],
      from_price : ['', [Validators.required]],
      subscription_time : ['', [Validators.required]],
      ccu : ['', [Validators.required]],
      multiserver : ['',[Validators.required]],
      licence_type : ['',[Validators.required]],
      // external_id : ['',[Validators.required]],
    });
    if(this.data.configurationId != undefined){
      this.commonService.getLicenceSubscriptionById(this.data.configurationId).subscribe(res => {
        this.licence = res.data.licences;
        this.form = this._formBuilder.group({
          plan_name: [this.licence.product_name, [Validators.required]],
          plan_discription : [this.licence.product_desc, [Validators.required]],
          trial_period_days : [this.licence.trial_period_days, [Validators.required]],
          from_price : [this.licence.from_price, [Validators.required]],
          subscription_time : [this.licence.maintenance, [Validators.required]],
          ccu : [this.licence.concurrent_connections,[Validators.required]],
          multiserver : [this.licence.multiserver,[Validators.required]],
          licence_type : [this.licence.licence_type,[Validators.required]],
          // external_id : [this.licence.external_id,[Validators.required]]
        });
      });
    }
    this.commonService.getLicencesTypes().subscribe(res => {
      this.licences = res.data.licence_types;
    });
  }

  saveAndClose(): void
  {
    // Close the dialog
    this.matDialogRef.close();
  }

  compareVersionObjects(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  compareVersionObjectsArr(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(){
    this.submitted = true;
    if(this.form.valid){
      this.clicked = true;
      const formData = new FormData();
      formData.append("type","NULL");
      formData.append("licence_flag","0");
      formData.append("configurationId",this.data.configurationId);
      formData.append("product_id",(this.data.licenceId ? this.data.licenceId : ''));
      formData.append("product_name",this.form.get("plan_name").value);
      formData.append("product_desc",this.form.get("plan_discription").value);
      formData.append("trial_period_days",this.form.get("trial_period_days").value);
      formData.append("from_price",this.form.get("from_price").value);
      formData.append("maintenance",this.form.get("subscription_time").value);
      formData.append("ccu",this.form.get("ccu").value);
      formData.append("multiserver",this.form.get("multiserver").value);
      formData.append("licence_type",this.form.get("licence_type").value);
      // formData.append("external_id",this.form.get("external_id").value);
      this.isLoading = true;
      this.commonService.addLicenceSubscription(formData).subscribe(data => {
        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', {progressBar: true});
        this.matDialogRef.close();
        this._router.navigate(['/licence/subscription/delete']);
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this._router.navigate(['/licence/subscription/delete']);
      });
    }
  }
}
