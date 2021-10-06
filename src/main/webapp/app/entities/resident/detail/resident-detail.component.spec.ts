import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ResidentDetailComponent } from './resident-detail.component';

describe('Component Tests', () => {
  describe('Resident Management Detail Component', () => {
    let comp: ResidentDetailComponent;
    let fixture: ComponentFixture<ResidentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ResidentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ resident: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ResidentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResidentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load resident on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.resident).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
