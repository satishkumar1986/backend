import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperations } from '../../../shared/db-operations';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhiteSpaceValidator } from '../../../Validations/validations.validator';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

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
      required: 'Tag is Required',
      minlength: 'Tag must atleast 3 characters',
      maxlength: 'Tag not more than 10 characters',
      validTextField: 'Tag must only characters',
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

        this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Save', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Tag Add Sucessfully', 'Tag Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Tag Not Add', 'Tag Master');
          }
        })

        break;

      case DbOperations.update:
        //console.log(this.addForm.value)
        this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Update', this.addForm.value).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Tag Update Sucessfully', 'Tag Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Tag Not Update', 'Tag Master');
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
    this._dataService.post(Global.BASE_API_PATH + 'TagMaster/Delete', obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success('Tag Delete Successfully', 'Tag Master')
      } else {
        this._toastr.error('Tag not Delete Successfully', 'Tag Master')
      }
    })

  }

  getData() {    
    this._dataService.get(Global.BASE_API_PATH + 'TagMaster/GetAll').subscribe(res => {      
      //console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data
      } else {
        this._toastr.error(res.errors[0], "Tag Master");
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
