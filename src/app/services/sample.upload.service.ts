import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { ConfigService, Config } from '../config/config.service';
import { IPredictedImage } from '../home/predicted.model.image';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
    })
};

@Injectable()
export class SampleUploadService {
    configUrl = 'assets/config.json';
    config: Config;
    trainAPIURL = 'http://127.0.0.1:5001/train';
    predictAPIURL = 'http://127.0.0.1:5001/predict';

    constructor(private http: HttpClient, private configService: ConfigService) {
        // TODO - Use config later
        this.configService.getConfig()
            .subscribe((data: Config) => this.config = {
                configUrl: (data as any).trainUrl
            });
    }

    uploadSampleFiles(event, person: string, client: string): Observable<any> {
        // httpOptions.headers = httpOptions.headers.append('person', person);
        httpOptions.headers = httpOptions.headers.set('person', person);
        httpOptions.headers = httpOptions.headers.set('client', client);
        console.log(JSON.stringify(httpOptions.headers));

        let fileFormData = new FormData();
        event.files.forEach(element => {
            fileFormData.append("samples", element);
        });

        console.log('Going to upload files');
        return this.http.post<any>(this.trainAPIURL, fileFormData, httpOptions)
            .pipe(catchError(this.handleError));
    }

    predictFaces(event, client: string): Observable<IPredictedImage[]> {
        httpOptions.headers = httpOptions.headers.set('client', client);
        let fileFormData = new FormData();
        event.files.forEach(element => {
            fileFormData.append("file", element);
        });

        console.log('Going to upload files');
        return this.http.post<IPredictedImage[]>(this.predictAPIURL, fileFormData, httpOptions)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}