import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { JarComponent } from './jar/jar.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { JarData } from './jar/jar-data';
import { HttpClientModule } from '@angular/common/http';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { MakeTransferComponent } from './make-transfer-form/make-transfer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewJarFormComponent } from './new-jar-form/new-jar-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    JarComponent,
    TransferHistoryComponent,
    MakeTransferComponent,
    NavbarComponent,
    NewJarFormComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', component: DashboardComponent, pathMatch: 'full'},
      {path: 'transfer', component: MakeTransferComponent },
      {path: 'newjar', component: NewJarFormComponent}
    ]),
    InMemoryWebApiModule.forRoot(JarData, {apiBase: '/api'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
