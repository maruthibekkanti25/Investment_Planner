import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { AdmineditinvestmentComponent } from './components/admineditinvestment/admineditinvestment.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { CreateinvestmentComponent } from './components/createinvestment/createinvestment.component';
import { InvestmentformComponent } from './components/investmentform/investmentform.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestedinvestmentComponent } from './components/requestedinvestment/requestedinvestment.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserappliedinvestmentComponent } from './components/userappliedinvestment/userappliedinvestment.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UserviewinvestmentComponent } from './components/userviewinvestment/userviewinvestment.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './components/authguard/auth.guard';
import { ViewinvestmentComponent } from './components/viewinvestment/viewinvestment.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'adminNav',component:AdminnavComponent,canActivate:[AuthGuard]},
  {path:'adminEditInvestment/:id',component:AdmineditinvestmentComponent,canActivate:[AuthGuard]},
  {path:'adminViewFeedback',component:AdminviewfeedbackComponent,canActivate:[AuthGuard]},
  {path:'createInvestment',component:CreateinvestmentComponent,canActivate:[AuthGuard]},
  {path:'home',component:HomeComponent},
  {path:'investmentForm/:investmentId',component:InvestmentformComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegistrationComponent},
  {path:'requestedInvestment',component:RequestedinvestmentComponent,canActivate:[AuthGuard]},
  {path:'userAddFeedback',component:UseraddfeedbackComponent,canActivate:[AuthGuard]},
  {path:'userAppliedInvestment',component:UserappliedinvestmentComponent,canActivate:[AuthGuard]},
  {path:'userViewFeedback',component:UserviewfeedbackComponent,canActivate:[AuthGuard]},
  {path:'userViewInvestment',component:UserviewinvestmentComponent,canActivate:[AuthGuard]},
  {path:'viewInvestment',component:ViewinvestmentComponent,canActivate:[AuthGuard]},
  {path:'userNav',component:UsernavComponent,canActivate:[AuthGuard]},
  {path:'**',component:ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
