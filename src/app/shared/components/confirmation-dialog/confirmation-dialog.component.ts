import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
  message: string = "Are you sure?";
  confirmButtonText = "Yes";
  cancelButtonText = "Cancel";
  confirmData: any;
  reason: any = '';
  rejectActiveReason: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<ConfirmationDialog>,
    private toastr: ToastrService) {
    if (data) {
      // console.log(data);
      this.confirmData = data;
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(type): void {
    if (this.confirmData?.fromData == 'pool-reject') {
      this.rejectPoolWithReason(type);
    }
    else if (this.confirmData?.fromData == 'pool-list') {
      this.startPoolFunction()
    }
    else if (this.confirmData?.fromData == 'pool-status') {
      this.changeStatusOfPool()
    }
    else {
      this.dialogRef.close(true);
    }
  }

  rejectPoolWithReason(type) {
    // console.log(type)

    if (type == 'approve') {
      this.commonService.changepoolStatus(this.confirmData?.id, 1).subscribe(result => {
        // Handle result
        if (result.status == 'true') {
          this.toastr.success(result.message);
        } else {

        }
        this.dialogRef.close(true);

      },
        error => {
          // console.log(error);
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        });
    }
    else {
      this.rejectActiveReason = true;

      if (this.reason == '') {
        this.toastr.error('Please provide a reason');
        return;
      } else {
        const body: any = {
          "id": this.confirmData?.id,
          "comment": this.reason
        };
        this.commonService.rejectPoolFeature(body).subscribe
          (
            result => {
              // Handle result
              if (result.status == 'true') {
                this.toastr.success(result.message);
              } else {

              }
              this.dialogRef.close(true);
            },
            error => {
              // console.log(error);
              this.toastr.error(error.error.message);
            },
            () => {
              // 'onCompleted' callback.
              // No errors, route to new page here
            }
          );
      }


    }

  }

  /** Star pool function */
  startPoolFunction() {
    this.commonService.startPool(this.confirmData?.data.id).subscribe(result => {
      // Handle result
      if (result.status == 'true') {
        this.toastr.success(result.message);
      } else {

      }
      this.dialogRef.close(true);

    },
      error => {
        // console.log(error);
        this.toastr.error(error.error.message);
        this.dialogRef.close(true);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      });
  }

  /** Change status of pool */
  changeStatusOfPool() {
    this.commonService.activePool(this.confirmData?.id, 1).subscribe(result => {
      // Handle result
      if (result.status == 'true') {
        this.toastr.success(result.message);
      } else {

      }
      this.dialogRef.close(true);

    },
      error => {
        // console.log(error);
        this.toastr.error(error.error.message);
        this.dialogRef.close(true);
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      });
  }

}