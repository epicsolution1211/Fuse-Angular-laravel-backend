import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Optional, ViewChild} from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pool-feature-voters',
  templateUrl: './pool-feature-voters.component.html',
  styleUrls: ['./pool-feature-voters.component.scss']
})
export class PoolFeatureVotersComponent implements OnInit {
  isLoading: boolean;
  voters: any[]
  dataSource = new MatTableDataSource<any>();
  
  displayedColumns: string[] = ['username', 'votesCount'];

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) { this.dataSource.paginator = value; }
  @ViewChild(MatSort) set sort(value: MatSort) { this.dataSource.sort = value; }
  paginate = 10;
  page = 0;
  constructor(
    public matDialogRef: MatDialogRef<PoolFeatureVotersComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  saveAndClose(): void {
    this.matDialogRef.close(true);
  }
  ngOnInit(): void {

    this.isLoading = true;
    
    this.commonService.getVotesPoolFeatureVoters(this.data.data.pool_id,this.data.data.id).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data.pool_features);
      console.log(this.dataSource);
      
      this.voters = res.data.pool_features;
      this.isLoading = false;
      
    })
  }

}
