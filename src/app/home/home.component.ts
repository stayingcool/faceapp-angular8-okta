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

import { Component, OnInit, ViewChild } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { SampleUploadService } from '../services/sample.upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IPredictedImage } from './predicted.model.image';
import { Validators, FormControl, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { FileUpload } from 'primeng/fileupload';

interface ResourceServerExample {
  label: String;
  url: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean;
  userName: string;
  uploadedTrainingFiles: any[] = [];
  uploadedPredictionFiles: any[] = [];
  showProgressBar: boolean;
  showFaceDetectionProgressBar: boolean;
  trainingComplete: boolean;
  predictionComplete: boolean;
  maximumNoOfTrainingFiles: boolean;
  maximumNoOfPredictionFiles: boolean;
  personToDetect: string;
  predictedImages: IPredictedImage[] = [];
  values2: string[] = ['one', 'two'];
  trainedFaces: string[] = [];
  trainingForm: FormGroup;
  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;
  lesserThanTwoFiles: boolean;

  constructor(public oktaAuth: OktaAuthService, private sampleUploadService: SampleUploadService,
    private sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
    this.trainingForm = this.fb.group({
      'personToDetect': new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name;
    }

    this.sampleUploadService.getTrainedFaces(this.userName).subscribe(response => {
      this.trainedFaces = response.trained_on;
    })
  }

  onTrainingFilesUploadSelection(event) {
    for (let file of event.files) {
      let r = this.uploadedTrainingFiles.findIndex(item => item.name === file.name);
      if (r === -1)
        this.uploadedTrainingFiles.push(file);
    }
    this.uploadedTrainingFiles.push();

    if (this.uploadedTrainingFiles.length < 2) {
      this.lesserThanTwoFiles = true;
      return;
    } else
      this.lesserThanTwoFiles = false;

    this.checkMaximumTrainingUploadCount();
  }

  onTrainingFileUploadRemoval(event) {
    this.uploadedTrainingFiles.splice(this.uploadedTrainingFiles.findIndex(item => item.name === event.file.name), 1);
    if (this.uploadedTrainingFiles.length < 2) {
      this.lesserThanTwoFiles = true;
      return;
    } else
      this.lesserThanTwoFiles = false;

    this.checkMaximumTrainingUploadCount();
  }

  onPredictionFilesUploadSelection(event) {
    for (let file of event.files) {
      let r = this.uploadedPredictionFiles.findIndex(item => item.name === file.name);
      if (r === -1)
        this.uploadedPredictionFiles.push(file);
    }
    this.uploadedPredictionFiles.push();

    if (this.uploadedPredictionFiles.length < 2) {
      this.lesserThanTwoFiles = true;
      return;
    } else
      this.lesserThanTwoFiles = false;

    this.checkMaximumPredictionUploadCount();
  }

  onPredictionFileUploadRemoval(event) {
    this.uploadedPredictionFiles.splice(this.uploadedPredictionFiles.findIndex(item => item.name === event.file.name), 1);
    this.checkMaximumPredictionUploadCount();
  }

  checkMaximumTrainingUploadCount() {
    if (this.uploadedTrainingFiles.length > 5)
      this.maximumNoOfTrainingFiles = true
    else
      this.maximumNoOfTrainingFiles = false;
  }

  checkMaximumPredictionUploadCount() {
    console.log('Checking maximum allowed upload count...');
    if (this.uploadedPredictionFiles.length > 10)
      this.maximumNoOfPredictionFiles = true
    else
      this.maximumNoOfPredictionFiles = false;
  }

  train(event, trainingFileUpload: FileUpload) {
    if (this.maximumNoOfTrainingFiles)
      return;

    if (this.lesserThanTwoFiles)
      return;

    if (this.trainingForm.get('personToDetect').value)
      this.personToDetect = this.trainingForm.get('personToDetect').value.toLowerCase();
    else {
      if (this.trainingForm.get('personToDetect').value === '' || this.trainingForm.get('personToDetect').value === null) {
        this.trainingForm.controls['personToDetect'].markAsDirty();
        return;
      }
    }

    this.showProgressBar = true;
    this.trainingComplete = false;
    this.sampleUploadService.uploadSampleFiles(event, this.personToDetect, this.userName).subscribe(response => {
      if (!this.trainedFaces.includes(this.personToDetect))
        this.trainedFaces.push(this.personToDetect);

      setTimeout(() => {
        this.showProgressBar = false;
        this.trainingComplete = true;
        trainingFileUpload.clear();
        this.formGroupDirective.resetForm();
      }, 3 * 1000);

    });
  }

  predict(event) {
    if (this.maximumNoOfPredictionFiles)
      return;

    this.showFaceDetectionProgressBar = true;
    this.predictedImages = [];

    let predictionImageDetailsMap = new Map<string, SafeUrl>();
    let safeURL: SafeUrl = '';

    event.files.forEach(file => {
      safeURL = this.sanitizer.bypassSecurityTrustUrl(file.objectURL.changingThisBreaksApplicationSecurity);
      predictionImageDetailsMap.set(file.name, safeURL);
    });

    this.predictionComplete = false;
    this.sampleUploadService.predictFaces(event, this.userName).subscribe((response: IPredictedImage[]) => {
      response.forEach((f) => {
        f.fileURL = predictionImageDetailsMap.get(f.filename);
        this.predictedImages.push({
          fileURL: predictionImageDetailsMap.get(f.filename),
          filename: f.filename,
          faces: f.faces
        });
      });

      setTimeout(() => {
        this.predictionComplete = true;
        this.showFaceDetectionProgressBar = false;
      }, 3 * 1000);

    })
  }

  verifyDownloadCount(event, trainingFileUpload) {
    if (event.files.length < 2) {
      this.lesserThanTwoFiles = true;
      return;
    } else
      this.lesserThanTwoFiles = false;
  }

}

