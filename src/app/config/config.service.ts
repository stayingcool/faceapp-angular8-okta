import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Config {
    configUrl: string;
  }

@Injectable()
export class ConfigService {
    configUrl = 'assets/config.json';

    constructor(private http: HttpClient) { }

    getConfig() {
        // now returns an Observable of Config
        return this.http.get<Config>(this.configUrl);
      }

}

