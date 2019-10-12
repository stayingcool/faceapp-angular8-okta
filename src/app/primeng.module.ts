
import { NgModule } from '@angular/core';

import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ProgressBarModule} from 'primeng/progressbar';


@NgModule({
  imports: [
    CardModule,
    ButtonModule,
    AccordionModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    ProgressSpinnerModule,
    ProgressBarModule
  ],
  exports: [
    CardModule,
    ButtonModule,
    AccordionModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    ProgressSpinnerModule,
    ProgressBarModule,
  ]
})
export class PrimeNGModule { }
