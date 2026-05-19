import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemServicoList } from './ordem-servico-list';

describe('OrdemServicoList', () => {
  let component: OrdemServicoList;
  let fixture: ComponentFixture<OrdemServicoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdemServicoList],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdemServicoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
