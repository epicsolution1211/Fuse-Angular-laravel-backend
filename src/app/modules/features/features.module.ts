import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { AddEmployeeComponent } from './employees/add-employee/add-employee.component';
import { DeleteEmployeeComponent } from './employees/delete-employee/delete-employee.component';
import { ShowEmployeeComponent } from './employees/show-employee/show-employee.component';
import { EmployeeLicencesComponent } from './employees/employee-licences/employee-licences.component';
import { ChangeEmployeePasswordComponent } from './employees/change-password/change-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LicenceComponent } from './licence/licence.component';
import { AddUnityComponent } from './licence/add-unity/add-unity.component';
import { AddCloudComponent } from './licence/add-cloud/add-cloud.component';
import { AddLicenceSubscriptionComponent } from './licence-subscription/add-licence/add-licence-subscription.component';
import { LicencesSubscriptionComponent } from './licence-subscription/licences-subscription.component';
import { LicencesMaintenanceComponent } from './licence-maintenance/licences-miantenance.component';
import { AddLicenceMaintenanceComponent } from './licence-maintenance/add-licence-miantenance/add-licence-maintenance.component';
import { DeleteLicenceSubscriptionComponent } from './licence-subscription/delete-licence/delete-licence-subscription.component';
import { DeleteLicencePermanentComponent } from './licence-permanent/delete-licence-permanent/delete-licence-permanent.component';
import { DeleteLicenceMaintenanceComponent } from './licence-maintenance/delete-licence-maintenance/delete-licence-maintenance.component';
import { AddLicencePermanentComponent } from './licence-permanent/add-licence/add-licence-permanent.component';

import { DeletePromotionComponent } from './promotions/delete-promotion/delete-promotion.component';
import { AddPromotionComponent } from './promotions/add-promotion/add-promotion.component';
import { AssignPromotionComponent } from './promotions/assign-promotion/assign-promotion.component';
import { AssignUserPromotionComponent } from './promotions/assign-user-promotion/assign-user-promotion.component';
import { PromotionsComponent } from './promotions/promotions.component';

