import { OnInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'download-logs-list',
  styleUrls: ['download-logs-list.component.css'],
  templateUrl: 'download-logs-list.component.html',
})
export class DownloadLogsListComponent implements OnInit {
  // displayedColumns: string[] = ['id', 'user_id', 'download_id', 'version', 'download_date'];
  displayedColumns: string[] = ['user_id', 'version', 'download_date'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  paginate = 20;
  page = 1;
  isLoading: boolean;
  downloads: any;
  id: any;
  slug: any;
  type: any;
  filter: FormControl = new FormControl();
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private commonService: CommonService) { }
  ngOnInit() {
    this.isLoading = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.id = parts[4];
    this.slug = parts[5];
    this.type = capitalizeFirstLetter(parts[5]);
    this.commonService.downloadLogsList(this.paginate, this.page, "", "", "", this.id).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.isLoading = false;
    });
    this.searchInputControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });
  }

  getServerData($event) {
    if (this.paginate != $event.pageSize) {
      this.page = 1;
    }
    this.paginate = $event.pageSize;
    this.page = $event.pageIndex;
    this.page = this.page + 1;
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.id = parts[4];
    this.commonService.downloadLogsList(this.paginate, this.page, "", "", "", this.id).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.isLoading = false;
    });

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.paginator.page.pipe(
    //     tap(() => this.loadLessonsPage())
    // ).subscribe();
  }
  searching() {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.id = parts[4];
    this.commonService.downloadLogsList(this.paginate, this.page, "", "", "", this.id).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.isLoading = false;
    });
  }
  filerData(val) {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.id = parts[4];
    this.commonService.downloadLogsList(this.paginate, this.page, val, "", "", this.id).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.isLoading = false;
    });
  }
  sortData($event) {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    this.id = parts[4];
    this.commonService.downloadLogsList(this.paginate, this.page, "", $event.active, $event.direction, this.id).subscribe(res => {
      this.downloads = res.data;
      this.dataSource = res.data.downloads;
      this.isLoading = false;
    });
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface PeriodicElement {
  id: string;
  user_id: string;
  download_id: string;
  version: string;
  download_date: string;
}

