import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './app/weather.service';
import { ThemeService } from './app/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div [class]="isDarkTheme ? 'dark' : 'light'" class="min-h-screen transition-colors duration-300" [style.background-color]="isDarkTheme ? 'var(--bg-primary)' : 'var(--bg-primary)'">
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold" [style.color]="isDarkTheme ? 'var(--text-primary)' : 'var(--text-primary)'">
            Weather App
          </h1>
          <button (click)="toggleTheme()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <i [class]="isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'" class="text-xl"></i>
          </button>
        </div>

        <div class="mb-8">
          <div class="flex gap-4">
            <input
              type="text"
              [(ngModel)]="cityName"
              (keyup.enter)="searchWeather()"
              placeholder="Enter city name..."
              class="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            />
            <button
              (click)="searchWeather()"
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div *ngIf="weatherData" class="fade-in">
          <div class="weather-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-4 dark:text-white">{{ weatherData.city }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <i class="fas fa-temperature-high text-3xl text-red-500 mb-2"></i>
                <p class="text-gray-600 dark:text-gray-300">Temperature</p>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.list[0].temp }}°C</p>
              </div>
              <div class="text-center">
                <i class="fas fa-wind text-3xl text-blue-500 mb-2"></i>
                <p class="text-gray-600 dark:text-gray-300">Wind Speed</p>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.list[0].windSpeed }} m/s</p>
              </div>
              <div class="text-center">
                <i class="fas fa-tint text-3xl text-blue-400 mb-2"></i>
                <p class="text-gray-600 dark:text-gray-300">Humidity</p>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.list[0].humidity }}%</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let forecast of weatherData.list.slice(1, 5)" class="weather-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <p class="text-gray-600 dark:text-gray-300 mb-2">{{ forecast.date | date:'short' }}</p>
              <img [src]="'https://openweathermap.org/img/w/' + forecast.icon + '.png'" alt="Weather icon" class="mx-auto mb-2">
              <p class="text-xl font-bold mb-2 dark:text-white">{{ forecast.temp }}°C</p>
              <p class="text-gray-600 dark:text-gray-300">{{ forecast.description }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>
      </div>
    </div>
  `
})
export class App implements OnInit {
  cityName: string = 'Saint Louis';
  weatherData: any;
  error: string = '';
  isDarkTheme: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.searchWeather();
    this.themeService.isDarkTheme$.subscribe(
      isDark => this.isDarkTheme = isDark
    );
  }

  searchWeather() {
    if (!this.cityName) return;
    
    this.weatherService.getWeather(this.cityName).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to fetch weather data. Please try again.';
        console.error('Weather fetch error:', err);
      }
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
  ]
});