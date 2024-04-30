import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { HttpClient } from '@angular/common/http';


export interface MessagePayload {
	data?: {
		RefKey: string;
		badge: string;
		body: string;
		click_action: string;
		dateOfArrival: string;
		icon: string;
		msg: string;
		msgKey: string;
		msgType: string;
		primaryKey: string;
		priority: string;
		sound: string;
		title: string;
		type: string;
	};
}
@Injectable({
	providedIn: 'root'
})
export class MessagingService {


	messagingFirebase: firebase.default.messaging.Messaging;
	updateOrdersTab$: Subject<string> = new BehaviorSubject<string>('');
	update$ = this.updateOrdersTab$.asObservable();
	updateflash$: Subject<boolean> = new BehaviorSubject<boolean>(false);
	flash$ = this.updateflash$.asObservable();
	updateswing$: Subject<boolean> = new BehaviorSubject<boolean>(false);
	swing$ = this.updateswing$.asObservable();

	constructor(
	) {
		// Message event
		this.messagingFirebase = firebase.default.messaging();

		// console.log("this.messagingFirebase>>>>>>>>>", this.messagingFirebase);
		// listening message event from windows-client
		navigator.serviceWorker.addEventListener('message', (event) => {

			// console.log("event>>>>>>>>>>>>>>", event);
			if (event.data) {
				this.updateOrdersTab$.next('refresh_or_reload');
			}
		});

		this.getFirebaseData();
	}



	/** Get firebase realtime database */

	getFirebaseData() {
		// // on() method
		// firebase.default.database().ref('data').on('value', (snap) => {
		// 	// console.log(snap.val());
		// });
		// // once() method
		// firebase.default.database().ref('data').on('value', (snap) => {
		// 	// console.log(snap.val());
		// });
	}


	public messaginObservable = new Observable<MessagePayload>(observe => {
		// console.log("observe>>>>>>>>>>", observe);
		this.messagingFirebase.onMessage(payload => {
			observe.next(payload);
		});
	});



	turnOnNotification = () => {
		setTimeout(async () => {
			try {
				const token = await this.requestPermission() as string;
				// console.log("token>>>>>>>>>>", token);

				localStorage.setItem("deviceToken", token);

				const getToken = localStorage.getItem("deviceToken");
				// console.log("getToken>>>>", getToken);
				// this.updateToken(token);
			} catch (err) {
				// console.log("err", err);
				if (err.code === 'messaging/token-unsubscribe-failed') {
					this.turnOnNotification();
				}
			}
		}, 1500);
	}

	refresh = () => {
		setTimeout(async () => {
			try {
				const token = await this.requestPermission() as string;
				this.updateToken(token);
			} catch (err) {
				if (err.code === 'messaging/token-unsubscribe-failed') {
					this.turnOnNotification();
				}
			}
		}, 500);
	}

	requestPermission = () => {
		return new Promise(async (resolve, reject) => {
			const permsis = await Notification.requestPermission();
			if (permsis === 'granted') {
				const tokenFirebase = await this.messagingFirebase.getToken();
				resolve(tokenFirebase);
			} else {
				reject(new Error('Permissions were not granted'));
			}
		});
	}

	updateToken = (t: string) => {
		// this.root.updateToken(JSON.stringify({
		// 	loginrestaurantID: this.user.restaurantID,
		// 	restaurantDeviceID: t
		// })).subscribe();
	}

	receiveMessage = () => {
		return this.messaginObservable;
	}

	deleteToken = async () => {
		if (Notification.permission !== 'default' && Notification.permission !== 'denied') {
			const t = await this.messagingFirebase.getToken() as string;
			if (t) {
				this.messagingFirebase.deleteToken()
					.then(_ => this.updateToken(''))
					.catch(e => console.error(e));
			}
		}
	}
}
