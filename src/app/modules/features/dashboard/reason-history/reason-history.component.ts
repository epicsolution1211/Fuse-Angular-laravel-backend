import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reason-history',
  templateUrl: './reason-history.component.html',
  styleUrls: ['./reason-history.component.scss']
})
export class ReasonHistoryComponent implements OnInit {
  paginate = 100000;
  page = 0;
  isLoading: boolean;
  subscriptionCancelReasonsData:any;
  displayedColumns: string[] = ['licence_key','username'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  id:any;
  archieve_id:any;
  userId:any;
  from:any;
  to:any;
  type:any;
  constructor(
    public matDialogRef: MatDialogRef<ReasonHistoryComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.archieve_id){
      this.archieve_id = data.archieve_id;
    }
    if(data.userId){
      this.userId = data.userId;
    }
    if(data.from && data.to){
      this.from = data.from;
      this.to = data.to;
    }
    if(data.id){
      this.id = data.id;
    }
    if(data.type){
      this.type = data.type;
    }
  }

  ngOnInit(): void {
    this.commonService.getFeedbackByReasons(this.paginate,this.page,'',this.id,this.archieve_id,this.userId,this.from,this.to,this.type).subscribe(res => {
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
  username: string;
}