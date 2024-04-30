import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import Pusher from 'pusher-js/worker';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { default as $ } from 'jquery';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':
            'key=AAAA5irwOH0:APA91bFiyai_BSvJdlvMTZPV2swPps-sMk82aIy1Qc7y2IfbQVs1eZT-avXiVPoA62H3uqPEn6GGHBdwOeqlmsZJdRTv6b0HJd68dlQv4Gz8R9fL_RFv6gEkkgsdtySv-SM3Yp_I_a_1'
    })
};

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications'
})
export class NotificationsComponent implements OnChanges, OnInit, OnDestroy {
    @Input() notifications: Notification[] = [];
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    // notifications: any;

    // notifications: any[];

    unreadCount: number = 0;
    max: number = 10;
    _this = this;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private toastr: ToastrService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Notifications
        if ('notifications' in changes) {
            // Store the notifications on the service
            this._notificationsService.store(changes.notifications.currentValue);
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to notification changes
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: Notification[]) => {

                // Load the notifications
                this.notifications = notifications;
                // console.log(this.notifications);

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        const userId = JSON.parse(localStorage.getItem('user')).id;
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;
        const pusher = new Pusher('87eda81787f7b9f298ad', {
            cluster: 'ap2'
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
            // console.log("data??????", data);
            // this.notifications.push(notificationData)
            if (data.message.userId == userId) {
                const testObj: Notification = JSON.parse(data.message.data);
                this.create(testObj);
            }
        });
    }

    create(notify) {
        const pushNotificationBody = {
            "to": localStorage.getItem("deviceToken"),
            "notification": {
                "title": notify.title,
                "body": notify.description,
                "mutable_content": true,
                "sound": "Tri-tone"
            }
        };

        this.toastr.success(notify.description, 'New Notification');
        // console.log(httpOptions);
        $.ajax({
            type: 'POST',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${'key=AAAA5irwOH0:APA91bFiyai_BSvJdlvMTZPV2swPps-sMk82aIy1Qc7y2IfbQVs1eZT-avXiVPoA62H3uqPEn6GGHBdwOeqlmsZJdRTv6b0HJd68dlQv4Gz8R9fL_RFv6gEkkgsdtySv-SM3Yp_I_a_1'}`
            },
            data: JSON.stringify(pushNotificationBody),
            success(data, status, xhr) {
                // console.log('data: ', data);
            }
        });

        this.notifications.push(notify);
        this._notificationsService.store(this.notifications);
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this._notificationsService.markAllAsRead().subscribe();
    }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notification): void {

        // Toggle the read status
        notification.read = !notification.read;

        // console.log("notification>>>>>>>>>>", notification);


        // Update the notification
        this._notificationsService.update(notification.id, notification).subscribe();
    }

    /**
     * Delete the given notification
     */
    delete(notification: Notification): void {
        // Delete the notification
        this._notificationsService.delete(notification.id).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition()
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.notifications && this.notifications.length) {
            count = this.notifications.filter(notification => !notification.read).length;
        }

        this.unreadCount = count;
    }


    toggle(): void {
        this.max = this.max + 20;
    }
}
