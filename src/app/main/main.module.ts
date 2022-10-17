import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ListComponent } from './components/list/list.component';
import { CardComponent } from './components/card/card.component';




@NgModule({
  declarations: [
    ListComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  exports: [
    ListComponent,
  ]
})
export class MainModule { }
