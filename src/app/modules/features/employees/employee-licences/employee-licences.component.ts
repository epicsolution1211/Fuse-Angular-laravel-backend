import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-employee-licences',
  templateUrl: './employee-licences.component.html',
  styleUrls: ['./employee-licences.component.scss']
})
export class EmployeeLicencesComponent implements OnInit {
  isLoading: boolean = false;
  userId: any;
  licences: any;
  displayedColumns: string[] = ['licence_key', 'maintenance_expire', 'server_keepalive','buy_date','activationDate','server_address'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  paginate = 10;
  page = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _matDialog: MatDialog,
      private commonService: CommonService,
      private route: ActivatedRoute,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.userId = this.route.snapshot.params.id;
    this.commonService.getUserLicences(this.userId,this.paginate,this.page).subscribe(res => {
        this.licences = res.data;
        this.dataSource = res.data.licences;
        this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getServerData($event){
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    this.commonService.getUserLicences(this.userId,this.paginate,this.page).subscribe(res => {
      this.licences = res.data;
      this.dataSource = res.data.licences;
      this.isLoading = false;
    });
  }
}

export interface PeriodicElement {
  licence_key: string;
  maintenance_expire: string;
  server_keepalive: string;
  buy_date:string;
  activationDate:string;
  server_address:string;
}