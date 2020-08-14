import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperations } from '../../../shared/db-operations';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhiteSpaceValidator } from '../../../Validations/validations.validator';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.scss']
})
export class UsertypeComponent implements OnInit {

  @ViewChild('tabset') elname: any;

  addForm: FormGroup;
  buttonText: string;
  objRows = [];
  objRow: any;
  dbops: DbOperations;

  formErrors = {
    name: '',
  }

  validationMessage = {
    name: {
      required: 'User Type is Required',
      minlength: 'User Type must atleast 3 characters',
      maxlength: 'User Type not more than 10 characters',
      validTextField: 'User Type must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    }
  }

  constructor(private _fb: FormBuilder, private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  setFormState() {
    this.dbops = DbOperations.create;
    this.buttonText = "Submit";

    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])]
    });

    this.addForm.valueChanges.subscribe(fData => {
      this.onValueChanged();
    });
  }

  get f() {
    return this.addForm.controls;
  }

  onValueChanged() {

    if (!this.addForm) {
      return
    }

    for (const field of Object.keys(this.formErrors)) {
      //console.log('Hi ' + field)

      this.formErrors[field] = '';

      const control = this.addForm.get(field)
      //console.log(control)

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field]
        //console.log(message)

        for (const key of Object.keys(control.errors)) {
          //console.log(key)
          if (key != 'required') {
            this.formErrors[field] += message[key] + ' ';
            //console.log(this.formErrors[field] = + message[key] + '');
            //console.log(message['maxlength'])
          }

        }

      }

    }

  }

  onSubmit() {
    //console.log(this.addForm.value)

    switch (this.dbops) {

      case DbOperations.create:

        this._dataService.post(Global.BASE_API_PATH + 'UserType/Save', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('User Type Add Sucessfully', 'User Type Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('User Type Not Add', 'User Type Master');
          }
        })

        break;

      case DbOperations.update:
        //console.log(this.addForm.value)
        this._dataService.post(Global.BASE_API_PATH + 'UserType/Update', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('User Type Update Sucessfully', 'User Type Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('User Type Not Update', 'User Type Master');
          }
        })
    }
  }

  edit(id: number) {
    this.dbops = DbOperations.update;
    this.elname.select('Addtab');
    this.objRow = this.objRows.find(color => color.id === id)
    //console.log(this.objRow)
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.buttonText = 'Update';
  }


  delete(id: number) {
    //console.log(id)
    let obj = { id: id }
    this._dataService.post(Global.BASE_API_PATH + 'UserType/Delete', obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success('User Type Delete Successfully', 'User Type Master')
      } else {
        this._toastr.error('User Type not Delete Successfully', 'User Type Master')
      }
    })

  }

  getData() {    
    this._dataService.get(Global.BASE_API_PATH + 'UserType/GetAll').subscribe(res => {      
      //console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data
      } else {
        this._toastr.error(res.errors[0], "User Type Master");
      }
    })
  }

  setForm() {
    this.dbops = DbOperations.create;
    this.buttonText = 'Save';
  }

  onTabChange(event: any) {
    if (event.activeId == 'Addtab') {
      this.addForm.reset({
        id: 0
      });
      this.dbops = DbOperations.create;
      this.buttonText = "submit";
    }
  }

  cancelForm(){
    this.addForm.reset({
      id:0
    })
    this.dbops = DbOperations.create;
    this.buttonText='Save';
    this.elname.select('Viewtab')
  }  

  ngOnDestroy(){
    this.objRows = null;
    this.objRow = null;
  }

}
