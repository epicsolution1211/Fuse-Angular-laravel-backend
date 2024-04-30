import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class LicenceGenerateService {

  constructor(
    private _http: HttpClient,
    private constants: ConstantsService
  ) { }

  /** Regenarate licence key */
  forRegenarateKey(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.REGENERATEkEY, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Regenarate licence key */
  licenceKeyHistory(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.LICENCEHISTORY, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Varification code */

  verificationCode(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.VERIFYREGENERATEkEY, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Bulk Notify User */
  bulkNotifyUser(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.BULKNOTIFY, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Varify coupan code */
  varifyCoupanCode(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.VARIFYCOUPAN, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Extent maintenance */
  extendMaintenance(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.constants.EXTENDMAINTENCE, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }


}
