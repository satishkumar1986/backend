import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../shared/services/data.service';
import { Global } from '../../../shared/global';
import { MustMatchValidator, NoWhiteSpaceValidator, OnlyCharFieldValidator } from '../../../Validations/validations.validator';
import { Router, ActivatedRoute } from '@angular/router';
import { DbOperations } from '../../../shared/db-operations';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  dbops: DbOperations;
  userForm: FormGroup;
  subimtted: boolean = false;
  buttonText: string = "Add user"
  objUserTypes = [];
  objRows = [];
  objRow:any;
  userId: number = 0;
  pageTitle: string = "Add User";  

  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    userType: '',
    password: '',
    confirmPassword: ''
  }

  validationMessage = {
    firstName: {
      required: 'First Name is Required',
      minlength: 'First Name must atleast 3 characters',
      maxlength: 'First Name not more than 10 characters',
      validOnlyCharField: 'First Name must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    lastName: {
      required: 'Last Name is Required',
      minlength: 'Last Name must atleast 3 characters',
      maxlength: 'Last Name not more than 10 characters',
      validOnlyCharField: 'Last Name must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    email: {
      required: 'Email is Required',
      minlength: 'Email must atleast 3 characters',
      maxlength: 'Email not more than 10 characters',
      pattern: 'Enter Valid Email Address',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },

    userType: {
      required: 'Email is Required',
    },

    password: {
      required: 'Password is Required',
      pattern: 'Password is invalid. Password must contain at least one small & one capital alphabet, numeric and !@#$%^&* digit.',
    },

    confirmPassword: {
      required: 'ConfirmPassword is Required',
      pattern: 'ConfirmPassword is invalid. Password must contain at least one small & one capital alphabet, numeric and !@#$%^&* digit.',
      mustMatch: 'Must Match'
    }
  }

  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService, private navRoute: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      console.log(params.userId)
      this.userId = params.userId
    })
  }

  setFormState() {
    this.dbops = DbOperations.create;
    this.pageTitle = 'Add User';
    this.buttonText = 'Add User';

    this.userForm = this._fb.group({
      id: [0],
      firstName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        OnlyCharFieldValidator.validOnlyCharField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        OnlyCharFieldValidator.validOnlyCharField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],

      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.]{3,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,6}$')
      ])],

      userType: ['', Validators.compose([
        Validators.required
      ])],

      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9].{8,15}$')])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9].{8,15}$')])],

    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      }
    )

    this.userForm.valueChanges.subscribe(fData => {
      this.onValueChanged();
    });

  }

  get f() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    this.setFormState();
    this.getUserType();

    if (this.userId != null && this.userId > 0) {
      this.getUserById();
      this.buttonText = "Update";
      this.pageTitle = "Update";
      this.dbops = DbOperations.update;
    }

  }  

  onValueChanged() {
    if (!this.userForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.userForm.get(field);
      if (control && control.dirty && !control.valid) {
        const message = this.validationMessage[field];
        for (const key of Object.keys(control.errors)) {
          if (key != 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }

  }


  getUserById() {
    this._dataService.get(Global.BASE_API_PATH + 'userMaster/GetAll').subscribe(res => {
      console.log(res)     
      if (res.isSuccess) {
        this.objRows = res.data;
        this.objRow = this.objRows.find(fd=>fd.id===this.userId)

        this.userForm.controls['id'].setValue(this.objRow.id);
        this.userForm.controls['firstName'].setValue(this.objRow.firstName);
        this.userForm.controls['lastName'].setValue(this.objRow.lastName);
        this.userForm.controls['email'].setValue(this.objRow.email);
        //this.userForm.controls['userType'].setValue(this.objRow.userType);

      } else {
        this._toastr.error(res.error[0], 'User Master')
      }
    })
  }


  getUserType() {
    this._dataService.get(Global.BASE_API_PATH + "userType/GetAll").subscribe(res => {
      console.log(res)
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.error(res.error[0], 'Create User')
      }
    })
  }

 

  onRegistration(formData) {
    this.subimtted = true;
    //console.log(formData.value)

    if (this.userForm.invalid) {
      return;
    }

    switch(this.dbops){

      case DbOperations.create:
      this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Save', formData.value).subscribe(res => {
        console.log(res)
        if (res.isSuccess) {
          this._toastr.success('Account has been created Successfully', 'User Master');
          this.navRoute.navigate(['users/user-list'])
        } else {
          this._toastr.error(res.errors[0], 'User Master')
        }
      })
      break;

      case DbOperations.update:
      console.log(this.userForm.value)
      
      this._dataService.post(Global.BASE_API_PATH + 'UserMaster/Update', formData.value).subscribe(res=>{
        console.log(res)
        if(res.isSuccess){
          this._toastr.success('Account has been updated Successfully', 'User Master')
          this.navRoute.navigate(['users/user-list'])
        } else {
          this._toastr.error(res.errors[0], 'User Master')
        }
      })


    }

  }

  goToList(){
    this.navRoute.navigate(['users/user-list'])
  }

  ngOnDestroy(){
    this.objRow = null
    this.objRows = null
    this.objUserTypes = null;
  }

}
