import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitListComponent } from './habit-list.component';
import { HabitService } from './habit.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatListModule }      from '@angular/material/list';
import { MatButtonModule }    from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HabitListComponent', () => {
  let component: HabitListComponent;
  let fixture: ComponentFixture<HabitListComponent>;
  let service: HabitService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, FormsModule,
        MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [HabitService],
      declarations: [HabitListComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HabitListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(HabitService);
    fixture.detectChanges();
  });

  it('должен добавлять привычку через форму', () => {
    component.habitForm.setValue({name: 'Новая'});
    component.addHabit();
    service.getHabits().subscribe(habits => {
      expect(habits.some(h => h.name === 'Новая')).toBe(true);
    });
  });
});
