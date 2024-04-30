import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { DownloadService } from 'app/shared/services/download.service';
import { ConfirmationDialog } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseAlertType } from '@fuse/components/alert';
import { NgxSpinnerService } from 'ngx-spinner';
import { CloudService } from 'app/shared/services/cloud.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CloudPopupComponent } from './cloud-popup/cloud-popup.component';
import { BuyServerComponent } from './buy-server/buy-server.component';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {
  /** mat table */
  displayedColumns = ['servername', 'dedicatedip', 'domain', 'name', 'mysqlpass', 'status', 'vpsstatus', 'bandwidth', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** ClousText */
  ClousText: string;

  serversData: any;


  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  signInForm: FormGroup;
  showAlert: boolean = false;
  globUserdata: any;


  constructor(private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cloudService: CloudService,
    private _matDialog: MatDialog,
  ) {


    const clodData: any = JSON.parse(localStorage.getItem('cloudData')!);
    if (clodData != null) {
      const cloudUserLoginData: any = JSON.parse(localStorage.getItem('cloudUserLoginData'));
      this.cloudService.signInCloudServer(cloudUserLoginData).then(data => {
        this.ClousText = 'Atavism Cloud Servers';
        const samData: any = data;
        // console.log("samData",samData);
        const tempData: any = [];
        for (const property in samData) {
          if (`${property}` != 'nn_user_id') {
            tempData.push(data[property]);
          }
        }
        localStorage.setItem('cloudData', JSON.stringify(tempData));
        this.dataSource = new MatTableDataSource(tempData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success('Server created successfully ', 'Success!', { progressBar: true });
        this.spinner.hide();
      }, error => {
        // console.log(error);
        this.toastr.error(error.error.error.message, 'Error');
        this.spinner.hide();
      });
      this.serversData = clodData;
      this.dataSource = new MatTableDataSource(clodData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.ClousText = 'Atavism Cloud Servers';
    } else {
      this.ClousText = 'Atavism Cloud';
    }
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }



  ngOnInit(): void {

    /** get globle user ID */
    const userData: any = JSON.parse(localStorage.getItem('user'));
    this.globUserdata = userData;
    // console.log(userData);
    // Create the form
    this.signInForm = this._formBuilder.group({
      userId: [this.globUserdata.id, [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberme: [1]
    });
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.signInForm.valid) {
      this.spinner.show();
      this.cloudService.signInCloudServer(this.signInForm.value).then(data => {
        this.ClousText = 'Atavism Cloud Servers';
        const samData: any = data;
        const tempData: any = [];
        for (const property in samData) {
          if (`${property}` != 'nn_user_id') {
            tempData.push(data[property]);
          }
        }
        localStorage.setItem('cloudData', JSON.stringify(tempData));
        localStorage.setItem('cloudUserLoginData', JSON.stringify({...this.signInForm.value, 'nn_user_id': samData.nn_user_id}));
        this.dataSource = new MatTableDataSource(tempData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success('Atavism cloud login Successfully ', 'Success!', { progressBar: true });
        this.spinner.hide();
      }, error => {
        // console.log(error);
        this.toastr.error(error.error.error.message, 'Error');
        this.spinner.hide();
      });
    }
  }

  /** VPS controle button */
  vpsControl(type: string) {
    const confirmTitle: any = {};
    if (type == 'start') {
      confirmTitle.headerText = 'Are you sure you want to start VPS server ?';
      confirmTitle.confirmButton = 'Start VPS server';
      confirmTitle.startVPS = true;
    } else if (type == 'stop') {
      confirmTitle.headerText = 'Are you sure you want to stop VPS server ?';
      confirmTitle.confirmButton = 'Stop VPS server';
      confirmTitle.stopVPS = true;
    } else if (type == 'restart') {
      confirmTitle.headerText = 'Are you sure you want to restart VPS server ?';
      confirmTitle.confirmButton = 'Restart VPS server';
      confirmTitle.restartVPS = true;
    } else if (type == 'logout') {
      confirmTitle.headerText = 'Are you sure you want to disconnect from the North Networking account.';
      confirmTitle.confirmButton = 'Disconnect account';
      confirmTitle.logoutVPS = true;
    }

    const dialogRef = this._matDialog.open(CloudPopupComponent, {
      data: { dialogData: confirmTitle }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.startVPS) {
        this.startVPS();
      } else if (result.stopVPS) {
        this.stopVPS();
      } else if (result.restartVPS) {
        this.restartVPS();
      } else if (result.logoutVPS) {
        this.logoutFromCloud();
      }
    });
  }

  /** start VPS server */
  startVPS() {
    const body = {
      "vpsid": 1175
    };

    this.spinner.show();
    this.cloudService.startVPSserver(body).then((data: any) => {
      // console.log(data.error.code);
      if (data.error.code == 200) {
        this.serversData.forEach(server => {
          if (server.vpsid == data.data.vsop.id) {
            server.vpsstatus = 1;
          }
        });
        localStorage.setItem('cloudData', JSON.stringify(this.serversData));
        this.dataSource = new MatTableDataSource(this.serversData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success(data.data.done_msg, 'Success!', { progressBar: true });
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error(error.error.message, 'Error');
      this.spinner.hide();
    });
  }


  /** stop vps server */
  stopVPS() {
    const body = {
      "vpsid": this.globUserdata.id
    };
    this.spinner.show();
    this.cloudService.stopVPSserver(body).then((data: any) => {
      if (data.data.done) {
        this.serversData.forEach(server => {
          if (server.vpsid == data.data.vsop.id) {
            server.vpsstatus = 0;
          }
        });
        localStorage.setItem('cloudData', JSON.stringify(this.serversData));
        this.dataSource = new MatTableDataSource(this.serversData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success(data.data.done_msg, 'Success!', { progressBar: true });
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error(error.error.message, 'Error');
      this.spinner.hide();
    });
  }

  /** restart VPS server */
  restartVPS() {
    const body = {
      "vpsid": this.globUserdata.id
    };

    this.spinner.show();
    this.cloudService.restartVPSserver(body).then((data: any) => {
      if (data.error.code == 200) {
        this.serversData.forEach(server => {
          if (server.vpsid == data.data.vsop.id) {
            server.vpsstatus = 1;
          }
        });
        localStorage.setItem('cloudData', JSON.stringify(this.serversData));
        this.dataSource = new MatTableDataSource(this.serversData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success(data.data.done_msg, 'Success!', { progressBar: true });
      }
      this.spinner.hide();
    }, error => {
      if (error.error.data.done) {
        this.serversData.forEach(server => {
          if (server.vpsid == error.error.data.vsop.id) {
            server.vpsstatus = 1;
          }
        });
        localStorage.setItem('cloudData', JSON.stringify(this.serversData));
        this.dataSource = new MatTableDataSource(this.serversData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toastr.success(error.error.data.done_msg, 'Success!', { progressBar: true });
      }
      // console.log(error);
      // this.toastr.error(error.error.message, 'Error');
      this.spinner.hide();
    });
  }

  /** logout from cloud server */
  logoutFromCloud() {
    const body = {
      "nn_user_id": this.globUserdata.id
    };

    this.spinner.show();
    this.cloudService.logOutCloud(body).then((data: any) => {
      if (data.error.code == 200) {
        this.ClousText = 'Atavism Cloud';
        localStorage.removeItem("cloudData");
        this.toastr.success(data.error.message, 'Success!', { progressBar: true });
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error(error.error.message, 'Error');
      this.spinner.hide();
    });
  }

  /** buyVPSServer server */
  buyVPSServer() {
    /** open buy-server component */
    const dialogRef = this._matDialog.open(BuyServerComponent, {
      data: { dialogData: 'Create server' }
    });

    /** close the open dialog */
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

}



export interface PeriodicElement {
  servername: string;
  dedicatedip: string;
  domain: string;
  name: string;
  mysqlpass: string;
  vpsstatus: string;
  bandwidth: string;
}
