import { Component, ComponentFactoryResolver, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-archieve',
  templateUrl: './add-archieve.component.html',
  styleUrls: ['./add-archieve.component.scss']
})
export class AddArchieveComponent implements OnInit {
  form: FormGroup;
  submitted;
  isLoading: boolean;
  id:any;
  licence_id:any;
  constructor(
    public matDialogRef: MatDialogRef<AddArchieveComponent>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.id){
      this.id = data.id;
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      reason_id: [this.id],
      reason: ['', [Validators.required]],
    });
  }

  saveAndClose(): void
  {
    // Close the dialog
    this.matDialogRef.close();
  }

  save(){
    this.submitted = true;
    if(this.form.valid){
      const formData = new FormData();
      formData.append("reason_id",this.id);
      formData.append("licence_id",this.licence_id);
      formData.append("reason",this.form.get("reason").value);
      this.isLoading = true;
      this.commonService.addArchive(formData).subscribe(data => {
          this.submitted = false;
          this.isLoading = false;
          this.toastr.success(data.message, 'Success!', {progressBar: true});
          this.matDialogRef.close();
          this._router.navigate(['/feedback-configuration']);
        }, error => {
          this.isLoading = false;
          this.toastr.error(error.error.message, 'Error');
          this._router.navigate(['/feedback-configuration']);
      });
    }
  }
}
