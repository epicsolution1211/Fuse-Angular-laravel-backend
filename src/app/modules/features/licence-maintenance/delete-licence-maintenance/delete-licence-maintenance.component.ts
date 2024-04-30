import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-licence-maintenance',
  templateUrl: './delete-licence-maintenance.component.html',
  styleUrls: ['./delete-licence-maintenance.component.scss']
})
export class DeleteLicenceMaintenanceComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/licence/maintenance']);
  }

}
