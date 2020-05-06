import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JarComponent } from './jar/jar.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { JarData } from './jar/jar-data';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    JarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(JarData)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
