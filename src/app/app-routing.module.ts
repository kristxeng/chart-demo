import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './main/components/list/list.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListComponent, 
    pathMatch: 'full',
  },
  { 
    path: ':symbol',
    loadChildren: () => import('./drill-down/drill-down.module').then(m => m.DrillDownModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
