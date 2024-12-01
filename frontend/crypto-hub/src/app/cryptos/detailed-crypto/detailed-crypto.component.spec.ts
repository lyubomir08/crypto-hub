import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedCryptoComponent } from './detailed-crypto.component';

describe('DetailedCryptoComponent', () => {
  let component: DetailedCryptoComponent;
  let fixture: ComponentFixture<DetailedCryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedCryptoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
