import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-licence-permanent',
  templateUrl: './delete-licence-permanent.component.html',
  styleUrls: ['./delete-licence-permanent.component.scss']
})
export class DeleteLicencePermanentComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/licence/permanent']);
  }

}
