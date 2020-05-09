import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { JarComponent } from './jar/jar.component';
import { JarData } from './jar/jar-data';
import { HttpClientModule } from '@angular/common/http';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { MakeTransferComponent } from './make-transfer-form/make-transfer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewJarFormComponent } from './new-jar-form/new-jar-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrencySettingsComponent } from './currency-settings-form/currency-settings.component';



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
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
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
