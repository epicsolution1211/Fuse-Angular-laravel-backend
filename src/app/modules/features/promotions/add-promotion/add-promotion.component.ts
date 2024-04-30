import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})

export class AddPromotionComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  percentageHide: boolean;
  priceHide: boolean;
  selectedCombo: any;
  promotion: any;
  products: any;
  planName: any;
  url: string;
  versions: any;
  selectedProduct: any;
  selected;
  clicked = false;
  promotion_id: any;
  public promotion_type = [
    { "id": 0, "name": "Fixed" },
    { "id": 1, "name": "Percentage" },
    { "id": 2, "name": "Coupon" }
  ];
  public status = [
    { "id": 0, "name": "Inactive" },
    { "id": 1, "name": "Active" }
  ];
  public selectedType = this.promotion_type[0].id;
  public selected2 = this.status[1].id;
  public selectedVersionArr = [];

  minDate = new Date();
  minDateToFinish = new Subject<string>();


  constructor(
    public matDialogRef: MatDialogRef<AddPromotionComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
  ) {
    // console.log("data", data);
    if (data.promotion_id) {
      this.promotion_id = data.promotion_id;
    }
    this.priceHide = true;
    this.percentageHide = false;

    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.priceHide = true;
    this.percentageHide = false;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.url = parts.pop();

    // promotion
    this.form = this._formBuilder.group({
      promotion_type: ['', [Validators.required]],
      promotion_name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      promotion_status: ['', [Validators.required]],
      promotion_startDate: ['', [Validators.required]],
      promotion_endDate: ['', [Validators.required]],
    });

    // clear valiadtion
    this.form.get('percentage')?.clearValidators();
    this.form.get('percentage')?.updateValueAndValidity();

    //
    if (this.promotion_id != undefined) {
      this.commonService.getPromotion(this.promotion_id).subscribe(res => {
        this.promotion = res.data.promotion;
        if (this.promotion.promotion_type == 0) {
          this.percentageHide = false;
          this.priceHide = true;
        } else if (this.promotion.promotion_type == 1) {
          this.priceHide = false;
          this.percentageHide = true;
        } else {
          this.percentageHide = true;
          this.priceHide = false;
        }
        this.selectedType = this.promotion_type[this.promotion.promotion_type].id;
        this.form = this._formBuilder.group({
          promotion_type: [this.selectedType, [Validators.required]],
          promotion_name: [this.promotion.promotion_name, [Validators.required]],
          price: [this.promotion.price, [Validators.required]],
          percentage: [this.promotion.percentage, [Validators.required]],
          promotion_status: [this.promotion.promotion_status, [Validators.required]],
          promotion_startDate: [new Date(this.promotion.start_date)],
          promotion_endDate: [new Date(this.promotion.end_date), [Validators.required]],
        });
        this.minDate = new Date(this.promotion.start_date);
        this.form.controls.promotion_name.disable();
      });
    }
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

  // change promotion type
  changeType(event) {
    if (event.value == 0) {
      this.percentageHide = false;
      this.priceHide = true;
      this.form.get('price').validator = (Validators.compose([Validators.required]) as any);
      this.form.get('price')?.updateValueAndValidity();
      this.form.get('percentage')?.clearValidators();
      this.form.get('percentage')?.updateValueAndValidity();
    } else if (event.value == 1) {
      this.priceHide = false;
      this.percentageHide = true;
      this.form.get('percentage').validator = (Validators.compose([Validators.required]) as any);
      this.form.get('percentage')?.updateValueAndValidity();
      this.form.get('price')?.clearValidators();
      this.form.get('price')?.updateValueAndValidity();
    } else {
      this.percentageHide = true;
      this.priceHide = false;
      this.form.get('percentage').validator = (Validators.compose([Validators.required]) as any);
      this.form.get('percentage')?.updateValueAndValidity();
      this.form.get('price')?.clearValidators();
      this.form.get('price')?.updateValueAndValidity();
    }
  }

  // number only function
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // save the promotion
  save() {
    // console.log("this.form", this.form.value);
    this.submitted = true;
    if (this.form.valid) {
      this.clicked = true;
      this.form.value.promotion_startDate = new Date(this.datepipe.transform(this.form.value.promotion_startDate, 'YYYY-MM-dd h:mm:ss'));
      this.form.value.promotion_endDate = new Date(this.datepipe.transform(this.form.value.promotion_endDate, 'YYYY-MM-dd h:mm:ss'));
      // console.log(this.form.value);
      // add data in formData
      const formData = new FormData();
      formData.append("promotion_id", (this.promotion_id ? this.promotion_id : ''));
      formData.append("promotion_type", this.form.get("promotion_type").value);
      formData.append("promotion_name", this.form.get("promotion_name").value);
      if (this.form.get("price")) {
        formData.append("price", this.form.get("price").value);
      } else {
        formData.append("price", "0");
      }
      if (this.form.get("percentage")) {
        formData.append("percentage", this.form.get("percentage").value);
      } else {
        formData.append("percentage", "0");
      }
      formData.append("promotion_status", this.form.get("promotion_status").value);
      formData.append("start_date", this.datepipe.transform(this.form.get("promotion_startDate").value, 'YYYY-MM-dd h:mm:ss'));
      formData.append("end_date", this.datepipe.transform(this.form.get("promotion_endDate").value, 'YYYY-MM-dd h:mm:ss'));
      this.isLoading = true;
      this.commonService.addPromotion(formData).subscribe(data => {
        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        this._router.navigate(['/promotions/delete']);
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this._router.navigate(['/promotions/delete']);
      });
    }
  }

  /** Date change validation */
  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }
}
