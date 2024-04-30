import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from '../inventory.types';
import { InventoryService } from '../inventory.service';
import { CommonService } from 'app/shared/services/common.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AddRoleComponent } from '../../add-role/add-role.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { feather } from 'app/mock-api/ui/icons/data';


@Component({
    selector: 'inventory-list',
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class InventoryListComponent implements OnInit, AfterViewInit, OnDestroy {
    [x: string]: any;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    productsCount: number = 0;
    productsTableColumns: string[] = ['role', 'details'];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    roles: any;
    features: any;
    permissions: any = [];
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    feature_permission;
    current_url;

    norecordFound: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private _router: Router,
        private _matDialog: MatDialog,
        private dialog: MatDialog,
        private toastr: ToastrService,
    ) {
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

        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            role: [''],
        });

        // this.isLoading = true;
        this.commonService.getroles().subscribe(res => {
            this.roles = res.data.roles;
            if (this.roles.length == 0) {
                this.norecordFound = true;
            }
            // this.isLoading = false;
        });

        // this.isLoading = true;
        this.commonService.getFeatures().subscribe(res => {
            this.features = res.data.features;
            const feature_id = this.features.find(feature => feature.name == this.current_url);
            const permissions = localStorage.getItem('permissions');
            const permission_arr = JSON.parse(permissions);
            this.feature_permission = permission_arr.find(p => p.feature_id == feature_id.id);
            this.feature_permission = this.feature_permission.permissions;
            // this.isLoading = false;
            // console.log(this.feature_permission);
        });

        // // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    // this.isLoading = true;
                    return this.roles.getProducts(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // If the user changes the sort order...
        // this._sort.sortChange
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         // Reset back to the first page
        //         this._paginator.pageIndex = 0;

        //         // Close the details
        //         this.closeDetails();
        //     });

        // // Get products if sort or page changes
        // merge(this._sort.sortChange, this._paginator.page).pipe(
        //     switchMap(() => {
        //         this.closeDetails();
        //         this.isLoading = true;
        //         return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
        //     }),
        //     map(() => {
        //         this.isLoading = false;
        //     })
        // ).subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void {
        this.permissions = [];
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        this.selectedProduct = this.roles.find(role => role.id == productId);
        const selectedProduct = this.roles.filter(role => role.id == productId);

        this.features.map(feature => {
            const permission = selectedProduct[0].permissions.find(p => p.feature_id == feature.id);
            if (permission != undefined) {
                const finalPermissions = JSON.parse(permission.permissions);
                this.permissions.push({
                    'feature': feature.name,
                    'permissions': finalPermissions
                });
            } else {
                this.permissions.push({
                    'feature': feature.name,
                    'permissions': []
                });
            }
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openComposeDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddRoleComponent);

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('Compose dialog was closed!');
        });
    }

    openDialog(roleId) {
        // console.log(roleId);
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete this role?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.commonService.deleteRole(roleId).subscribe(res => {
                    this.toastr.success(res.message, 'OK');
                    this.isLoading = false;
                    this._router.navigate(['/roles/delete']);
                }, (err) => {
                    // console.log(err);
                    this.toastr.error(err.error.message);
                });
                const a = document.createElement('a');
                a.click();
                a.remove();
            }
        });
    }

    openEditDialog(roleId): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddRoleComponent, {
            data: { roleId }
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('Compose dialog was closed!');
        });
    }
}
