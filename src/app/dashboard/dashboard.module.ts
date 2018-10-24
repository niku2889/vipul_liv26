import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { Dashboard1Component, NgbdModalContent } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import { Dashboard3Component } from "./dashboard3/dashboard3.component";
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { AutoCompleteModule } from 'primeng/autocomplete';
@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        GrowlModule,
        AutoCompleteModule
    ],
    exports: [],
    declarations: [
        Dashboard1Component,
        Dashboard2Component,
        Dashboard3Component
    ],
    providers: []
})
export class DashboardModule { }
