import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'app/shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  commentsData: [];
  commentFetchTimeOut: any = null;
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    this.spinner.show();
    this.getComments(params.get('id'));
    this.form = this._formBuilder.group({
      ticket_id: [params.get('id')],
      comment: ['', [Validators.required]]
    })
  }



  ngOnDestroy(): void {
    this.commentFetchTimeOut && clearInterval(this.commentFetchTimeOut)
  }

  getComments(id: any) {
    this.commonService.getTicketComments(localStorage.getItem('zohoTokens'), id).subscribe((res) => {
      this.commentsData = res.data;
      this.spinner.hide();
      this.commentFetchTimeOut = setInterval(() => {
        this.commonService.getTicketComments(localStorage.getItem('zohoTokens'), id).subscribe((res) => {
          this.commentsData = res.data;
        })
      }, 5000);
    })
  }

  save() {
    if (this.form.valid) {
      const body = {
        ticket_id: this.form.value.ticket_id,
        comment: this.form.value.comment,
        token: localStorage.getItem('zohoTokens')
      }
      this.spinner.show();
      this.commonService.createTicketComment(body).subscribe(res => {
        this.toastr.success(res.message, 'Success!', { progressBar: true });
        this.spinner.hide();
      })
    }
  }

}
