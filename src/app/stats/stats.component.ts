import { Component, Input, OnChanges } from '@angular/core';
import { Habit } from '../habit.model';
import { HabitService } from '../habit.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnChanges {
  @Input() habit!: Habit | null;
  @Input() currentDate!: Date;

  currentStreak: number = 0;
  weeklyCounts: { week: number, count: number }[] = [];

  constructor(private habitService: HabitService) {}

  ngOnChanges() {
    if (this.habit && this.currentDate) {
      this.updateStats();
    }
  }

  private updateStats() {
    this.currentStreak = this.getStreak();
    this.calculateWeeklyCounts();
  }

  private getStreak(): number {
    if (!this.habit || !this.habit.completions.length) return 0;

    const sortedDates = this.habit.completions
      .map(d => {
        const dt = new Date(d);
        dt.setHours(0, 0, 0, 0);
        return dt.getTime();
      })
      .sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let prev = today.getTime();

    for (const t of sortedDates) {
      const diffDays = (prev - t) / (1000 * 3600 * 24);
      if (diffDays >= 0 && diffDays <= 1) {
        streak++;
        prev = t;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateWeeklyCounts() {
    if (!this.habit || !this.currentDate) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const counts: { [week: number]: number } = {};

    for (const dateStr of this.habit.completions) {
      const d = new Date(dateStr);

      if (d.getMonth() !== month || d.getFullYear() !== year) continue;

      const week = Math.floor((d.getDate() + firstDay - 1) / 7);

      counts[week] = (counts[week] || 0) + 1;
    }

    this.weeklyCounts = Object.keys(counts)
      .map(week => ({
        week: +week + 1,
        count: counts[+week]
      }))
      .sort((a, b) => a.week - b.week);
  }
}
