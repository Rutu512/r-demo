import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ResidentService } from '../service/resident.service';

import { ResidentComponent } from './resident.component';

describe('Component Tests', () => {
  describe('Resident Management Component', () => {
    let comp: ResidentComponent;
    let fixture: ComponentFixture<ResidentComponent>;
    let service: ResidentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ResidentComponent],
      })
        .overrideTemplate(ResidentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResidentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ResidentService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.residents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
