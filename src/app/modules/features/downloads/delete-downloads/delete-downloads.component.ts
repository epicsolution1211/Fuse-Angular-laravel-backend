import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-downloads',
  templateUrl: './delete-downloads.component.html',
  styleUrls: ['./delete-downloads.component.scss']
})
export class DeleteDownloadsComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    const type = this.route.snapshot.params.type;
    this.router.navigate(['/downloads/'+type]);
  }

}
