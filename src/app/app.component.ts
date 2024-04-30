import { Component, OnInit } from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { environment } from 'environments/environment';
import { MessagingService } from './shared/services/messaging.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'push-notification';
    message;

    constructor(
        public messageService: MessagingService
    ) {
        this.messageService.turnOnNotification();
    }

    ngOnInit(): void {

    }


}
