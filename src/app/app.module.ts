import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './components/auth/auth.module';
import { ToastrModule } from 'ngx-toastr';
import { HeaderInterceptors } from './Interceptors/header-interceptors.service';
import { ResponseInterceptors } from './Interceptors/response-interceptors.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:HeaderInterceptors, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ResponseInterceptors, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
