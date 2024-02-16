import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckListPageComponent } from './check-list-page/check-list-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'checklist',
    pathMatch: 'full',
  },
  {
    path: 'checklist',
    pathMatch: 'full',
    component: CheckListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
