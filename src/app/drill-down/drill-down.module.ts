import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DrillDownComponent } from './drill-down.component';
import { ChartComponent } from './components/chart/chart.component';
import { MatSelectModule } from '@angular/material/select';


const routes: Routes = [
  { path: '', component: DrillDownComponent }
];

@NgModule({
  declarations: [
    DrillDownComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    RouterModule.forChild(routes),
  ]
})
export class DrillDownModule { }
