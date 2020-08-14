import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperations } from '../../../shared/db-operations';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhiteSpaceValidator } from '../../../Validations/validations.validator';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit {

  @ViewChild('tabset') elname: any;
  @ViewChild('file') elFile: ElementRef;

  addForm: FormGroup;
  buttonText: string;
  objRows = [];
  objRow: any;
  dbops: DbOperations;
  fileToUpload: File;

  formErrors = {
    name: '',
    //code: '',
  }

  validationMessage = {
    name: {
      required: 'Name is Required',
      minlength: 'Name must atleast 3 characters',
      maxlength: 'Name not more than 10 characters',
      validTextField: 'Name must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    // code: {
    //   required: 'Code is Required',
    //   minlength: 'Code must atleast 3 characters',
    //   maxlength: 'Code not more than 10 characters',
    //   validTextField: 'Code must only characters',
    //   noWhiteSpaceValidator: 'Only space is not allowed'
    // }
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
      // file: ['', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(10),
      //   TextFieldValidator.validTextField,
      //   NoWhiteSpaceValidator.noWhiteSpaceValidator
      // ])],
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

  upload(files: any) {
    if (files.length === 0) {
      return;
    }

    //console.log(files[0])

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error('Only image are support', 'Brand Logo Master');
      this.elFile.nativeElement.value = '';
      return;
    }

    this.fileToUpload = files[0];

  }

  onSubmit() {
    
    if(this.dbops === DbOperations.create && !this.fileToUpload){
      this._toastr.error('Please upload image', 'Brand Logo Master')
      return;
    }

    const formData = new FormData();
    formData.append('id', this.addForm.controls['id'].value);
    formData.append('name', this.addForm.controls['name'].value);

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload, this.fileToUpload.name)
    }

    switch (this.dbops) {

      case DbOperations.create:
    
        this._dataService.postImages(Global.BASE_API_PATH + 'BrandLogo/Save', formData).subscribe(res => {         
          console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Brand Logo Add Sucessfully', 'Brand Logo Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Brand Logo Not Add', 'Brand Logo Master');
          }
        })

        break;

      case DbOperations.update:
        //console.log(this.addForm.value)
        this._dataService.postImages(Global.BASE_API_PATH + 'BrandLogo/Update', formData).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Brand Logo Update Sucessfully', 'Brand Logo Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Brand Logo Not Update', 'Brand Logo Master');
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
    this._dataService.post(Global.BASE_API_PATH + 'BrandLogo/Delete', obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success('Brand Logo Delete Successfully', 'Brand Logo Master')
      } else {
        this._toastr.error('Brand Logo not Delete Successfully', 'Brand Logo Master')
      }
    })

  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'BrandLogo/GetAll').subscribe(res => {
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
    this.fileToUpload = null;
  }

  onTabChange(event: any) {
    if (event.activeId == 'Addtab') {
      this.addForm.reset({
        Id: 0
      });
      this.dbops = DbOperations.create;
      this.buttonText = "submit";
      this.objRow=null;
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0
    })
    this.dbops = DbOperations.create;
    this.buttonText = 'Save';
    this.elname.select('Viewtab')
    this.objRow=null;
  }

  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
    this.fileToUpload = null;
  }

}
