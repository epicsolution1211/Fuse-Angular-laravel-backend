declare const Pusher: any;
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class PusherService {
  pusher: any;
  channel: any;

  constructor(private http: HttpClient) {
    this.pusher = new Pusher(environment.pusher.key);
    this.channel = this.pusher.subscribe('my-channel');
    /*this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true
    });
    this.channel = this.pusher.subscribe('my-channel');*/
  }
  /*like( num_likes ) {
    his.http.post('http://localhost:8000/update', {'likes': num_likes})
    .subscribe(data => {});
  }*/
}
