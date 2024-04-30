import { Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-licence-maintenance',
  templateUrl: './add-licence-maintenance.component.html',
  styleUrls: ['./add-licence-maintenance.component.scss']
})

export class AddLicenceMaintenanceComponent implements OnInit {
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
  public type = [
    { "id": 0, "name": "Eshop" },
    { "id": 1, "name": "Unity" }
  ];
  public status = [
    { "id": 0, "name": "Inactive" },
    { "id": 1, "name": "Active" }
  ];
  public selectedCategory = "Atavism Server";
  public selectedType = this.type[0].id;
  public selected2 = this.status[1].id;
  public selectedVersionArr = [];

  options: Options = {
    floor: 0,
    ceil: 1000,
  };

  constructor(
    public matDialogRef: MatDialogRef<AddLicenceMaintenanceComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
  ) {

    this.form = this._formBuilder.group({
      type: ['', [Validators.required]],
      plan_name: ['', [Validators.required]],
      from_price: ['', [RxwebValidators.required(), RxwebValidators.lessThan({ fieldName: 'to_price' })]],
      to_price: ['', [RxwebValidators.required(), RxwebValidators.greaterThan({ fieldName: 'from_price' })]],
      // product_price: [[100, 500], [Validators.required]],
      maintenance: ['', [Validators.required]],
      licence_type: ['', [Validators.required]],
    });

    if (data.category) {
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
    this.commonService.getAllProducts().subscribe(res => {
      this.products = res.data.products;

      if (this.data.configurationId != undefined) {
        this.commonService.getLicenceSubscriptionById(this.data.configurationId).subscribe(res => {
          this.licence = res.data.licences;

          if (this.licence.type == 0) {
            this.productCombo = false;
            this.planName = this.licence.product_id;
            this.products.push(res.data.products[0]);
          } else {
            this.productCombo = true;
            this.planName = this.licence.product_name;
            this.selectedProduct = this.planName;
            this.selectedType = this.type[this.licence.type].id;
          }
          const productPrice = this.licence.product_price;

          // console.log("productPrice", productPrice.split(','));

          this.form = this._formBuilder.group({
            type: [this.selectedType, [Validators.required]],
            plan_name: [this.planName, [Validators.required]],
            from_price: [this.licence.from_price, [Validators.required]],
            to_price: [this.licence.to_price, [Validators.required]],
            // product_price: [[Number(productPrice.split(',')[0]), Number(productPrice.split(',')[1])], [Validators.required]],
            maintenance: [this.licence.maintenance, [Validators.required]],
            licence_type: [this.licence.licence_type, [Validators.required]],
          });
          this.cd.markForCheck();

        });
      } else {
      }
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
      formData.append("licence_flag", "2");
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
      formData.append("licence_type", this.form.get("licence_type").value);
      this.isLoading = true;
      this.commonService.addLicenceSubscription(formData).subscribe(data => {
        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        this._router.navigate(['/licence/maintenance/delete']);
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this._router.navigate(['/licence/maintenance/delete']);
      });
    }
  }
}
