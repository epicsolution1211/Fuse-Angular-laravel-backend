import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';
import { CommonService } from 'app/shared/services/common.service';

@Injectable({
    providedIn: 'root',
})

export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;
    private menuItems: any;
    public permissions: any;
    public permissionsArray: any;
    public finalPermissions = [];
    roles: any;
    role_id: any;
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService,
        private commonService: CommonService) {
        const retrivedUser = localStorage.getItem('user');
        const user = JSON.parse(retrivedUser) ?? '';
        this.role_id = user.role_id;
        if (this.role_id != undefined) {
            this.commonService.getRolePermissions(this.role_id).subscribe(res => {
                this.finalPermissions = res.data.permissions;
            });
        }
        // Set the data
        this._compactNavigation = compactNavigation;
        this._defaultNavigation = defaultNavigation;
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {

        // Navigation - GET
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                const that = this;
                const arr = [];
                // Clone the data to preserve the originals
                const compactNavigation = cloneDeep(that._compactNavigation);
                const defaultNavigation = cloneDeep(that._defaultNavigation);

                // Do some stuff with your data
                const retrivedUser = localStorage.getItem('user');
                const user = JSON.parse(retrivedUser) ?? '';
                that.role_id = user.role_id;
                that.commonService.getRolePermissions(that.role_id).subscribe(res => {
                    that.finalPermissions = res.data.permissions;
                    defaultNavigation.forEach((defaultNavItem1) => {
                        if (defaultNavItem1?.children?.length != undefined) {
                            const childrens1 = [];
                            defaultNavItem1.children.forEach((navItem) => {

                                const menuItem = that.finalPermissions.find(o => o === navItem.id);
                                if (menuItem) {
                                    childrens1.push(navItem);
                                }
                            });
                            const dnavItem: any = cloneDeep(defaultNavItem1);
                            dnavItem.children = [];
                            childrens1.forEach((item: any) => {
                                dnavItem.children.push(item);
                            });
                            if (dnavItem.children.length != 0) {
                                arr.push(dnavItem);
                            }
                        }
                    });
                });

                // Return
                return [200, {
                    compact: compactNavigation,
                    default: arr,
                }];
            });
    }
}
