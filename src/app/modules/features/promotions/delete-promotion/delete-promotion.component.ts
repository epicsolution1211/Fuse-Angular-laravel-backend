import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-promotion',
  templateUrl: './delete-promotion.component.html',
  styleUrls: ['./delete-promotion.component.scss']
})
export class DeletePromotionComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/promotions']);
  }

}
