/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

// this is getting called for classy
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'statastics',
        title: 'Statastics',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboard'
            },
        ],
    },
    {
        id: 'administrative',
        title: 'Administrative',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'roles',
                title: 'Roles',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/roles'
            },
            {
                id: 'employees',
                title: 'Employees',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/employees'
            },
            {
                id: 'customers',
                title: 'Customers',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/customers'
            },
        ],
    },
    {
        id: 'managment',
        title: 'Managment',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'cloud',
                title: 'Cloud',
                type: 'basic',
                icon: 'heroicons_outline:cloud',
                link: '/cloud'
            },
            {
                id: 'downloads',
                title: 'Downloads',
                type: 'collapsable',
                icon: 'heroicons_outline:download',
                children: [
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Latest',
                        type: 'basic',
                        link: '/downloads/latest'
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Archived',
                        type: 'basic',
                        link: '/downloads/archived'
                    }/*,
                    {
                        id   : 'apps.ecommerce.inventory',
                        title: 'Downloads Logs',
                        type : 'basic',
                        link : '/downloads/logs'
                    }*/
                ]
            },
            {
                id: 'Licences Management',
                title: 'Licences Management',
                type: 'collapsable',
                icon: 'heroicons_outline:download',
                children: [
                    {
                        id: 'apps.ecommerce.subscription',
                        title: 'Subscription Licences',
                        type: 'basic',
                        link: '/licence/subscription'
                    },
                    {
                        id: 'apps.ecommerce.permanent',
                        title: 'Permanent Licences',
                        type: 'basic',
                        link: '/licence/permanent'
                    },
                    {
                        id: 'apps.ecommerce.maintenance',
                        title: 'Licence Maintenance',
                        type: 'basic',
                        link: '/licence/maintenance'
                    }
                ]
            },
            {
                id: 'releases',
                title: 'Releases',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/releases'
            },
            {
                id: 'Feedback Configuration',
                title: 'Feedback Configuration',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/feedback-configuration'
            },
            {
                id: 'Promotion',
                title: 'Promotion',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/promotions'
            },
        ],
    },
    {
        id: 'licences',
        title: 'Licences',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'licences',
                title: 'Licences',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/licences'
            },
        ],
    },
    {
        id: 'pool',
        title: 'Pool Managment',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'feature requests',
                title: 'Request Feature',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/pool'
            },

            {
                id: 'pool',
                title: 'Pool',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/feature_pool'
            },
            {
                id: 'Voting Points Configurations',
                title: 'Voting Points Configuration',
                type: 'basic',
                icon: 'heroicons_outline:identification',
                link: '/voting-points-configuration'
            },
        ],
    },
    {
        id: 'requirements',
        title: 'Requirements',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        children: [
            {
                id: 'requirements',
                title: 'Custom requirement',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/custom-requirements'
            },
        ],
    },
    {
        id: 'tickets',
        title: 'Tickets',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        children: [
            {
                id: 'tickets',
                title: 'Tickets',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/tickets'
            },
        ],
    },
];

// export const superadminNavigation: FuseNavigationItem[] = [
//     {
//     id      : 'statastics',
//     title   : 'Statastics',
//     subtitle: 'Unique dashboard designs',
//     type    : 'group',
//     icon    : 'heroicons_outline:home',
//         children: [
//             {
//                 id   : 'dashboard',
//                 title: 'Dashboard',
//                 type : 'basic',
//                 icon : 'heroicons_outline:chart-pie',
//                 link : '/superadmin/dashboard'
//             },
//         ],
//     },
//     {
//     id      : 'administrative',
//     title   : 'Administrative',
//     subtitle: 'Unique dashboard designs',
//     type    : 'group',
//     icon    : 'heroicons_outline:home',
//         children: [
//             {
//                 id   : 'role',
//                 title: 'Role',
//                 type : 'basic',
//                 icon : 'heroicons_outline:chart-pie',
//                 link : '/superadmin/roles'
//             },
//             {
//                 id   : 'users',
//                 title: 'Users',
//                 type : 'basic',
//                 icon : 'heroicons_outline:chart-pie',
//                 link : '/superadmin/roles'
//             },
//         ],
//     },

// ];

// export const adminNavigation: FuseNavigationItem[] = [
//     {
//         id      : 'statastics',
//         title   : 'Statastics',
//         subtitle: 'Unique dashboard designs',
//         type    : 'group',
//         icon    : 'heroicons_outline:home',
//             children: [
//                 {
//                     id   : 'dashboard',
//                     title: 'Dashboard',
//                     type : 'basic',
//                     icon : 'heroicons_outline:chart-pie',
//                     link : '/admin/dashboard'
//                 },
//             ],
//         },
//         {
//         id      : 'administrative',
//         title   : 'Administrative',
//         subtitle: 'Unique dashboard designs',
//         type    : 'group',
//         icon    : 'heroicons_outline:home',
//             children: [
//                 {
//                     id   : 'users',
//                     title: 'Users',
//                     type : 'basic',
//                     icon : 'heroicons_outline:chart-pie',
//                     link : '/superadmin/roles'
//                 },
//             ],
//         },
// ];

// export const employeeNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'dashboard',
//         title: 'Dashboard',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/employee/dashboard'
//     },
// ];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
