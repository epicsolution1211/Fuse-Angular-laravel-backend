import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-archieve-history',
  templateUrl: './archieve-history.component.html',
  styleUrls: ['./archieve-history.component.scss']
})
export class ArchieveHistoryComponent implements OnInit {
  paginate = 10;
  page = 0;
  isLoading: boolean;
  subscriptionCancelReasonsData:any;
  displayedColumns: string[] = ['reason'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  id:any;
  constructor(
    public matDialogRef: MatDialogRef<ArchieveHistoryComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.id){
      this.id = data.id;
    }
  }

  ngOnInit(): void {
    this.commonService.getSubscriptionCancelReason(this.paginate,this.page,'',this.id).subscribe(res => {
        this.subscriptionCancelReasonsData = res.data;
        this.dataSource = res.data.subscriptionCancelReasons;
        this.isLoading = false;
    });
  }

  saveAndClose(): void
  {
    // Close the dialog
    this.matDialogRef.close();
  }

  sortData($event){
    // console.log($event);
  }
}
export interface PeriodicElement {
  reason: string;
}