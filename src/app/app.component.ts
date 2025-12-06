import { Component, ViewChild } from '@angular/core';
import { HabitListComponent } from './habit-list.component';
import { TrackerComponent } from './tracker/tracker.component';
import { StatsComponent } from './stats/stats.component';
import { CommonModule } from '@angular/common';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HabitListComponent, TrackerComponent, StatsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('tracker') tracker!: TrackerComponent;

  selectedHabit: Habit | null = null;

  constructor(private habitService: HabitService) {
    this.habitService.habits$.subscribe(habits => {
      if (this.selectedHabit) {
        const updated = habits.find(h => h.id === this.selectedHabit!.id);
        this.selectedHabit = updated || null;
      }
    });
  }

  select(habit: Habit) {
    this.selectedHabit = habit;
  }
}
