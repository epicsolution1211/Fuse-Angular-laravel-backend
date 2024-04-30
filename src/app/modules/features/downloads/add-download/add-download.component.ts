import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-download',
  templateUrl: './add-download.component.html',
  styleUrls: ['./add-download.component.scss']
})
export class AddDownloadComponent implements OnInit {
  form: FormGroup;
  submitted;
  licences: any;
  today = new Date();
  isLoading: boolean;
  download: any;
  url: string;
  versions: any;
  selected;
  public status = [
    { "id": 0, "name": "Inactive" },
    { "id": 1, "name": "Active" }
  ];
  public selectedCategory = "Atavism Server";
  public selected2 = this.status[1].id;
  public selectedVersionArr = [];

  constructor(
    public matDialogRef: MatDialogRef<AddDownloadComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.version) {
      this.selected = data.version;
    }
    if (data.category) {
      this.selectedCategory = data.category;
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const hash = window.location.pathname;
    const parts = hash.split('/');
    // const part = parts[2].split(';');
    this.url = parts.pop();

    this.commonService.getAllVersions().subscribe(res => {
      this.versions = res.data.versions;
      /*if(this.data.latest_version){
        this.selected = this.data.latest_version;
      }*/
    });

    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      licences: [[], [Validators.required]],
      dropbox: ['', [Validators.required]],
      release_date: ['', [Validators.required]],
      release_date_show: ['', [Validators.required]],
      discription: ['', [Validators.required]],
      version: ['', [Validators.required]],
      status: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    if (this.data.downloadId != undefined) {
      this.commonService.getDownloadById(this.data.downloadId).subscribe(res => {

        // console.log("res>>>>>>>>", res);

        this.download = res.data.download;
        const date = new Date(res.data.release_date);
        const release_date_show = new Date(res.data.release_date_show);
        this.selected = this.download.release_version;
        this.selectedCategory = this.download.category;
        const selectedVersionObj = {};
        const selectedVersionSpl = this.selected.split("|");
        const selectedVersionLen = this.selected.split("|").length;
        for (let i = 0; i < selectedVersionLen; i++) {
          this.selectedVersionArr.push({ "id": i, "version": selectedVersionSpl[i] });
        }

        this.selected2 = this.download.active;
        this.form = this._formBuilder.group({
          name: [this.download.name, [Validators.required]],
          licences: [res.data.licences, [Validators.required]],
          dropbox: [this.download.dropbox, [Validators.required]],
          release_date: [date, [Validators.required]],
          release_date_show: [release_date_show, [Validators.required]],
          discription: [this.download.description, [Validators.required]],
          version: [this.selected, [Validators.required]],
          status: [this.selected2, [Validators.required]],
          category: [this.selectedCategory, [Validators.required]]
        });
      });
    }
    this.commonService.getLicencesTypes().subscribe(res => {
      this.licences = res.data.licence_types;
    });

  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }

  compareVersionObjects(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  compareVersionObjectsArr(object1: any, object2: any): boolean {
    return object1 && object2 && object1.version === object2.version;
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("downloadId", this.data.downloadId);
      formData.append("name", this.form.get("name").value);
      formData.append("category", this.form.get("category").value);
      formData.append("licences", this.form.get("licences").value);
      // formData.append("release_version",this.data.version);
      formData.append("release_version", JSON.stringify(this.form.value.version));
      // if(this.download == null){
      /*if(this.data.releaseId){
        formData.append("release_version",this.data.releaseId);
      }else{
        formData.append("release_version",this.form.get("version").value.name);
      }*/
      // }
      formData.append("dropbox", this.form.get("dropbox").value);
      formData.append("release_date", this.form.get("release_date").value);
      formData.append("release_date_show", this.form.get("release_date_show").value);
      formData.append("description", this.form.get("discription").value);
      formData.append("active", this.form.get("status").value);
      // formData.append("version_id",this.form.get('version').value.id);

      this.isLoading = true;
      this.commonService.addDownloads(formData).subscribe(data => {

        // console.log("data>>>>>>>>>>>", data);

        this.submitted = false;
        // this._router.navigate(['/releases/latest',{type:this.url}]);
        this.isLoading = false;
        this.toastr.success(data.message, 'Success!', { progressBar: true });
        this.matDialogRef.close();
        // this._router.navigate(['/downloads/delete', { type: this.url }]);
      }, error => {
        // console.log(error.error.message);
        this.isLoading = false;
        // this._router.navigate(['/releases']);
        this.toastr.error(error.error.message, 'Error');
        // this.matDialogRef.close();
        // this._router.navigate(['/downloads/delete', { type: this.url }]);
      });
    }
  }
}
