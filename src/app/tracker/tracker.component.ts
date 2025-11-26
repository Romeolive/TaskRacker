import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../habit.model';
import { HabitService } from '../habit.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnChanges {
  @Input() habit!: Habit | null;
  weeks: Date[][] = [];

  constructor(private habitService: HabitService) {}

  ngOnChanges() {
    if (this.habit) {
      this.generateCalendar(new Date());
    }
  }

  private generateCalendar(currentDate: Date) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.weeks = [];
    let week: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      week.push(new Date(NaN));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const d = new Date(year, month, day);
      week.push(d);

      if (d.getDay() === 6 || day === lastDay.getDate()) {
        this.weeks.push(week);
        week = [];
      }
    }
  }

  isNaN(value: number): boolean {
    return Number.isNaN(value);
  }

  isCompleted(date: Date): boolean {
    if (!this.habit) return false;
    const iso = date.toISOString().substring(0, 10);
    return this.habit.completions.includes(iso);
  }

  toggleDate(date: Date) {
    if (!this.habit || Number.isNaN(date.getTime())) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // обнуляем часы для точного сравнения
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    // запрет на будущее
    if (target.getTime() > today.getTime()) return;

    const iso = target.toISOString().substring(0, 10);
    this.habitService.toggleCompletion(this.habit.id, iso);
  }

}
