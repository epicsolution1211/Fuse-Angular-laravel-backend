import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-licence-subscription',
  templateUrl: './delete-licence-subscription.component.html',
  styleUrls: ['./delete-licence-subscription.component.scss']
})
export class DeleteLicenceSubscriptionComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/licence/subscription']);
  }

}
