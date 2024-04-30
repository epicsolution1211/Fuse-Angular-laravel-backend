import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ConstantsService } from 'app/shared/services/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import moment from 'moment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
const url = '../../../../assets/ZohoChatWidget.js';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  showSignIn = true;
  showTicketDetails = false;
  ticketData: any[] = [];
  singleTicket: any = null;
  private routeSubscription: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private constantsServices: ConstantsService,
    private CommonService: CommonService,
    private _matDialog: MatDialog,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        if (!localStorage.getItem('zohoTokens')) {
          if (params.has('code')) {
            this.spinner.show();
            this.CommonService.createRefreshTokenZoho(params.get('code'))
              .subscribe(
                (res) => {
                  localStorage.setItem('zohoTokens', res.data);
                  this.getTickets();
                },
                (err) => window.location.replace('/tickets'),
                () => {
                  this.showSignIn = false;
                }
              );
          }
        } else {
          if (params.has('id')) {
            this.showTicketDetails = true;
          } else {
            this.showTicketDetails = false;
            this.getTickets();
          }
        }
        return [];
      })
    ).subscribe()

  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.routeSubscription.unsubscribe();
  }

  signinWithZoho() {
    window.open(`https://accounts.zoho.eu/oauth/v2/auth?response_type=code&client_id=${this.constantsServices.ZohoClientId}&scope=Desk.basic.READ,Desk.tickets.READ,Desk.tickets.CREATE,Desk.tickets.UPDATE&access_type=offline&redirect_uri=${this.constantsServices.ZohoRedirectURL}&state=-5466400890088961855`, '_self')
  }

  getTickets() {
    this.showSignIn = false;
    this.spinner.show();
    this.CommonService.getTicketZoho(localStorage.getItem('zohoTokens')).subscribe(
      (res) => {
        this.spinner.hide();
        this.ticketData = res.data,
          this.loadScript();

      }
    )
  }

  createticket() {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateTicketComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('Compose dialog was closed!');
      this.getTickets();
    });
  }

  getDateTimeAgo(stringData: any) {
    return moment(new Date(stringData)).from(new Date())
  }

  getTicketWithId(id: any) {
    this._router.navigate([], {
      queryParams: { id },
      queryParamsHandling: 'merge',
    })
  }

  loadScript() {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
