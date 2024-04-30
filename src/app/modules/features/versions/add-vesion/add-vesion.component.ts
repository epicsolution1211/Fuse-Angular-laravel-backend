import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AddDownloadComponent } from '../../downloads/add-download/add-download.component';

@Component({
  selector: 'app-add-vesion',
  templateUrl: './add-vesion.component.html',
  styleUrls: ['./add-vesion.component.scss']
})
export class AddVesionComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean;
  // displayedColumns: string[] = ['name','description','date', 'downloads'];
  dataSource =  new MatTableDataSource<PeriodicElement>();selectedTab: number;
  downloads: any;
  submitted: boolean;
  releaseId: any;
  release: any;

  constructor(private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private _matDialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router,
    public matDialogRef: MatDialogRef<AddVesionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.releaseId = this.data?.releaseId;
    this.form = this._formBuilder.group({
      name: ['',[Validators.required]],
      version : ['',[Validators.required]],
      release_date : ['',[Validators.required]],
      server_key : [],
    });
    if(this.releaseId != null){
      this.isLoading = true;
      this.commonService.getReleaseById(this.releaseId).subscribe(res => {
        this.release = res.data.release;
        const date = new Date(res.data.release_date);
        this.form = this._formBuilder.group({
          name: [this.release.name,[Validators.required]],
          version : [this.release.version,[Validators.required]],
          release_date : [date,[Validators.required]],
          server_key : [this.release.server_key],
        });
        this.isLoading = false;
      });
    }
  }

  saveAndClose(): void
  {
    // Close the dialog
    this.matDialogRef.close();
  }

  save(){
    this.submitted = true;
    if(this.form.valid){
      this.isLoading = true;
      const formData = new FormData();
      formData.append("releaseId",this.releaseId);
      formData.append("name",this.form.get("name").value);
      formData.append("version",this.form.get("version").value);
      formData.append("release_date",this.form.get("release_date").value);
      formData.append("server_key",this.form.get("server_key").value);

      this.commonService.addVersion(formData).subscribe(data => {
        this.isLoading = false;
        this.submitted = false;
        this._router.navigate(['/releases/delete']);
        this.toastr.success(data.message, 'Success!', {progressBar: true});
        this.matDialogRef.close();
      }, error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error');
        this.matDialogRef.close();
      });
    }
  }
}

export interface PeriodicElement {
  name: string;
  description: string;
  date: number;
  download: string;
}
