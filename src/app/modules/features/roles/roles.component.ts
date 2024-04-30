import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
// import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from '../inventory.types';
// import { InventoryService } from '../inventory.service';
import { CommonService } from 'app/shared/services/common.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AddRoleComponent } from './add-role/add-role.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { feather } from 'app/mock-api/ui/icons/data';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
    [x: string]: any;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    products$: [];
    brands: [];
    categories: [];
    filteredTags: [];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: 10;
    productsCount: number = 0;
    productsTableColumns: string[] = ['role', 'details'];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: null;
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    vendors: [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    roles: any;
    features: any;
    permissions: any = [];
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    feature_permission;
    current_url;

    norecordFound: boolean = false;
    constructor(
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private _router: Router,
        private _matDialog: MatDialog,
        private dialog: MatDialog,
        private toastr: ToastrService) {

    }

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
        });
    }

    openComposeDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddRoleComponent, {
            width: '960px',
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
            data: { roleId },
            width: '960px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('Compose dialog was closed!');
        });
    }

    toggleDetails(productId: string): void {
        this.isLoading = true;
        this.permissions = [];
        // If the product is already selected...
        this.selectedProduct = this.roles.find(role => role.id == productId);
        const selectedProduct = this.roles.filter(role => role.id == productId);
        this.features.map(feature => {
            const permission = selectedProduct[0].permissions.find(p => p.feature_id == feature.id);

            // console.log("permission", this.permission);

            if (permission != undefined) {
                const finalPermissions = JSON.parse(permission.permissions);
                this.permissions.push({
                    'feature': feature.name,
                    'permissions': finalPermissions
                });
                this.isLoading = false;
            } else {
                this.permissions.push({
                    'feature': feature.name,
                    'permissions': []
                });
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            }
        });
    }
}