import { LicencesPermanentComponent } from './licence-permanent/licences-permanent.component';
import { AddSubscriptionComponent } from './licence/add-subscription/add-subscription.component';
import { CancelSubscriptionComponent } from './licence/cancel-subscription/cancel-subscription.component';
import { ChangeSubscriptionComponent } from './licence/change-subscription/change-subscription.component';
import { ConvertAllComponent } from './licence/convert-all/convert-all.component';
import { AssignMaintenanceComponent } from './licence/assign-maintenance/assign-maintenance.component';
import { ExtendMaintenanceComponent } from './licence/extend-maintenance/extend-maintenance.component';
import { SubscribeMaintenanceComponent } from './licence/subscribe-maintenance/subscribe-maintenance.component';
import { UpdateLicenceAssigneeComponent } from './licence/update-licence-assignee/update-licence-assignee.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowCustomerComponent } from './customers/show-customer/show-customer.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CustomerLicencesComponent } from './customers/customer-licences/customer-licences.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { DownloadLogsListComponent } from './download-logs-list/download-logs-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddDownloadComponent } from './downloads/add-download/add-download.component';
import { VersionsComponent } from './versions/versions.component';
import { AddVesionComponent } from './versions/add-vesion/add-vesion.component';
import { DeleteVersionComponent } from './versions/delete-version/delete-version.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { DeleteDownloadsComponent } from './downloads/delete-downloads/delete-downloads.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { DeleteCustomerComponent } from './customers/delete-customer/delete-customer.component';
import { CloudComponent } from './cloud/cloud.component';
import { ReasonHistoryComponent } from './dashboard/reason-history/reason-history.component';
import { AddArchieveComponent } from './feedback-configuration/add-archieve/add-archieve.component';
import { ArchieveHistoryComponent } from './feedback-configuration/archieve-history/archieve-history.component';
import { FeedbackConfigurationComponent } from './feedback-configuration/feedback-configuration.component';
import { SettingsComponent } from './settings/settings.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { CcuUsasesComponent } from './customers/ccu-usases/ccu-usases.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CloudPopupComponent } from './cloud/cloud-popup/cloud-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BuyServerComponent } from './cloud/buy-server/buy-server.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { EditAdvisorComponent } from './advisor/edit-advisor/edit-advisor.component';
import { ViewAdvisorComponent } from './advisor/view-advisor/view-advisor.component';
import { ConfirmModalComponent } from './customers/customer-licences/confirm-modal/confirm-modal.component';
import { VerifyCodeComponent } from './customers/customer-licences/verify-code/verify-code.component';
import { NotifyComponent } from './customers/notify/notify.component';
import { RolesComponent } from './roles/roles.component';
import { AddRoleComponent } from './roles/add-role/add-role.component';
import { DeleteRoleComponent } from './roles/delete-role/delete-role.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSliderModule } from '@angular/material/slider';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { PoolListComponent } from './pool-list/pool-list.component';
import { AddComponent } from './pool-list/add/add.component';
import { FeatureCommentsComponent } from './pool-list/feature-comments/feature-comments.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './pool-list/side-nav/side-nav.component';
import { PoolFeatureApprovedComponent } from './pool-feature-approved/pool-feature-approved.component';
import { PoolFeatureShowComponent } from './pool-feature-approved/pool-feature-show/pool-feature-show.component';
import { CreatePoolComponent } from './pool-feature-approved/create-pool/create-pool.component';
import { VotePoolComponent } from './pool-feature-approved/vote-pool/vote-pool.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { ReleasePoolFeatureComponent } from './pool-feature-approved/release-pool-feature/release-pool-feature.component';
import { MatRadioModule } from '@angular/material/radio';
import { PoolFeatureVotersComponent } from './pool-feature-approved/release-pool-feature/pool-feature-voters/pool-feature-voters.component';
import { VotingPointConfigurationComponent } from './voting-point-configuration/voting-point-configuration.component';
import { CreateVotingPointsConfigutaionsComponent } from './voting-point-configuration/create-voting-points-configutaions/create-voting-points-configutaions.component';
import { CustomRequirementsComponent } from './custom-requirements/custom-requirements.component';
import { CreateRequirementComponent } from './custom-requirements/create-requirement/create-requirement.component';
import { MakeOfferComponent } from './custom-requirements/make-offer/make-offer.component';
import { ShowOfferComponent } from './custom-requirements/show-offer/show-offer.component';
import { TicketComponent } from './ticket/ticket.component';
import { CreateTicketComponent } from './ticket/create-ticket/create-ticket.component';
import { TicketDetailsComponent } from './ticket/ticket-details/ticket-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const AdminRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'employees',
        component: EmployeesComponent,
    },
    {
        path: 'employee/delete',
        component: DeleteEmployeeComponent
    },
    {
        path: 'employee/show/:id',
        component: ShowEmployeeComponent
    },
    {
        path: 'employee/licences/:id',
        component: EmployeeLicencesComponent
    },
    {
        path: 'licences',
        component: LicenceComponent
    },
    {
        path: 'customers/licences/:id',
        component: CustomerLicencesComponent
    },
    {
        path: 'releases',
        component: VersionsComponent
    },
    {
        path: 'releases/add',
        component: AddVesionComponent
    },
    {
        path: 'releases/delete',
        component: DeleteVersionComponent
    },
    {
        path: 'downloads/latest',
        component: DownloadsComponent
    },
    {
        path: 'downloads/archived',
        component: DownloadsComponent
    },
    {
        path: 'licence/subscription',
        component: LicencesSubscriptionComponent
    },
    {
        path: 'licence/permanent',
        component: LicencesPermanentComponent
    },
    {
        path: 'licence/maintenance',
        component: LicencesMaintenanceComponent
    },
    {
        path: 'customers/downloads/logs/:id/:type',
        component: DownloadLogsListComponent
    },
    {
        path: 'employees/downloads/logs/:id/:type',
        component: DownloadLogsListComponent
    },
    {
        path: 'downloads/delete',
        component: DeleteDownloadsComponent
    },
    {
        path: 'licence/subscription/delete',
        component: DeleteLicenceSubscriptionComponent
    },
    {
        path: 'licence/permanent/delete',
        component: DeleteLicencePermanentComponent
    },
    {
        path: 'licence/maintenance/delete',
        component: DeleteLicenceMaintenanceComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'customers/show/:id',
        component: ShowCustomerComponent
    },
    {
        path: 'customers/delete',
        component: DeleteCustomerComponent
    },
    {
        path: 'cloud',
        component: CloudComponent
    },
    {
        path: 'feedback-configuration',
        component: FeedbackConfigurationComponent
    },
    {
        path: 'promotions',
        component: PromotionsComponent
    },
    {
        path: 'promotions/delete',
        component: DeletePromotionComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'advisor',
        component: AdvisorComponent
    },
    {
        path: 'roles',
        component: RolesComponent
    },
    {
        path: 'roles/delete',
        component: DeleteRoleComponent
    },
    {
        path: 'pool',
        component: PoolListComponent
    },
    {
        path: 'feature_pool',
        component: PoolFeatureApprovedComponent
    },
    {
        path: 'feature_pool/show/:id',
        component: PoolFeatureShowComponent
    },
    {
        path: 'voting-points-configuration',
        component: VotingPointConfigurationComponent
    },
    {
        path: 'custom-requirements',
        component: CustomRequirementsComponent
    },
    {
        path: 'tickets',
        component: TicketComponent
    },
];

