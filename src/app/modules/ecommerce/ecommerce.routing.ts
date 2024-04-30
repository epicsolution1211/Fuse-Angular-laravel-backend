import { Route } from '@angular/router';
import { InventoryComponent } from '../ecommerce/inventory/inventory.component';
import { InventoryListComponent } from '../ecommerce/inventory/list/inventory.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from '../ecommerce/inventory/inventory.resolvers';
import { AddRoleComponent } from './add-role/add-role.component';
import { DeleteRoleComponent } from './delete-role/delete-role.component';


export const ecommerceRoutes: Route[] = [
    {
        path     : '',
        component: InventoryComponent,
        children : [
            {
                path     : '',
                component: InventoryListComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver,
                },
            },
            {
                path         : 'delete',
                component    : DeleteRoleComponent,
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
