import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { AuthGuard } from './components/auth/auth.guard';
import { contentRoutes } from './shared/routes/content-routes';
import { LoginComponent } from './components/auth/auth/login.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: '', component: ContentLayoutComponent, children: contentRoutes, canActivate: [AuthGuard] }
  //{ path: '', component: ContentLayoutComponent, children: contentRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
