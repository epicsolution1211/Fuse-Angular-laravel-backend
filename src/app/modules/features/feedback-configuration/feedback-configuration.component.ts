import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { CommonService } from 'app/shared/services/common.service';
import { AddArchieveComponent } from './add-archieve/add-archieve.component';
import { ArchieveHistoryComponent } from './archieve-history/archieve-history.component';


@Component({
    selector: 'app-feedback-configuration',
    templateUrl: './feedback-configuration.component.html',
    animations: fuseAnimations
})
export class FeedbackConfigurationComponent implements OnInit {
    form: FormGroup;
    displayedColumns: string[] = ['reason', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>();
    isLoading = false;
    submitted: boolean;
    paginate = 10;
    page = 0;
    subscriptionCancelReasonsData: any;
    features: any;
    feature_permission: any;
    current_url: any;
    /**
     * Constructor
     */
    constructor(private commonService: CommonService, private _matDialog: MatDialog, private _formBuilder: FormBuilder) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        const hash = window.location.pathname;
        const parts = hash.split('/');
        this.current_url = parts[1];
        this.current_url = this.capitalizeFirstLetter(this.current_url);
        // console.log("this.current_url",this.capitalizeFirstLetter(this.current_url));
        this.commonService.getFeatures().subscribe(res => {
            this.features = res.data.features;
            const feature_id = this.features.find(feature => feature.name == this.current_url);
            const permissions = localStorage.getItem('permissions');
            const permission_arr = JSON.parse(permissions);
            this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
            this.feature_permission = this.feature_permission.permissions;
        });
        this.commonService.getSubscriptionCancelReason(this.paginate, this.page).subscribe(res => {
            this.subscriptionCancelReasonsData = res.data;
            this.dataSource = res.data.subscriptionCancelReasons;
            // this.isLoading = false;
        });
        this.displayedColumns = ['reason', 'action'];
    }

    getServerData($event) {
        this.paginate = $event.pageSize;
        this.page = $event.pageIndex;
        this.page = this.page + 1;
        this.commonService.getSubscriptionCancelReason(this.paginate, this.page).subscribe(res => {
            this.subscriptionCancelReasonsData = res.data;
            this.dataSource = res.data.subscriptionCancelReasons;
            this.isLoading = false;
        });
    }

    sortData($event) {
        // console.log($event);
    }

    openArchiveDialogChange(id): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddArchieveComponent, {
            // height: '420px',
            // width: '1000px',
            data: { id }
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('Compose dialog was closed!');

            this.commonService.getSubscriptionCancelReason(this.paginate, this.page).subscribe(res => {
                this.subscriptionCancelReasonsData = res.data;
                this.dataSource = res.data.subscriptionCancelReasons;
                // this.isLoading = false;
            });
        });
    }

    openArchiveHistoryDialogChange(id): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(ArchieveHistoryComponent, {
            height: '620px',
            width: '1200px',
            data: { id }
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('Compose dialog was closed!');
        });
    }

    capitalizeFirstLetter(string) {
        const str = string.split("-");
        const first = str[0].charAt(0).toUpperCase() + str[0].slice(1);
        const second = str[1].charAt(0).toUpperCase() + str[1].slice(1);
        return first + ' ' + second;
        // return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
export interface PeriodicElement {
    reason: string;
}