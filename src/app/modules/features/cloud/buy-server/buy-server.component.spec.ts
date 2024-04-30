import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyServerComponent } from './buy-server.component';

describe('BuyServerComponent', () => {
  let component: BuyServerComponent;
  let fixture: ComponentFixture<BuyServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
