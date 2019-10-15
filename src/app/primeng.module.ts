
import { NgModule } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChipsModule } from 'primeng/chips';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


@NgModule({
  imports: [
    CardModule,
    ButtonModule,
    AccordionModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    FieldsetModule,
    ToolbarModule,
    SplitButtonModule,
    ChipsModule,
    MessageModule

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
    FieldsetModule,
    ToolbarModule,
    SplitButtonModule,
    ChipsModule,
    MessageModule

  ]
})
export class PrimeNGModule { }
