import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyMovimiento } from './destroy-movimiento';

describe('DestroyMovimiento', () => {
  let component: DestroyMovimiento;
  let fixture: ComponentFixture<DestroyMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestroyMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestroyMovimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
