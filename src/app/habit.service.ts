import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Habit } from './habit.model';


@Injectable({ providedIn: 'root' })
export class HabitService {
  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  public habits$ = this.habitsSubject.asObservable();

  constructor() {
    // Загрузка привычек из localStorage или пустой массив
    const data = JSON.parse(localStorage.getItem('habits') || '[]');
    this.habitsSubject.next(data);
  }

  // Получить текущий список привычек (Observable)
  getHabits() {
    return this.habits$;
  }

  // Добавить новую привычку
  addHabit(name: string) {
    const current = this.habitsSubject.value;
    const newHabit: Habit = {
      id: Date.now(), // простой уникальный id
      name,
      completions: []
    };
    this.habitsSubject.next([...current, newHabit]);
    this.saveToStorage();
  }

  // Удалить привычку по id
  removeHabit(id: number) {
    const updated = this.habitsSubject.value.filter(h => h.id !== id);
    this.habitsSubject.next(updated);
    this.saveToStorage();
  }

  toggleCompletion(habitId: number, date: string) {
    const habits = this.habitsSubject.value.map(h => {
      if (h.id === habitId) {
        const completions = [...h.completions];
        const idx = completions.indexOf(date);

        if (idx > -1) {
          completions.splice(idx, 1);
        } else {
          completions.push(date);
          completions.sort();
        }

        return { ...h, completions };
      }
      return h;
    });

    this.habitsSubject.next(habits);
    this.saveToStorage();
  }



  // Рассчитать текущий streak (количество подряд дней, включая последний)
  getCurrentStreak(habit: Habit): number {
    if (!habit.completions.length) return 0;

    const today = new Date();
    today.setHours(0,0,0,0);

    // Преобразуем все даты в Date и обнуляем часы
    const dates = habit.completions
      .map(d => {
        const dt = new Date(d);
        dt.setHours(0,0,0,0);
        return dt;
      })
      .filter(d => d.getTime() <= today.getTime())
      .sort((a,b) => b.getTime() - a.getTime());

    if (!dates.length) return 0;

    let streak = 0;
    let prev = today;

    for (const date of dates) {
      const diff = Math.round((prev.getTime() - date.getTime()) / (1000 * 3600 * 24));
      if (diff === 0 || diff === 1) {
        streak++;
        prev = date;
      } else {
        break;
      }
    }

    return streak;
  }



  private saveToStorage() {
    localStorage.setItem('habits', JSON.stringify(this.habitsSubject.value));
  }
}
