import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePoolComponent } from './vote-pool.component';

describe('VotePoolComponent', () => {
  let component: VotePoolComponent;
  let fixture: ComponentFixture<VotePoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotePoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
