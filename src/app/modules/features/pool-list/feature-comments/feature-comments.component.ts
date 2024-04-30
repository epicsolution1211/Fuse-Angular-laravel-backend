import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feature-comments',
  templateUrl: './feature-comments.component.html',
  styleUrls: ['./feature-comments.component.scss']
})
export class FeatureCommentsComponent implements OnInit {

  @Output() closeSideNav = new EventEmitter();
  @Input() featureData: any;
  comment: any = '';
  commentsList: any = [];
  openFromapprovedList: boolean = false;
  currentId: any;


  constructor(
    public commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) {
  }

  onToggleClose() {
    this.closeSideNav.emit();
    this.getCommentsFeature();

  }

  ngOnInit(): void {
    const retrivedUser = JSON.parse(localStorage.getItem('user'));
    this.currentId = retrivedUser.id;
    // console.log(this.closeSideNav);
    // console.log("this.featureData", this.commonService.featureData);
    this.commonService.callEventData$.subscribe((data: any) => {
      // console.log(data);
      if (data == 'approvedList') {
        this.openFromapprovedList = true;
      } else {
        this.openFromapprovedList = false;
      }
      this.getCommentsFeature();
    });
  }

  postCommentOnFeature() {
    if (this.comment != '') {
      const retrivedUser = JSON.parse(localStorage.getItem('user'));
      this.spinner.show();
      // console.log("this.featureData", this.commonService.featureData);
      const body: any = {
        pool_features_id: this.commonService.featureData.id,
        users_id: retrivedUser.id,
        comment: this.comment
      };
      this.commonService.addCommentInFeature(body).subscribe((res: any) => {
        // console.log(res);
        if (res.status == 'true') {
          this.toastr.success(res.message, 'OK');
          this.comment = '';
          this.spinner.hide();
        }
        this.getCommentsFeature();
      });
    } else {
      this.spinner.hide();
      this.toastr.error('Please add comment');
    }

  }

  /** get comments */
  getCommentsFeature() {
    this.spinner.show();
    this.commonService.getCommentsFeature(this.commonService.featureData.id).subscribe

      (
        result => {
          // Handle result
          if (result.message == 'Success') {
            this.commentsList = result.data.feature;
          } else {

          }
          this.spinner.hide();
        },
        error => {
          // console.log(error);
          this.spinner.hide();
          this.commentsList = [];
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );

  }

}
