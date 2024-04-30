import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateVotingPointsConfigutaionsComponent } from './create-voting-points-configutaions/create-voting-points-configutaions.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voting-point-configuration',
  templateUrl: './voting-point-configuration.component.html',
  styleUrls: ['./voting-point-configuration.component.scss']
})
export class VotingPointConfigurationComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'voting_points',
    'per_month_purchase_vote',
    'vote_purchase_price',
    'purchase_status',
    'status',
    'action'
  ];
  data: any = {};
  dataSource = new MatTableDataSource();
  isLoading = false;
  paginate = 100;
  page = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private _matDialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.commonService.votePointsConfList().subscribe(res => {
      this.data = res.data
      this.dataSource = res.data.votingPointsConfiguration
      this.spinner.hide()
    });
  }

  openComposeDialog(data = null) {
    this._matDialog.open(CreateVotingPointsConfigutaionsComponent, {
      width: '500px',
      minHeight: '420px',
      maxHeight: '500px',
      data
    })
  }

  changePurchaseStatus(id: number, status: number) {
    this.spinner.show();
    this.commonService.changePurchaseStatus({ id, status: status === 1 ? 0 : 1 }).subscribe(
      res => {
        this.commonService.votePointsConfList().subscribe(res => {
          this.data = res.data
          this.dataSource = res.data.votingPointsConfiguration
          this.spinner.hide()
        });
        this.toastr.success(res.message, "Success!", { progressBar: true });
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message, "Error");
      }
    );
  }

  updateVoteStatus(id: number, status: number) {
    this.spinner.show();
    this.commonService.changeVoteStatus({ id, status: status === 1 ? 0 : 1 }).subscribe(
      res => {
        this.commonService.votePointsConfList().subscribe(res => {
          this.data = res.data
          this.dataSource = res.data.votingPointsConfiguration
          this.spinner.hide()
        });
        this.toastr.success(res.message, "Success!", { progressBar: true });
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message, "Error");
      }
    );
  }

}
