import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-user-promotion',
  templateUrl: './assign-user-promotion.component.html',
  styleUrls: ['./assign-user-promotion.component.scss']
})

export class AssignUserPromotionComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  paginate = 10;
  page = 0;
  selected;
  user_id: any;
  promotionUsers: any;
  public promotionArr = [];
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
  public selectedUserArr = [];

  assignUserObj: any = {};

  constructor(
    public matDialogRef: MatDialogRef<AssignUserPromotionComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.user_id) {
      this.user_id = data.user_id;
    }

    // console.log(this.user_id);

    this.assignUserObj.nextButton = false;
    this.assignUserObj.isDisabled = true;
    this.assignUserObj.mailCard = false;
    this.assignUserObj.notificationCard = false;
    this.assignUserObj.textCard = false;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      promotions: ['', [Validators.required]],
    });

    this.commonService.getPromotions(this.paginate, this.page).subscribe(res => {
      this.promotionArr = res.data.promotions;

      // console.log("this.promotionArr", this.promotionArr);

      this.promotionArr = this.promotionArr.filter((fl) => {
        return fl.promotion_status !== 0;
      });

      this.isLoading = false;
    });

    if (this.user_id.length == 1) {
      this.commonService.getUserPromotionById(this.user_id).subscribe(res => {
        this.promotionUsers = res.data.promotionUsers;
        for (let i = 0; i < this.promotionUsers.length; i++) {
          this.selectedUserArr.push(this.promotionUsers[i].promotions_id);
        }
        if (this.selectedUserArr.length != 0) {
          this.assignUserObj.isDisabled = false;
        }
        this.form = this._formBuilder.group({
          promotions: [this.selectedUserArr, [Validators.required]],
        });
      });
    }
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  someMethod(event) {
    // console.log(event);
  }

  save() {


    const notify = [];

    if (this.assignUserObj.mailCard) {
      notify.push(1);
    }
    if (this.assignUserObj.notificationCard) {
      notify.push(0);
    }


    this.submitted = true;
    if (this.form.valid) {
      // const formData = new FormData();
      const parameter =
      {
        "user_id": this.user_id.toString(), // if multiple then "1,2,3" like this
        "promotions": this.form.get("promotions").value.toString(), // if multiple then "1,2,3" like this
        "notify_flag": notify.toString() // if multiple then "0,1" like this if single then "0 OR 1"
      };


      // formData.append("user_id", (this.user_id ? this.user_id : ''));
      // formData.append("promotions", this.form.get("promotions").value);
      this.isLoading = true;
      this.commonService.assignUserPromotion(parameter).subscribe((data: any) => {

        // console.log(data);

        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        this._router.navigate(['/customers/delete']);
      }, (error: any) => {

        if (error.status === 200) {
          this.submitted = false;
          this.isLoading = false;
          this.toastr.success('Successfully assigned promotion', 'Success!', { progressBar: true });
          this.matDialogRef.close();
          this._router.navigate(['/customers/delete']);
        } else {
          // console.log(error);
          this.isLoading = false;
          this.toastr.error(error.error.message, 'Error');
          this._router.navigate(['/customers/delete']);
        }


      });
    }
  }

  /** Next step */
  nextPrevious(type: string): void {

    if (this.form.get("promotions").value.length == 0) {
      this.toastr.error("Promotion selection is required", 'Error');
    } else {
      if (type === 'next') {
        this.assignUserObj.nextButton = true;
      } else {
        this.assignUserObj.nextButton = false;
      }
    }

  }

  /** Select Card */
  selectCard(type: string) {
    if (type === 'notification') {
      this.assignUserObj.notificationCard = !this.assignUserObj.notificationCard;

    } else if (type === 'mail') {
      this.assignUserObj.mailCard = !this.assignUserObj.mailCard;

    } else if (type === 'text') {
      this.assignUserObj.textCard = !this.assignUserObj.textCard;
    }

  }
}
