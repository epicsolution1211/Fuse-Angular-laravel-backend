import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';

export interface Item { name: string; }

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  items: Observable<Item[]>;
  readonly API_URL: string = `${environment.apiUrl}` + "/";
  private callEvent = new Subject<any>();
  callEventData$ = this.callEvent.asObservable();


  featureData: any;

  private stateBe$: BehaviorSubject<string>;
  public getPoolFeatureData$: BehaviorSubject<string>;
  initialState: any;

  constructor(
    private http: HttpClient,
    private constants: ConstantsService
  ) {

    this.stateBe$ = new BehaviorSubject(this.initialState);
    this.getPoolFeatureData$ = new BehaviorSubject(this.initialState);
  }


  /** Set Appointment info */
  setPoolFeatureData = (set: string) => {
    this.getPoolFeatureData$.next(set);
  }

  /** Guest Appointment info */
  get getPoolFeatureData(): string {
    return this.getPoolFeatureData$.getValue();
  }

  setAdvanceSearchField = (nextState: string) => {
    this.stateBe$.next(nextState);
  }

  get getAdvanceSearchField(): any {
    return this.stateBe$.getValue();
  }

  getroles() {
    return this.http.get<any>(this.constants.ROLES);
  }

  getRoleById(roleId) {
    return this.http.get<any>(this.constants.ROLE_BY_ID + '/' + roleId);
  }

  getRolePermissions(roleId: string) {
    return this.http.get<any>(this.constants.ROLE_PERMISSIONS + '/' + roleId);
  }

  getRolePermissionsByUser(roleId: string) {
    return this.http.get<any>(this.constants.ROLE_PERMISSIONS_BY_USER + '/' + roleId);
  }

  getFeatures() {
    return this.http.get<any>(this.constants.ALL_FEATURES);
  }

  signinCloud(postData: object) {
    return this.http.post<any>(this.constants.SIGNIN_Cloud, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  addRole(postData: object) {
    return this.http.post<any>(this.constants.ADD_ROLE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteRole(roleId: string) {
    return this.http.delete<any>(this.constants.DELETE_ROLE + '/' + roleId);
  }

  getEmployees(paginate = 100, page = 1, search = '', role = 'all', status = 2) {
    return this.http.post<any>(this.constants.EMPLOYEES, { paginate, page, search, role, status });
  }

  changeEmployeePassword(postData: object) {
    return this.http.post<any>(this.constants.CHANGE_EMPLOYEE_PASSWORD, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateEmployeePassword(postData: object) {
    return this.http.post<any>(this.constants.UPDATE_EMPLOYEE_PASSWORD, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  getEmployeeById(userId) {
    return this.http.get<any>(this.constants.EDIT_EMPLOYEE + '/' + userId);
  }

  getUserById(userId) {
    return this.http.get<any>(this.constants.EDIT_CUSTOMER + '/' + userId);
  }

  getLicenceById(licenceId) {
    return this.http.get<any>(this.constants.GET_LICENCE_BY_ID + '/' + licenceId);
  }

  getCancelSubscription(postData: object) {
    // return this.http.get < any > (this.constants.GET_CANCEL_SUBSCRIPTION+'/'+licenceId);
    return this.http.post<any>(this.constants.GET_CANCEL_SUBSCRIPTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  getLicenceByIdWithMaintenance(licenceId) {
    return this.http.get<any>(this.constants.GET_LICENCE_BY_ID_WITH_MAINTENANCE + '/' + licenceId);
  }

  getDownloads(type, downloadType, paginate = 10, page = 1, search = '') {
    return this.http.post<any>(this.constants.DOWNLOADS, { type, downloadType, paginate, page, search });
  }

  getLicences(type, paginate = 10, page = 1, search = '') {
    return this.http.post<any>(this.constants.GET_LICENCES, { type, paginate, page, search });
  }

  getUserLicences(type, userId, paginate = 10, page = 1, search = '') {
    return this.http.post<any>(this.constants.EMPLOYEE_LICENCES, { type, userId, paginate, page, search });
  }

  getUserFilter() {
    return this.http.get<any>(this.constants.EMPLOYEE_FILTER);
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(this.constants.DELETE_EMPLOYEE + '/' + userId);
  }

  addUser(postData: object) {
    return this.http.post<any>(this.constants.ADD_EMPLOYEE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  changeStatus(user_id, status) {
    return this.http.post<any>(this.constants.CHANGE_EMPLOYEE_STATUS, { user_id, status });
  }

  statusUpdate(releaseID, status) {
    return this.http.post<any>(this.constants.RELEASESSTATUSUPDATE, { id: releaseID, status });
  }

  changeCustomerStatus(user_id, status) {
    return this.http.post<any>(this.constants.CHANGE_CUSTOMER_STATUS, { user_id, status });
  }

  getLanguages() {
    return this.http.get<any>(this.constants.LANGUAGES);
  }

  changePassword(postData: object) {
    return this.http.post<any>(this.constants.CHANGE_PASSWORD, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  updatePassword(postData: object) {
    return this.http.post<any>(this.constants.UPDATE_PASSWORD, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  checkPassword(postData: object) {
    return this.http.post<any>(this.constants.CHECK_PASSWORD, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  /*getUserLicences(userId) {
    return this.http.get < any > (this.constants.USER_LICENCES+'/'+userId);
  }*/



  forgetPassword(postData: object) {
    return this.http.post<any>(this.constants.RESET_PASSWORD_REQUEST, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  getVersions(paginate = 10, page = 1, search = '') {
    return this.http.post<any>(this.constants.VERSIONS, { paginate, page, search });
  }

  getAllVersions() {
    return this.http.get<any>(this.constants.ALL_VERSIONS);
  }

  getAllProducts() {
    return this.http.get<any>(this.constants.GET_ALL_PRODUCTS);
  }

  getAllProductsEdit(configurationId) {
    return this.http.get<any>(this.constants.GET_ALL_PRODUCTS_EDIT + '/' + configurationId);
  }

  getReleaseById(releaseId) {
    return this.http.get<any>(this.constants.EDIT_VERSION + '/' + releaseId);
  }

  addVersion(postData: object) {
    return this.http.post<any>(this.constants.ADD_VERSION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteVersion(versionId: string) {
    return this.http.delete<any>(this.constants.DELETE_VERSION + '/' + versionId);
  }

  getAllCounts(data: object) {
    return this.http.post<any>(this.constants.ALL_COUNT, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  getLicencesTypes() {
    return this.http.get<any>(this.constants.LICENCES_TYPES);
  }

  getLicenceTypes() {
    return this.http.get<any>(this.constants.LICENCE_TYPES);
  }

  getChartData(data: object) {
    return this.http.post<any>(this.constants.GET_CHART_DATA, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  downloadLogs(data: object) {
    return this.http.post<any>(this.constants.DOWNLOAD_LOGS, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  downloadLogsList(paginate = 100, page = 1, search = '', order = '', direction = '', id = "") {
    return this.http.post<any>(this.constants.DOWNLOAD_LOGS_LIST, { paginate, page, search, order, direction, id });
  }

  addDownloads(postData: object) {
    return this.http.post<any>(this.constants.ADD_DOWNLOADS, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  addLicenceSubscription(postData: object) {
    return this.http.post<any>(this.constants.ADD_LICENCE_SUBSCRIPTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  deleteLicenceSubscription(downloadId: string) {
    return this.http.delete<any>(this.constants.DELETE_LICENCE_SUBSCRIPTION + '/' + downloadId);
  }

  changeLicenceSubscriptionStatus(licenceId, status) {
    return this.http.post<any>(this.constants.CHANGE_LICENCE_SUBSCRIPTION_STATUS, { licence_id: licenceId, status });
  }

  changeDownloadStatus(download_id, status) {
    return this.http.post<any>(this.constants.DOWNLOAD_STATUS, { download_id, status });
  }

  deleteDownload(downloadId: string) {
    return this.http.delete<any>(this.constants.DOWNLOAD_DELETE + '/' + downloadId);
  }

  getDownloadById(userId) {
    return this.http.get<any>(this.constants.EDIT_DOWNLOAD + '/' + userId);
  }

  getLicenceSubscriptionById(configurationId) {
    return this.http.get<any>(this.constants.GET_LICENCE_SUBSCRIPTION_BY_ID + '/' + configurationId);
  }

  getCustomers(paginate = 100, page = 1, status = '', role = '') {
    return this.http.post<any>(this.constants.CUSTOMERS, { paginate, page, status, role });
  }

  getCustomersList($search: string | null = null) {
    return this.http.get<any>($search ? this.constants.CUSTOMERSLIST + '?search=' + $search : this.constants.CUSTOMERSLIST)
  }

  searchCustomers(data: string) {
    // console.log("data>>>>>>>>", data);
    return this.http.post<any>(this.constants.SEARCHCUSTOMERS, data);
  }

  /*getAllUsers(paginate = 100000,page = 1) {
    return this.http.post < any > (this.constants.GET_ALL_USERS,{paginate:paginate,page:page});
  }*/

  getAllUsers(search = "") {
    return this.http.post<any>(this.constants.GET_ALL_USERS, { search });
  }

  deleteCustomer(userId: string) {
    return this.http.delete<any>(this.constants.DELETE_CUSTOMER + '/' + userId);
  }

  addCustomer(postData: object) {
    return this.http.post<any>(this.constants.ADD_CUSTOMER, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  changeTheme(postData: object) {
    return this.http.post<any>(this.constants.THEME_CHANGE, postData).pipe(
      map(data => {
        // console.log(data);
        return data;
      })
    );
  }

  changeScheme(postData: object) {
    return this.http.post<any>(this.constants.SCHEME_CHANGE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  convertAll(postData: object) {
    return this.http.post<any>(this.constants.CONVERT_ALL, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  addSubscription(postData: object) {
    return this.http.post<any>(this.constants.ADD_SUBSCRIPTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  changeSubscription(postData: object) {
    return this.http.post<any>(this.constants.CHANGE_SUBSCRIPTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  assignMaintenance(postData: object) {
    return this.http.post<any>(this.constants.ASSIGN_MAINTENACE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  extendMaintenance(postData: object) {
    return this.http.post<any>(this.constants.EXTEND_MAINTENACE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  subscriptionMaintenance(postData: object) {
    return this.http.post<any>(this.constants.SUBSCRIPTION_MAINTENACE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateLicence(postData: object) {
    return this.http.post<any>(this.constants.UPDATE_LICENCE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  addUnityLicence(postData: object) {
    return this.http.post<any>(this.constants.ADD_UNITY_LICENCE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  cancelSubscription(postData: object) {
    return this.http.post<any>(this.constants.CANCEL_SUBSCRIPTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  getChangeSubscriptionData(licenceId) {
    return this.http.get<any>(this.constants.GET_CHANGE_SUBSCRIPTION_DATA + '/' + licenceId);
  }

  getSubscriptionCancelReason(paginate = 100, page = 1, search = '', historyId = '') {
    return this.http.post<any>(this.constants.GET_SUBSCRIPTION_CANCEL_REASONS, { paginate, page, search, historyId });
  }

  getSubscriptionCancelReasonByUser(paginate = 100, page = 1, search = '', historyId = '') {
    return this.http.post<any>(this.constants.GET_SUBSCRIPTION_CANCEL_REASONS_BY_USER, { paginate, page, search, historyId });
  }

  getFeedbackByReasons(paginate = 100, page = 1, search = '', id = '', archieve_id = '', userId = '', from = '', to = '', type = '') {
    return this.http.post<any>(this.constants.GET_FEEDBACK_BY_USER, { paginate, page, search, id, archieve_id, userId, from, to, type });
  }

  getSubscriptionCancelReasonByUserData(data: object) {
    return this.http.post<any>(this.constants.GET_SUBSCRIPTION_CANCEL_REASON_BY_USER_DATA, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  addArchive(postData: object) {
    return this.http.post<any>(this.constants.ADD_ARCHIVE, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  // promotion
  getPromotions(paginate = 10, page = 1, search = '') {
    return this.http.post<any>(this.constants.PROMOTIONS, { paginate, page, search });
  }
  addPromotion(postData: object) {
    return this.http.post<any>(this.constants.ADD_PROMOTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }
  changePromotionStatus(promotion_id, status) {
    return this.http.post<any>(this.constants.CHANGE_PROMOTION_STATUS, { promotion_id, status });
  }
  getPromotion(userId) {
    return this.http.get<any>(this.constants.EDIT_PROMOTION + '/' + userId);
  }
  getPromotionById(promotion_id) {
    return this.http.get<any>(this.constants.GET_PROMOTION_BY_ID + '/' + promotion_id);
  }
  getUserPromotionById(user_id) {
    return this.http.get<any>(this.constants.GET_USER_PROMOTION_BY_ID + '/' + user_id);
  }
  deletePromotion(userId: string) {
    return this.http.delete<any>(this.constants.DELETE_PROMOTION + '/' + userId);
  }
  assignPromotion(postData: object) {
    return this.http.post<any>(this.constants.ASSIGN_PROMOTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }
  assignUserPromotion(postData: object) {
    return this.http.post<any>(this.constants.ASSIGN_USER_PROMOTION, postData).pipe(
      map(data => {
        return data;
      })
    );
  }

  getNotifications(postData: object) {
    // return this.http.get<any>(this.constants.GET_NOTIFICATIONS + '/' + userId);
    return this.http.post<any>(this.constants.GET_NOTIFICATIONS, postData).pipe(
      map(data => {
        return data;
      })
    );
  }
  changeNotificationStatus(id) {
    return this.http.post<any>(this.constants.NOTIFICATION_STATUS, { id });
  }
  notificationDelete(id) {
    return this.http.post<any>(this.constants.NOTIFICATION_REMOVE, { id });
  }


  // Pool apis

  getAllPoolList() {
    return this.http.post<any>(this.constants.GETPOOLLIST, {});
  }

  addPoolRequest(data) {
    return this.http.post<any>(this.constants.ADDPOOLREQUEST, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  changepoolStatus(poolId, status) {
    return this.http.post<any>(this.constants.CHANGESTATUSOFPOOL, { id: poolId, status });
  }

  getFeaturePoolData(id) {
    return this.http.get<any>(this.constants.EDITPOOLREQUEST + '/' + id);
  }

  getCommentsFeature(idd) {
    return this.http.post<any>(this.constants.GETCOMMENTSFEATURE, { id: idd });
  }

  addCommentInFeature(data) {
    return this.http.post<any>(this.constants.ADDCOMMENTINFEATURE, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  updateCallEvent(data: any, type: any) {
    this.callEvent.next(type);
  }

  approvedFeatuelist() {
    return this.http.post<any>(this.constants.APPROVEDFEATURELIST, {});
  }

  rejectPoolFeature(data) {
    return this.http.post<any>(this.constants.REJECTPOOLFEATURE, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  /** Get approved pool list */
  getApprovedPoolList() {
    return this.http.post<any>(this.constants.GETAPPROVEDPOOLLIST, {});
  }

  /** Create pool list */
  createPoolList(data) {
    return this.http.post<any>(this.constants.CREATEPOOLLIST, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  /** Start pool api */
  startPool(id) {
    // console.log(id)
    return this.http.post<any>(this.constants.STARTPOOL, { id: id });
  }

  /** Start pool api */
  activePool(id, status) {
    // console.log(id)
    return this.http.post<any>(this.constants.STATUSCHANGEPOOL, { id: id, status });
  }

  /** Vote pool */
  votePool(data: any) {
    return this.http.post<any>(this.constants.VOTEPOOL, data);
  }

  /** Get pull votes */
  getVotesPoolFeatures(id: any) {
    return this.http.post<any>(this.constants.GETVOTESPOOLFEATURES, { pool_id: id });
  }

  getVotesPoolFeatureVoters(id: any, feature_id: any) {
    return this.http.post<any>(this.constants.GETVOTESPOOLFEATURESVoters, { pool_id: id, feature_id });
  }

  /** Release Feature */
  releasePoolFeature(data: any) {
    return this.http.post<any>(this.constants.RELEASEFEATURE, data);
  }


  votePointsConfList() {
    return this.http.get<any>(this.constants.VoteConfigList);
  }

  purchasePoolVotes(data: object) {
    return this.http.post<any>(this.constants.GETVOTESPOOLFEATURESVoters, data);
  }

  /** Get feature data */
  getEditFeatureData(id: any) {
    return this.http.get<any>(this.API_URL + 'edit-feature/' + id);
  }

  /** Get feature data */
  deleteFeature(id: any) {
    return this.http.delete<any>(this.API_URL + 'delete-feature/' + id);
  }

  /** Update Feature pool request */
  updatePoolFeature(data: any) {
    return this.http.post<any>(this.API_URL + 'update-feature', data);
  }

  /** Delete pool  */
  deletePool(id: any) {
    return this.http.delete<any>(this.API_URL + 'delete-pool/' + id);
  }

  /** Update Feature pool request */
  upadatePool(data: any) {
    return this.http.post<any>(this.API_URL + 'update-pool', data);
  }

  createVote(data: any) {
    return this.http.post<any>(this.constants.VoteConfigCreate, data);
  }

  updateVote(data: any) {
    return this.http.post<any>(this.constants.VoteConfigUpdate, data);
  }

  changePurchaseStatus(data: any) {
    return this.http.post<any>(this.constants.VoteConfigChangePurshaseStatus, data);
  }

  userVotes(id: number) {
    return this.http.get<any>(this.constants.UserVotes + `/${id}`);
  }

  changeVoteStatus(data: any) {
    return this.http.post<any>(this.constants.VoteConfigChangeStatus, data);
  }

  getCustomRequirements() {
    return this.http.get<any>(this.constants.GETCUSTOMREQUIREMENTS);
  }

  createCustomRequirement(data: any) {
    return this.http.post<any>(this.constants.GETCUSTOMREQUIREMENTS, data);
  }

  updateCustomRequirement(data: any) {
    return this.http.put<any>(this.constants.GETCUSTOMREQUIREMENTS, data);
  }

  PaymentCustomRequirement(data: any) {
    return this.http.post<any>(this.constants.CUSTOMREQUIREMENTSOFFERPAYMENT, data);
  }

  makeOffer(data: any) {
    return this.http.post<any>(this.constants.CUSTOMREQUIREMENTSOFFER, data);
  }

  showOffer(id: any) {
    return this.http.get<any>(this.constants.CUSTOMREQUIREMENTSOFFER + `/${id}`);
  }

  createRefreshTokenZoho(code: any) {
    return this.http.get<any>(this.constants.ZOHOCREATEREFRESHTOKEN + `/${code}`);
  }

  createTicketZoho(data: any) {
    return this.http.post<any>(this.constants.ZOHOCREATETICKET, data, {});
  }

  getTicketZoho(token: any) {
    return this.http.get<any>(this.constants.ZOHOCREATETICKET + `/${token}`);
  }

  getTicketById(token: any, id: any) {
    return this.http.get<any>(this.constants.ZOHOShowTicket + `/${token}/${id}`);
  }

  getTicketComments(token: any, id: any) {
    return this.http.get<any>(this.constants.ZOHOGETTICKETCOMMENTS + `/${token}/${id}`);
  }
  createTicketComment(data: any) {
    return this.http.post<any>(this.constants.ZOHOGETTICKETCOMMENTS, data);
  }
}
