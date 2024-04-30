import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVotingPointsConfigutaionsComponent } from './create-voting-points-configutaions.component';

describe('CreateVotingPointsConfigutaionsComponent', () => {
  let component: CreateVotingPointsConfigutaionsComponent;
  let fixture: ComponentFixture<CreateVotingPointsConfigutaionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVotingPointsConfigutaionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVotingPointsConfigutaionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
