import { Component, EventEmitter, Output } from '@angular/core';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatListModule }      from '@angular/material/list';
import { MatCardModule }      from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatListModule, MatCardModule, MatIcon
  ],
  templateUrl: './habit-list.component.html',
  styleUrls: ['./habit-list.component.css']
})
export class HabitListComponent {
  @Output() habitSelected = new EventEmitter<Habit>();

  habits: Habit[] = [];
  habitForm: FormGroup;

  constructor(private habitService: HabitService, private fb: FormBuilder) {
    // Создание формы с полем name (обязательное поле)
    this.habitForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Подписываемся на обновления списка привычек
    this.habitService.getHabits().subscribe(habits => this.habits = habits);
  }

  // Обработчик отправки формы
  addHabit() {
    if (this.habitForm.valid) {
      const name = this.habitForm.value.name;
      this.habitService.addHabit(name);
      this.habitForm.reset();
    }
  }

  // Выбрать привычку (отправляем событие родительскому компоненту)
  selectHabit(habit: Habit) {
    this.habitSelected.emit(habit);
  }

  // Удалить привычку
  deleteHabit(id: number) {
    this.habitService.removeHabit(id);
  }
}
