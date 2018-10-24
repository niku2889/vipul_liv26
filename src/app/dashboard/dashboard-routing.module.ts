import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import { Dashboard3Component } from "./dashboard3/dashboard3.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'mappingvideo',
        component: Dashboard1Component,
        data: {
          title: 'Mapping Video'
        }
      },
      {
        path: 'medialocation',
        component: Dashboard2Component,
        data: {
          title: 'Media Location'
        }
      },
      {
        path: 'media',
        component: Dashboard3Component,
        data: {
          title: 'Media'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
