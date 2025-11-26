
import { TestBed } from '@angular/core/testing';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitService);
    // Очистим localStorage перед каждым тестом
    localStorage.clear();
  });

  it('должен добавлять привычку', () => {
    service.addHabit('Тест');
    service.getHabits().subscribe(habits => {
      expect(habits.length).toBe(1);
      expect(habits[0].name).toBe('Тест');
    });
  });

  it('должен отмечать и снимать выполнение дня', () => {
    service.addHabit('T');
    let habits: any[] = [];
    service.getHabits().subscribe(h => habits = h);
    const habitId = habits[0].id;
    const date = new Date().toISOString().substring(0, 10);
    service.toggleCompletion(habitId, date);
    expect(habits[0].completions).toContain(date);
    service.toggleCompletion(habitId, date);
    expect(habits[0].completions).not.toContain(date);
  });
});
