import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { map, switchMap, take } from 'rxjs/operators';
import Pusher from 'pusher-js/worker';
import { CommonService } from 'app/shared/services/common.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Authorization':
            'key=AAAA5irwOH0:APA91bFiyai_BSvJdlvMTZPV2swPps-sMk82aIy1Qc7y2IfbQVs1eZT-avXiVPoA62H3uqPEn6GGHBdwOeqlmsZJdRTv6b0HJd68dlQv4Gz8R9fL_RFv6gEkkgsdtySv-SM3Yp_I_a_1'
    })
};

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private _notifications: ReplaySubject<Notification[]>
        = new ReplaySubject<Notification[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private commonService: CommonService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Store notifications on the service
     *
     * @param notifications
     */
    store(notifications: Notification[]): Observable<Notification[]> {

        // console.log("notifications", notifications);

        // Load the notifications
        this._notifications.next(notifications);

        // Return the notifications
        return this.notifications$;
    }

    /**
     * get new notifications
     *
     * @param notification
     */

    newNotifications(notification: Notification): Observable<Notification> {
        return;


    }


    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification> {
        // console.log("notification", notification);
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('api/common/notifications', { notification }).pipe(
                map((newNotification) => {
                    // console.log("newNotification", newNotification);
                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                })
            ))
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.patch<Notification>('api/common/notifications', {
                id,
                notification
            }).pipe(
                map((updatedNotification: Notification) => {
                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === id);
                    this.commonService.changeNotificationStatus(id).subscribe();

                    // console.log("updatedNotification", notification);
                    // Update the notification
                    notifications[index] = notification;

                    // console.log(notifications);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                })
            ))
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', { params: { id } }).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);
                    this.commonService.notificationDelete(id).subscribe();
                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.get<boolean>('api/common/notifications/mark-all-as-read').pipe(
                map((isUpdated: boolean) => {

                    // Go through all notifications and set them as read
                    notifications.forEach((notification, index) => {
                        notifications[index].read = true;
                    });

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated status
                    return isUpdated;
                })
            ))
        );
    }
}
