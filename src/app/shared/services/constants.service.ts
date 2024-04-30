import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly API_URL: string = `${environment.apiUrl}` + "/";
  readonly BASE_PATH: string = `${environment.base_path}`;
  readonly LOGIN: string = this.API_URL + "login";
  readonly SIGNIN_Cloud: string = this.API_URL + "signin-cloud";
  readonly FACEBOOK_LOGIN: string = this.API_URL + "facebook-login";
  readonly REFREST_ACCESS_TOKEN: string = this.API_URL + "refresh-access-token";
  readonly LOGOUT: string = this.API_URL + "logout";
  readonly ROLES: string = this.API_URL + "roles";
  readonly ROLE_BY_ID: string = this.API_URL + "role";
  readonly ROLE_PERMISSIONS: string = this.API_URL + "permissions";
  readonly ROLE_PERMISSIONS_BY_USER: string = this.API_URL + "permissionsByUser";
  readonly ALL_FEATURES: string = this.API_URL + "features";
  readonly ADD_ROLE: string = this.API_URL + "add-role";
  readonly DELETE_ROLE: string = this.API_URL + "delete-role";
  readonly EMPLOYEES: string = this.API_URL + "employee";
  readonly CHANGE_EMPLOYEE_PASSWORD: string = this.API_URL + "change-employee-password";
  readonly UPDATE_EMPLOYEE_PASSWORD: string = this.API_URL + "update-employee-password";
  readonly DELETE_EMPLOYEE: string = this.API_URL + "delete-employee";
  readonly ADD_EMPLOYEE: string = this.API_URL + "add-employee";
  readonly EDIT_EMPLOYEE: string = this.API_URL + "employee";
  readonly EMPLOYEE_FILTER: string = this.API_URL + "employee-filter";
  readonly EMPLOYEE_LICENCES: string = this.API_URL + "employee-licences";
  readonly CHANGE_EMPLOYEE_STATUS = this.API_URL + "employee-status";
  readonly LANGUAGES: string = this.API_URL + "languages";
  readonly CHANGE_PASSWORD: string = this.API_URL + "change-password";
  readonly UPDATE_PASSWORD: string = this.API_URL + "update-password";
  readonly CHECK_PASSWORD: string = this.API_URL + "check-password";
  readonly DOWNLOADS: string = this.API_URL + "downloads";
  readonly GET_LICENCES: string = this.API_URL + "licences";
  readonly ADD_LICENCE_SUBSCRIPTION: string = this.API_URL + "add-licence-subscription";
  readonly DELETE_LICENCE_SUBSCRIPTION: string = this.API_URL + "delete-licence-subscription";
  readonly CHANGE_LICENCE_SUBSCRIPTION_STATUS: string = this.API_URL + "change-licence-subscription-status";

  readonly DOWNLOAD_LOGS: string = this.API_URL + "download-log";
  readonly DOWNLOAD_LOGS_LIST: string = this.API_URL + "download-log-list";
  readonly THEME_CHANGE: string = this.API_URL + "theme-change";
  readonly SCHEME_CHANGE: string = this.API_URL + "scheme-change";
  readonly VERSIONS: string = this.API_URL + "versions";
  readonly ALL_VERSIONS: string = this.API_URL + "all-versions";

  readonly RESET_PASSWORD_REQUEST = this.API_URL + "reset-password-request";
  readonly ADD_VERSION: string = this.API_URL + "add-version";
  readonly DELETE_VERSION: string = this.API_URL + "delete-version";
  readonly EDIT_VERSION: string = this.API_URL + "version";
  readonly ALL_COUNT: string = this.API_URL + "all-count";
  readonly GET_CHART_DATA: string = this.API_URL + "get-chart-data";

  readonly LICENCES_TYPES: string = this.API_URL + "licences-types";
  readonly LICENCE_TYPES: string = this.API_URL + "licence-types";
  readonly ADD_DOWNLOADS: string = this.API_URL + "add-download";
  readonly DOWNLOAD_STATUS: string = this.API_URL + "status-download";
  readonly DOWNLOAD_DELETE: string = this.API_URL + "delete-download";
  readonly EDIT_DOWNLOAD: string = this.API_URL + "download";

  readonly GET_LICENCE_SUBSCRIPTION_BY_ID: string = this.API_URL + "licences";
  readonly GET_ALL_PRODUCTS: string = this.API_URL + "get-all-products";
  readonly GET_ALL_PRODUCTS_EDIT: string = this.API_URL + "get-all-products-edit";

  readonly GET_LICENCE_BY_ID: string = this.API_URL + "licence";
  readonly GET_CANCEL_SUBSCRIPTION: string = this.API_URL + "getCancelSubscription";
  readonly GET_LICENCE_BY_ID_WITH_MAINTENANCE: string = this.API_URL + "getMaintenancesForLicence";
  readonly ASSIGN_MAINTENACE: string = this.API_URL + "assignMaintenance";
  readonly EXTEND_MAINTENACE: string = this.API_URL + "extendMaintenance";
  readonly SUBSCRIPTION_MAINTENACE: string = this.API_URL + "subscriptionMaintenance";
  readonly UPDATE_LICENCE: string = this.API_URL + "updateLicence";
  readonly CONVERT_ALL: string = this.API_URL + "convertAll";
  readonly CANCEL_SUBSCRIPTION: string = this.API_URL + "cancelSubscription";
  readonly ADD_SUBSCRIPTION: string = this.API_URL + 'add-subscription';
  readonly CHANGE_SUBSCRIPTION: string = this.API_URL + 'change-subscription';
  readonly ADD_UNITY_LICENCE: string = this.API_URL + 'addUnityLicence';
  readonly GET_CHANGE_SUBSCRIPTION_DATA: string = this.API_URL + 'getChangeSubscriptionData';

  readonly CUSTOMERS: string = this.API_URL + "customers";
  readonly CUSTOMERSLIST: string = this.API_URL + "customers/list";
  readonly SEARCHCUSTOMERS: string = this.API_URL + "customers";
  readonly GET_ALL_USERS: string = this.API_URL + "getAllUsers";
  readonly ADD_CUSTOMER: string = this.API_URL + "add-customer";
  readonly CHANGE_CUSTOMER_STATUS = this.API_URL + "customer-status";
  readonly EDIT_CUSTOMER: string = this.API_URL + "customers";
  readonly DELETE_CUSTOMER: string = this.API_URL + "delete-customer";

  // default home routes for diffrent roles
  readonly SUPERADMIN_DASHBOARD: string = "/superadmin/dashboard";
  readonly ADMIN_DASHBOARD: string = "/admin/dashboard";
  readonly EMPLOYEE_DASHBOARD: string = "/employee/dashboard";

  readonly GET_SUBSCRIPTION_CANCEL_REASONS: string = this.API_URL + "getSubscriptionCancelReasons";
  readonly GET_SUBSCRIPTION_CANCEL_REASONS_BY_USER: string = this.API_URL + "getSubscriptionCancelReasonsByUser";
  readonly GET_FEEDBACK_BY_USER: string = this.API_URL + "getFeedbackByReasons";
  readonly GET_SUBSCRIPTION_CANCEL_REASON_BY_USER_DATA: string = this.API_URL + "getSubscriptionCancelReasonByUserData";

  readonly ADD_ARCHIVE: string = this.API_URL + "addArchive";

  // promotion
  readonly PROMOTIONS: string = this.API_URL + "promotions";
  readonly ADD_PROMOTION: string = this.API_URL + "add-promotion";
  readonly CHANGE_PROMOTION_STATUS = this.API_URL + "promotion-status";
  readonly EDIT_PROMOTION: string = this.API_URL + "promotions";
  readonly GET_PROMOTION_BY_ID: string = this.API_URL + "getPromotionById";
  readonly GET_USER_PROMOTION_BY_ID: string = this.API_URL + "getUserPromotionById";
  readonly DELETE_PROMOTION: string = this.API_URL + "delete-promotion";
  readonly ASSIGN_PROMOTION: string = this.API_URL + "assign-promotion";
  readonly ASSIGN_USER_PROMOTION: string = this.API_URL + "assign-user-promotion";

  // Notifications
  readonly GET_NOTIFICATIONS: string = this.API_URL + "getNotifications";
  readonly NOTIFICATION_STATUS: string = this.API_URL + "notification-status";
  readonly NOTIFICATION_REMOVE: string = this.API_URL + "notification-remove";

  /** generate licence key  */
  readonly REGENERATEkEY: string = this.API_URL + "regenerate-licence";
  readonly VERIFYREGENERATEkEY: string = this.API_URL + "verify-regenerate-licence";
  readonly LICENCEHISTORY: string = this.API_URL + "get-all-regenerate-licence";
  readonly BULKNOTIFY: string = this.API_URL + "customer-notify";


  /** Varify Coupan code */
  readonly VARIFYCOUPAN: string = this.API_URL + "verifyCoupon";
  readonly EXTENDMAINTENCE: string = this.API_URL + "extendMaintenance";

  /** Status update for releases */
  readonly RELEASESSTATUSUPDATE: string = this.API_URL + "version-status";


  /** Pool apis */
  readonly GETPOOLLIST: string = this.API_URL + "get-pool-request";
  readonly ADDPOOLREQUEST: string = this.API_URL + "add-feature";
  readonly CHANGESTATUSOFPOOL: string = this.API_URL + "feature-status";
  readonly EDITPOOLREQUEST: string = this.API_URL + "edit-feature";
  readonly GETCOMMENTSFEATURE: string = this.API_URL + "get-comment-feature";
  readonly ADDCOMMENTINFEATURE: string = this.API_URL + "comment-feature";
  readonly APPROVEDFEATURELIST: string = this.API_URL + "get-approved-pool-feature";
  readonly REJECTPOOLFEATURE: string = this.API_URL + "reject-pool-feature-comment";

  readonly GETAPPROVEDPOOLLIST: string = this.API_URL + "pool-list";
  readonly CREATEPOOLLIST: string = this.API_URL + "create-pool";
  readonly STARTPOOL: string = this.API_URL + "start-pool";
  readonly STATUSCHANGEPOOL: string = this.API_URL + "active-pool";
  readonly VOTEPOOL: string = this.API_URL + "vote-feature";
  readonly GETVOTESPOOLFEATURES: string = this.API_URL + "get-votes-pool-features";
  readonly GETVOTESPOOLFEATURESVoters: string = this.API_URL + "get-votes-pool-feature-voters";
  readonly RELEASEFEATURE: string = this.API_URL + "pool-release";


  readonly VoteConfigList: string = this.API_URL + "vote-list";
  readonly VoteConfigCreate: string = this.API_URL + "create-vote";
  readonly VoteConfigUpdate: string = this.API_URL + "update-vote";
  readonly VoteConfigChangePurshaseStatus: string = this.API_URL + "purchase-status";
  readonly VoteConfigChangeStatus: string = this.API_URL + "vote-status";
  readonly UserVotes: string = this.API_URL + "user-votes";
  readonly PurchasePoolVotes: string = this.API_URL + "purchase-vote";

  // Custom Requirements
  readonly GETCUSTOMREQUIREMENTS: string = this.API_URL + "custom-requirements";
  readonly CUSTOMREQUIREMENTSOFFER: string = this.GETCUSTOMREQUIREMENTS + "/offer";
  readonly CUSTOMREQUIREMENTSOFFERPAYMENT: string = this.CUSTOMREQUIREMENTSOFFER + "/payment";



  readonly ZohoClientId = '1000.ALDXEUT875RBMOKIS057TEBOU4G12H';
  readonly ZohoClientSecret = 'd058e53a19c0e2ca6b9eb6c3caf5a5d1299b609e62';
  readonly ZohoRedirectURL = 'https://devapanel.atavismonline.com/tickets';

  readonly ZOHOPREFIX = this.API_URL + "zoho/";

  readonly ZOHOCREATEREFRESHTOKEN = this.ZOHOPREFIX + "create-refresh-token";
  readonly ZOHOCREATETICKET = this.ZOHOPREFIX + "ticket";
  readonly ZOHOGETTICKET = this.ZOHOPREFIX + "ticket";
  readonly ZOHOShowTicket = this.ZOHOPREFIX + "ticket/show";

  readonly ZOHOGETTICKETCOMMENTS = this.ZOHOCREATETICKET + '/comment'
  readonly ZOHOGETTICKETCOMMENTCREATE = this.ZOHOCREATETICKET + '/comment'

}