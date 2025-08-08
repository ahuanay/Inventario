import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProducto } from './new-producto';

describe('NewProducto', () => {
  let component: NewProducto;
  let fixture: ComponentFixture<NewProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
