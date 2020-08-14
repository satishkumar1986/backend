import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptors implements HttpInterceptor {
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(3),
      map(res => {
        //console.log(res)
        return res
      }),
      catchError((error: HttpErrorResponse) => {
        let errMsg = '';
        //console.log(error)
        // client side error
        if (error.error instanceof ErrorEvent) {
          errMsg = `Error Message : ${error.message}`;
        } else { // server side error
          errMsg = `Error Code : ${error.status}, Message : ${error.message}`
        }
        return throwError(errMsg);
      })
    )

  }

  
}