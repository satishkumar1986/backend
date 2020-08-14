import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { NoWhiteSpaceValidator, TextFieldValidator } from '../../../Validations/validations.validator';
import { DbOperations } from '../../../shared/db-operations';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/global';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @ViewChild('tabset') elname: any;

  addForm: FormGroup;
  buttonText: string;
  objRows = [];
  objRow: any;
  dbops: DbOperations;

  formErrors = {
    name: '',
    code: '',
  }

  validationMessage = {
    name: {
      required: 'Name is Required',
      minlength: 'Name must atleast 3 characters',
      maxlength: 'Name not more than 10 characters',
      validTextField: 'Name must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    code: {
      required: 'Code is Required',
      minlength: 'Code must atleast 3 characters',
      maxlength: 'Code not more than 10 characters',
      validTextField: 'Code must only characters',
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
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
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

        this._dataService.post(Global.BASE_API_PATH + 'ColorMaster/Save', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Color Add Sucessfully', 'Color Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Color Not Add', 'Color Master');
          }
        })

        break;

      case DbOperations.update:
        //console.log(this.addForm.value)
        this._dataService.post(Global.BASE_API_PATH + 'ColorMaster/Update', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Color Update Sucessfully', 'Color Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Color Not Update', 'Color Master');
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
    this.addForm.controls['code'].setValue(this.objRow.code);
    this.buttonText = 'Update';
  }


  delete(id: number) {
    //console.log(id)
    let obj = { id: id }
    this._dataService.post(Global.BASE_API_PATH + 'ColorMaster/Delete', obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success('Color Delete Successfully', 'Color Master')
      } else {
        this._toastr.error('Color not Delete Successfully', 'Color Master')
      }
    })

  }

  getData() {    
    this._dataService.get(Global.BASE_API_PATH + 'ColorMaster/GetAll').subscribe(res => {      
      //console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data
      } else {
        this._toastr.error(res.errors[0], "Color Master");
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