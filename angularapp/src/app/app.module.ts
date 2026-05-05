import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdmineditinvestmentComponent } from './components/admineditinvestment/admineditinvestment.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';

import { CreateinvestmentComponent } from './components/createinvestment/createinvestment.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { InvestmentformComponent } from './components/investmentform/investmentform.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedinvestmentComponent } from './components/requestedinvestment/requestedinvestment.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserappliedinvestmentComponent } from './components/userappliedinvestment/userappliedinvestment.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewinvestmentComponent } from './components/userviewinvestment/userviewinvestment.component';
import { ViewinvestmentComponent } from './components/viewinvestment/viewinvestment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component'

@NgModule({
  declarations: [
    AppComponent,
    AdmineditinvestmentComponent,
    AdminnavComponent,
    AdminviewfeedbackComponent,
    CreateinvestmentComponent,
    ErrorComponent,
    HomeComponent,
    InvestmentformComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    RequestedinvestmentComponent,
    UseraddfeedbackComponent,
    UserappliedinvestmentComponent,
    UsernavComponent,
    UserviewfeedbackComponent,
    UserviewinvestmentComponent,
    ViewinvestmentComponent,
    MainNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
