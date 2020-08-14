import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null) // for token use
  private loggedIn = new BehaviorSubject<boolean>(false)
  private message: string;

  get currentUser() {
    return this.currentUserSubject.asObservable()
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable()
  }

  getMessage() {
    return this.message;
  }

  constructor(private router: Router) { }

  login(objUserDetail) {
    if (objUserDetail.id === 0) {
      this.currentUserSubject.next(null)
      localStorage.removeItem('userDetails')
      this.loggedIn.next(false)
      this.message = 'Please enter valid user name and password';
      //this.router.navigate(['/auth/login'])
    } else {
      this.currentUserSubject.next(objUserDetail) // for token use      
      localStorage.setItem('userDetails', JSON.stringify(objUserDetail))
      this.loggedIn.next(true)
      this.message = '';
      this.router.navigate(['/dashboard/default'])
    }
  }

  logOut(){
    localStorage.clear()
    this.loggedIn.next(false)
    this.router.navigate(['/auth/login'])
  }

}