@NgModule({
    declarations: [
        DashboardComponent,
        EmployeesComponent,
        AddEmployeeComponent,
        EmployeeLicencesComponent,
        ShowEmployeeComponent,
        DeleteEmployeeComponent,
        ChangeEmployeePasswordComponent,
        LicenceComponent,
        AddUnityComponent,
        AddCloudComponent,
        AddLicenceSubscriptionComponent,
        AddLicencePermanentComponent,
        LicencesSubscriptionComponent,
        LicencesPermanentComponent,
        ConvertAllComponent,
        AssignMaintenanceComponent,
        ExtendMaintenanceComponent,
        SubscribeMaintenanceComponent,
        UpdateLicenceAssigneeComponent,
        AddSubscriptionComponent,
        ChangeSubscriptionComponent,
        CancelSubscriptionComponent,
        ShowCustomerComponent,
        ChangePasswordComponent,
        DownloadsComponent,
        AddDownloadComponent,
        VersionsComponent,
        AddVesionComponent,
        DeleteVersionComponent,
        DeleteDownloadsComponent,
        DeleteLicenceSubscriptionComponent,
        DeleteLicencePermanentComponent,
        CustomersComponent,
        AddCustomerComponent,
        DeleteCustomerComponent,
        DownloadLogsListComponent,
        CustomerLicencesComponent,
        CloudComponent,
        AddArchieveComponent,
        ArchieveHistoryComponent,
        FeedbackConfigurationComponent,
        ReasonHistoryComponent,
        LicencesMaintenanceComponent,
        AddLicenceMaintenanceComponent,
        DeleteLicenceMaintenanceComponent,
        PromotionsComponent,
        AddPromotionComponent,
        AssignPromotionComponent,
        AssignUserPromotionComponent,
        DeletePromotionComponent,
        SettingsComponent,
        CcuUsasesComponent,
        CloudPopupComponent,
        BuyServerComponent,
        AdvisorComponent,
        RolesComponent,
        AddRoleComponent,
        DeleteRoleComponent,
        EditAdvisorComponent,
        ViewAdvisorComponent,
        ConfirmModalComponent,
        VerifyCodeComponent,
        NotifyComponent,
        PoolListComponent,
        AddComponent,
        FeatureCommentsComponent,
        SideNavComponent,
        PoolFeatureApprovedComponent,
        CreatePoolComponent,
        VotePoolComponent,
        ReleasePoolFeatureComponent,
        PoolFeatureShowComponent,
        PoolFeatureVotersComponent,
        VotingPointConfigurationComponent,
        CreateVotingPointsConfigutaionsComponent,
        CustomRequirementsComponent,
        CreateRequirementComponent,
        MakeOfferComponent,
        ShowOfferComponent,
        TicketComponent,
        CreateTicketComponent,
        TicketDetailsComponent,
    ],
    imports: [
        RouterModule.forChild(AdminRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        CdkTableModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatTabsModule,
        NgApexchartsModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatAutocompleteModule,
        FilterPipeModule,
        NgxSpinnerModule,
        Daterangepicker,
        MatDialogModule,
        NgSelectModule,
        MatSliderModule,
        
        MatSidenavModule,
        NgxStarRatingModule,
        MatRadioModule
        // BrowserAnimationsModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        MatInputModule
    ]
})
export class FeaturesModule {
    //
}
