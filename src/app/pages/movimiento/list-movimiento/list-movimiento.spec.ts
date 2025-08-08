import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMovimiento } from './list-movimiento';

describe('ListMovimiento', () => {
  let component: ListMovimiento;
  let fixture: ComponentFixture<ListMovimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMovimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMovimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
