import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComboboxComponent } from './products-combobox.component';

describe('ProductsComboboxComponent', () => {
  let component: ProductsComboboxComponent;
  let fixture: ComponentFixture<ProductsComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComboboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
