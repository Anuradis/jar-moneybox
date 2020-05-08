import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { JarComponent } from './jar/jar.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { JarData } from './jar/jar-data';
import { HttpClientModule } from '@angular/common/http';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { MakeTransferComponent } from './jar/make-transfer/make-transfer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    JarComponent,
    TransferHistoryComponent,
    MakeTransferComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'transfer', component: MakeTransferComponent }
    ]),
    InMemoryWebApiModule.forRoot(JarData, {apiBase: '/api'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
