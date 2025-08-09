import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStock } from './list-stock';

describe('ListStock', () => {
  let component: ListStock;
  let fixture: ComponentFixture<ListStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
