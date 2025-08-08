import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProducto } from './list-producto';

describe('ListProducto', () => {
  let component: ListProducto;
  let fixture: ComponentFixture<ListProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
