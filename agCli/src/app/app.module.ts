import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component'

import { ElModule,ExAppComponent } from 'element-angular'
import 'element-angular/theme/index.css';
@NgModule({
  declarations: [
    ExAppComponent
  ],
  imports: [
    BrowserModule,
    ElModule.forRoot()
  ],
  providers: [],
  bootstrap: [ExAppComponent]
})
export class AppModule { }
