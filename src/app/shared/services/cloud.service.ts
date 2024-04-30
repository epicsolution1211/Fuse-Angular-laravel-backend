import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  readonly SIGNINCLOUD: string = 'https://devapanel.atavismonline.com/backend/public/api/signin-cloud';
  readonly STARTVPSSERVER: string = 'https://devapanel.atavismonline.com/backend/public/api/server-start';
  readonly STOPVPSSERVER: string = 'https://devapanel.atavismonline.com/backend/public/api/server-stop';
  readonly RESTARTVPSSERVER: string = 'https://devapanel.atavismonline.com/backend/public/api/server-restart';
  readonly LOGOUTVPSSERVER: string = 'https://devapanel.atavismonline.com/backend/public/api/signout-cloud';
  readonly CREATESERVER: string = 'https://devapanel.atavismonline.com/backend/public/api/server-create/';
  readonly CREATESERVERPOST: string = 'https://devapanel.atavismonline.com/backend/public/api/server-create-post';

  constructor(
    private _http: HttpClient
  ) { }


  /** get message */
  signInCloudServer(body: any) {
    return new Promise((resolve, reject) => {
      this._http.post(this.SIGNINCLOUD, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }


  /** startVPSserver */
  startVPSserver(body: any) {
    return new Promise((resolve, reject) => {
      this._http.post(this.STARTVPSSERVER, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** startVPSserver */
  stopVPSserver(body: any) {
    return new Promise((resolve, reject) => {
      this._http.post(this.STOPVPSSERVER, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** startVPSserver */
  restartVPSserver(body: any) {
    return new Promise((resolve, reject) => {
      this._http.post(this.RESTARTVPSSERVER, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** startVPSserver */
  logOutCloud(body: any) {
    return new Promise((resolve, reject) => {
      this._http.post(this.LOGOUTVPSSERVER, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /** server create */
  serverCreate(userId: any) {
    return new Promise((resolve, reject) => {
      this._http.get(`${this.CREATESERVER}${userId}`).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  serverCreatePost(body:any){
    return new Promise((resolve, reject) => {
      this._http.post(this.CREATESERVERPOST, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
