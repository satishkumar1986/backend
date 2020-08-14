import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DataService } from '../../../shared/services/data.service';
import { Global } from '../../../shared/global';
import { ToastrService } from 'ngx-toastr';
import { MustMatchValidator } from '../../../Validations/validations.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('tabset') elname: any
  loginSubmitted: boolean = false;
  registrationSubmitted: boolean = false;
  loginForm: FormGroup;
  registrationForm: FormGroup;
  strMsg: string;

  constructor(private cd: ChangeDetectorRef, private _authService: AuthService, private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._authService.logOut()
    this.createLoginForm()
    this.createRegistrationForm()
  }

  createLoginForm() {
    this.loginForm = this._fb.group({
      userName: [''],
      password: ['']
    })
  }

  createRegistrationForm() {
    this.registrationForm = this._fb.group({
      id: [0],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern('^[a-zA-Z. ]+$')])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern('^[a-zA-Z. ]+$')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.]{3,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,6}$')])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9].{8,15}$')])],
      confirmPassword: ['', Validators.required],
      //userTypeId: [1]
    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      }
    )
  }

  onLogin() {
    
    if( this.loginForm.get('userName').value==''){
      this._toastr.error('User Name is Required', 'Login Master');
      return;
    } else if( this.loginForm.get('password').value ==''){
      this._toastr.error('Password is Required', 'Login Master');
      return;
    }

    if (this.loginForm.valid) {
      this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Login', this.loginForm.value).subscribe(res => {
        console.log(res)
        if (res.isSuccess) {
          this._authService.login(res.data)
          this.strMsg = this._authService.getMessage()
          if (this.strMsg != '') {
            this._toastr.error(this.strMsg, 'Login')
          }
          
        } else {
          this._toastr.error(res.errors[0], 'Login Inner')
        }
        this.reset()
      })

    } else {
      this._toastr.error('Invalid Username and Password !!', 'Login Outer')
    }
  }

  onRegistration(formData) {

    this.registrationSubmitted = true;

    if (this.registrationForm.invalid) {
      this._toastr.error('Fill all Details !!', 'Registration')
      return;
    }

    console.log(formData.value)

    this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Save', formData.value).subscribe(res => {
      console.log(res)

      if (res.isSuccess) {
        this._toastr.success('Account has been created successfully !!', 'User Master')
        this.registrationReset()
        this.elname.select('logintab')
        this.registrationSubmitted = false;
      } else {
        this._toastr.error(res.errors[0], 'User Master')
      }

    })

  }

  reset() {
    this.loginForm.controls['userName'].setValue('');
    this.loginForm.controls['password'].setValue('');
  }

  registrationReset() {
    this.registrationForm.reset()
  }

  get fl() {
    return this.loginForm.controls
  }

  get fr() {
    return this.registrationForm.controls
  }

  // for tab change
  // ngAfterViewInit() {
  //   this.elname.select('logintabe')
  //   this.cd.detectChanges()
  // }

}
