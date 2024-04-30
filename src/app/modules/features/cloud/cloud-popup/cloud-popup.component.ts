import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cloud-popup',
  templateUrl: './cloud-popup.component.html',
  styleUrls: ['./cloud-popup.component.scss']
})
export class CloudPopupComponent implements OnInit {

  dialogContent: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CloudPopupComponent>) {
    if (data) {
      this.dialogContent = data.dialogData;
      // console.log(data);
    }
  }

  onConfirmClick(): void {
    const afterAction: any = {};
    if (this.dialogContent.startVPS) {
      afterAction.startVPS = true;
    } else if (this.dialogContent.stopVPS) {
      afterAction.stopVPS = true;
    } else if (this.dialogContent.restartVPS) {
      afterAction.restartVPS = true;
    } else if (this.dialogContent.logoutVPS) {
      afterAction.logoutVPS = true;
    }
    this.dialogRef.close(afterAction);

  }

  ngOnInit(): void {
  }

}
