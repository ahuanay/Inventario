import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyAlmacen } from './destroy-almacen';

describe('DestroyAlmacen', () => {
  let component: DestroyAlmacen;
  let fixture: ComponentFixture<DestroyAlmacen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestroyAlmacen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestroyAlmacen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
