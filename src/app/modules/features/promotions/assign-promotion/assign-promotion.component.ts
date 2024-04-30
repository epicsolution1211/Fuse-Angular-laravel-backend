import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-promotion',
  templateUrl: './assign-promotion.component.html',
  styleUrls: ['./assign-promotion.component.scss']
})

export class AssignPromotionComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  selected;
  promotion_id:any;
  promotionUsers:any;
  public usersArr = [];
  public promotion_type = [
  {"id": 0, "name": "Fixed"},
  {"id": 1, "name": "Percentage"},
  {"id": 2, "name": "Coupon"}
  ];
  public status = [
  {"id": 0, "name": "Inactive"},
  {"id": 1, "name": "Active"}
  ];
  public selectedType = this.promotion_type[0].id;
  public selected2 = this.status[1].id;
  public selectedUserArr = [];

  constructor(
    public matDialogRef: MatDialogRef<AssignPromotionComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    // console.log("data",data);
    if(data.promotion_id){
      this.promotion_id = data.promotion_id;
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      users : ['',[Validators.required]]
    });

    this.commonService.getAllUsers().subscribe(res => {
        this.usersArr = res.data.users;
    });

    if(this.promotion_id != undefined){
      this.commonService.getPromotionById(this.promotion_id).subscribe(res => {
        this.promotionUsers = res.data.promotionUsers;
        for(let i=0;i<this.promotionUsers.length;i++){
          this.selectedUserArr.push(this.promotionUsers[i].users_id);
        }
        this.form = this._formBuilder.group({
          users: [this.selectedUserArr, [Validators.required]],
        });
      });
    }
  }

  saveAndClose(): void
  {
    // Close the dialog
    this.matDialogRef.close();
  }

  compareProductObjects(object1: any, object2: any): boolean {
    return object1 && object2 && object1.id === Number(object2);
  }

  compareVersionObjectsArr(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  save(){
    this.submitted = true;
    if(this.form.valid){
      const formData = new FormData();
      formData.append("promotion_id",(this.promotion_id ? this.promotion_id : ''));
      formData.append("users",this.form.get("users").value);
      this.isLoading = true;
      this.commonService.assignPromotion(formData).subscribe(data => {
        this.submitted = false;
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', {progressBar: true});
        this.matDialogRef.close();
        this._router.navigate(['/promotions/delete']);
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this._router.navigate(['/promotions/delete']);
      });
    }
  }
}
