import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-version',
  templateUrl: './delete-version.component.html',
  styleUrls: ['./delete-version.component.scss']
})
export class DeleteVersionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/releases']);
  }

}
