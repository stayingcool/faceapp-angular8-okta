/*!
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { SampleUploadService } from '../services/sample.upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IPredictedImage } from './predicted.model.image';

interface ResourceServerExample {
  label: String;
  url: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean;
  resourceServerExamples: Array<ResourceServerExample>;
  userName: string;
  uploadedTrainingFiles: any[] = [];
  uploadedPredictionFiles: any[] = [];
  showProgressBar: boolean;
  trainingComplete: boolean;
  predictionComplete: boolean;
  personToDetect: string;
  predictedImages: IPredictedImage[] = [];

  constructor(public oktaAuth: OktaAuthService, private sampleUploadService: SampleUploadService,
    private sanitizer: DomSanitizer) {
    this.resourceServerExamples = [
      {
        label: 'Node/Express Resource Server Example',
        url: 'https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server',
      },
      {
        label: 'Java/Spring MVC Resource Server Example',
        url: 'https://github.com/okta/samples-java-spring-mvc/tree/master/resource-server',
      },
    ]
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated)
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name;
      console.log('this.userName : ' + this.userName);
    }
  }

  myUploader(event) {
    this.showProgressBar = true;
    this.trainingComplete = false;
    this.sampleUploadService.uploadSampleFiles(event, this.personToDetect, this.userName).subscribe(response => {
      console.log(response);
      setTimeout(() => {
        this.showProgressBar = false;
        this.trainingComplete = true;
      }, 3 * 1000);

    })
  }

  predict(event) {
    this.predictedImages = [];

    let predictionImageDetailsMap = new Map<string, SafeUrl>();
    let safeURL: SafeUrl = '';

    event.files.forEach(file => {
      safeURL = this.sanitizer.bypassSecurityTrustUrl(file.objectURL.changingThisBreaksApplicationSecurity);
      predictionImageDetailsMap.set(file.name, safeURL);
    });

    this.predictionComplete = false;
    this.sampleUploadService.predictFaces(event, this.userName).subscribe((response: IPredictedImage[]) => {
      console.dir(response);
      response.forEach((f) => {
        f.fileURL = predictionImageDetailsMap.get(f.filename);
        console.log(f.filename);
        console.log(f.faces);
        console.log(f.fileURL);
        this.predictedImages.push({
          fileURL: predictionImageDetailsMap.get(f.filename),
          filename: f.filename,
          faces: f.faces
        });
      });



      setTimeout(() => {
        // this.showProgressBar = false;
        this.predictionComplete = true;
      }, 3 * 1000);

    })
  }

}


// [
//   {
//     "filename": "test_image_1.jpeg",
//     "faces": [
//       {
//         "person": "shahrukh",
//         "coordinates": {
//           "left": 13,
//           "top": 22
//         }
//       }
//     ]
//   },
//   {
//     "filename": "test_image_2.jpeg",
//     "faces": [
//       {
//         "person": "unknown",
//         "coordinates": {
//           "left": 13,
//           "top": 22
//         }
//       },
//       {
//         "person": "unknown",
//         "coordinates": {
//           "left": 13,
//           "top": 22
//         }
//       }
//     ]
//   }
// ]

