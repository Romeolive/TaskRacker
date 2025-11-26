// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }         from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations }    from '@angular/platform-browser/animations';
import { importProvidersFrom }   from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // требуется для Angular Material
    importProvidersFrom(BrowserAnimationsModule)
  ]
})
  .catch(err => console.error(err));
