import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  /** Environment api url */
  readonly API_URL: string = `${environment.apiUrl}` + "/";

  /** API End points */
  readonly GETADVISORSETTING: string = this.API_URL + 'advisor-settings/';
  readonly SAVEADVISORSETTING: string = this.API_URL + 'advisor-settings-save';

  constructor(
    private _http: HttpClient
  ) { }

  /** Get advisor settings */
  getAdvisorSetting() {
    return new Promise((resolve, reject) => {
      this._http.get(`${this.GETADVISORSETTING}${1}`).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** Get advisor settings */
  saveAdvisorSettings(body) {
    return new Promise((resolve, reject) => {
      this._http.post(this.SAVEADVISORSETTING, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
