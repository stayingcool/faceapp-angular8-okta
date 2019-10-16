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

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  OKTA_CONFIG,
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';

import sampleConfig from './app.config';

const oktaConfig = Object.assign({
  onAuthRequired: ({ oktaAuth, router }) => {
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, sampleConfig.oidc);

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { SampleUploadService } from './services/sample.upload.service';
import { ConfigService } from './config/config.service';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [OktaAuthGuard],
  },
];

import { PrimeNGModule } from './primeng.module';
import { PricingComponent } from './pricing/pricing.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    MessagesComponent,
    LoginComponent,
    PricingComponent,
    CheckoutComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule,
    PrimeNGModule
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    SampleUploadService,
    ConfigService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
