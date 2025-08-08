import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMovimiento } from './new-movimiento';

describe('NewMovimiento', () => {
  let component: NewMovimiento;
  let fixture: ComponentFixture<NewMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMovimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
