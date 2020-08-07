import { async, TestBed } from '@angular/core/testing';
import { CntMasksModule } from './cnt-masks.module';

describe('CntMasksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CntMasksModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CntMasksModule).toBeDefined();
  });
});
