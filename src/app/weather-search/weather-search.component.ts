import { Component } from '@angular/core';
import { Weather, GetWeatherService } from '../get-weather.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css'],
})
export class WeatherSearchComponent {
  cityToSearch: string;
  weather: Weather;
  error: any;
  respObj: any;

  cityFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
  ]);

  constructor(private getWeatherService: GetWeatherService) {}

  getCityToSearch(city: string): void {
    this.cityToSearch = city.trim();
    this.getWeatherService.getCityToSearch(this.cityToSearch);
  }

  clear() {
    this.weather = null;
  }

  showWeather() {
    this.getWeatherService
      .getWeatherResponse()
      // resp is of type `HttpResponse<Config>`
      .subscribe((resp) => {
        this.weather = { ...resp.body };
        console.log(this.weather);
        //this.setWeatherValues(this.weather);
      });
  }

  setWeatherValues(respObj: any) {
    if (respObj.cod === 200) {
      this.weather.success = true;
      this.weather.city = respObj.name;
      this.weather.iconId = respObj.weather[0].icon;
      this.weather.temp = parseFloat(respObj.main.temp).toFixed(1);
      this.weather.windSpeed = respObj.wind.speed.toFixed(1);
      this.weather.humidity = respObj.main.humidity;
      this.weather.country = respObj.sys.country;
      this.weather.clouds = respObj.weather[0].description;
      this.weather.feelsLike = parseFloat(respObj.main.feels_like).toFixed(1);
    } else {
      this.weather.success = false;
    }
  }
}
