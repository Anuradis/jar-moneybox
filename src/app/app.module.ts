import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppComponent } from './app.component';
import { JarComponent } from './dashboard/jar/jar.component';
import { JarData } from './dashboard/jar/jar-data';
import { TransferHistoryComponent } from './dashboard/transfer-history/transfer-history.component';
import { MakeTransferComponent } from './forms/make-transfer-form/make-transfer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewJarFormComponent } from './forms/new-jar-form/new-jar-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrencySettingsComponent } from './forms/currency-settings-form/currency-settings.component';



@NgModule({
  declarations: [
    AppComponent,
    JarComponent,
    TransferHistoryComponent,
    MakeTransferComponent,
    NavbarComponent,
    NewJarFormComponent,
    DashboardComponent,
    CurrencySettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    AngularFontAwesomeModule,
    RouterModule.forRoot([
      {path: '', component: DashboardComponent, pathMatch: 'full'},
      {path: 'transfer', component: MakeTransferComponent },
      {path: 'newjar', component: NewJarFormComponent},
      {path: 'settings', component: CurrencySettingsComponent}
    ]),
    InMemoryWebApiModule.forRoot(JarData, {apiBase: '/api'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
