import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyProducto } from './destroy-producto';

describe('DestroyProducto', () => {
  let component: DestroyProducto;
  let fixture: ComponentFixture<DestroyProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestroyProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestroyProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
