import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-show-offer',
  templateUrl: './show-offer.component.html',
  styleUrls: ['./show-offer.component.scss']
})
export class ShowOfferComponent implements OnInit {
  apidata: any;
  userRole: any;
  constructor(
    public matDialogRef: MatDialogRef<ShowOfferComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.userRole = retrivedUser.role_id;
    this.getOffer(this.data?.custom_requirement_id)
  }

  getOffer(id: any) {
    this.spinner.show();
    this.commonService.showOffer(id).subscribe(
      result => {
        this.apidata = result.data;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    )
  }

  acceptOffer() {
    this.spinner.show();
    this.commonService.PaymentCustomRequirement(this.apidata).subscribe((res) => {
      window.location.href = res.data;
      this.spinner.hide();
    });
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }
}
