import { Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-licence-permanent',
  templateUrl: './add-licence-permanent.component.html',
  styleUrls: ['./add-licence-permanent.component.scss']
})

export class AddLicencePermanentComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  productCombo: boolean;
  selectedCombo: any;
  licence: any;
  products: any = [];
  planName: any;
  url: string;
  versions: any;
  selectedProduct: any;
  selected;
  clicked = false;
  productPrice: any;
  public type = [
    { "id": 0, "name": "Eshop" },
    { "id": 1, "name": "Unity" }
  ];
  public multiserver = [
    { "id": 0, "name": "No" },
    { "id": 1, "name": "Yes" }
  ];
  public status = [
    { "id": 0, "name": "Inactive" },
    { "id": 1, "name": "Active" }
  ];
  options: Options = {
    floor: 0,
    ceil: 1000,
  };
  public selectedCategory = "Atavism Server";
  public selectedMutliserver2 = this.multiserver[1].id;
  public selectedType = this.type[0].id;
  public selected2 = this.status[1].id;
  public selectedVersionArr = [];

  constructor(
    public matDialogRef: MatDialogRef<AddLicencePermanentComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
  ) {

    if (data.category) {
      this.selectedCategory = data.category;
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      type: ['', [Validators.required]],
      plan_name: ['', [Validators.required]],
      from_price: ['', [RxwebValidators.required(), RxwebValidators.lessThan({ fieldName: 'to_price' })]],
      to_price: ['', [RxwebValidators.required(), RxwebValidators.greaterThan({ fieldName: 'from_price' })]],
      // product_price: [[10, 500], [Validators.required]],
      ccu: ['', [Validators.required]],
      maintenance: ['', [Validators.required]],
      multiserver: ['', [Validators.required]],
      licence_type: ['', [Validators.required]],
    });

    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.url = parts.pop();

    /*if(this.data.configurationId != undefined){
      this.commonService.getAllProductsEdit(this.data.configurationId).subscribe(res => {
        this.products = res.data.products;
      });
    }else{
      this.commonService.getAllProducts().subscribe(res => {
        this.products = res.data.products;
      });
    }*/
    this.commonService.getAllProducts().subscribe(res => {
      this.products = res.data.products;


      if (this.data.configurationId != undefined) {
        this.commonService.getLicenceSubscriptionById(this.data.configurationId).subscribe(res => {
          this.licence = res.data.licences;
          if (this.licence.type == 0) {
            this.productCombo = false;
            this.planName = this.licence.product_id;
            // this.selectedProduct = this.licence.product_name;
            this.products.push(res.data.products[0]);
          } else {
            this.productCombo = true;
            this.planName = this.licence.product_name;
            this.selectedProduct = this.licence.product_name;
          }
          this.selectedType = this.type[this.licence.type].id;
          // this.productPrice = this.licence.product_price;
          this.form = this._formBuilder.group({
            type: [this.selectedType, [Validators.required]],
            plan_name: [this.planName, [Validators.required]],
            from_price: [this.licence.from_price, [Validators.required]],
            to_price: [this.licence.to_price, [Validators.required]],
            // product_price: [[Number(this.productPrice.split(',')[0]), Number(this.productPrice.split(',')[1])], [Validators.required]],
            ccu: [this.licence.concurrent_connections, [Validators.required]],
            maintenance: [this.licence.maintenance, [Validators.required]],
            multiserver: [this.licence.multiserver, [Validators.required]],
            licence_type: [this.licence.licence_type, [Validators.required]],
          });
        });
      }

      this.cd.markForCheck();
    });


    this.commonService.getLicencesTypes().subscribe(res => {
      this.licences = res.data.licence_types;
    });
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  compareProductObjects(object1: any, object2: any): boolean {
    return object1 && object2 && object1.id === Number(object2);
  }

  compareVersionObjectsArr(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  changeType(event, selectedProduct) {
    if (event) {
      this.productCombo = true;
    } else {
      this.productCombo = false;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.clicked = true;
      const formData = new FormData();
      formData.append("configurationId", this.data.configurationId);
      formData.append("licence_flag", "1");
      formData.append("type", this.form.get("type").value);
      formData.append("product_id", (this.data.licenceId ? this.data.licenceId : ''));
      if (this.form.value.plan_name.id) {
        formData.append("product_name", this.form.value.plan_name.id);
      } else {
        formData.append("product_name", this.form.get("plan_name").value);
      }
      // formData.append("product_price", this.form.get("product_price").value);
      formData.append("from_price", this.form.get("from_price").value);
      formData.append("to_price", this.form.get("to_price").value);
      formData.append("maintenance", this.form.get("maintenance").value);
      formData.append("ccu", this.form.get("ccu").value);
      formData.append("multiserver", this.form.get("multiserver").value);
      formData.append("licence_type", this.form.get("licence_type").value);
      this.isLoading = true;
      this.commonService.addLicenceSubscription(formData).subscribe(data => {
        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        this._router.navigate(['/licence/permanent/delete']);
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this._router.navigate(['/licence/permanent/delete']);
      });
    }
  }
}
