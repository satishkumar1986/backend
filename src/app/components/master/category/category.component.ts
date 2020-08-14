import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbOperations } from '../../../shared/db-operations';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { TextFieldValidator, NoWhiteSpaceValidator, NumericFieldValidator } from '../../../Validations/validations.validator';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @ViewChild('tabset') elname: any;
  @ViewChild('file') elFile: ElementRef;

  addForm: FormGroup;
  buttonText: string;
  objRows = [];
  objRow: any;
  dbops: DbOperations;
  fileToUpload: File;
  editImagePath = 'assets/images/dashboard/noimage.png';

  formErrors = {
    name: '',
    title: '',
    isSave:'',
    link:'',
  }

  validationMessage = {
    name: {
      required: 'Name is Required',
      minlength: 'Name must atleast 3 characters',
      maxlength: 'Name not more than 10 characters',
      validTextField: 'Name must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    title: {
      required: 'Title is Required',
      minlength: 'Title must atleast 3 characters',
      maxlength: 'Title not more than 10 characters',
      validTextField: 'Title must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    isSave: {
      required: 'Save is Required',
      minlength: 'Save must atleast 3 characters',
      maxlength: 'Save not more than 10 characters',
      validTextField: 'Save must only characters',
      noWhiteSpaceValidator: 'Only space is not allowed'
    },
    link: {
      required: 'Link is Required',
      minlength: 'Link must atleast 3 characters',
      maxlength: 'Link not more than 10 characters',
      validTextField: 'Link must only characters',
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        NumericFieldValidator.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
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
    formData.append('title', this.addForm.controls['title'].value);
    formData.append('isSave', this.addForm.controls['isSave'].value);
    formData.append('link', this.addForm.controls['link'].value);

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }

    switch (this.dbops) {

      case DbOperations.create:
    
        this._dataService.postImages(Global.BASE_API_PATH + 'Category/Save', formData).subscribe(res => {         
          console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Category Add Sucessfully', 'Category Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Category Not Add', 'Category Master');
          }
        })

        break;

      case DbOperations.update:
        //console.log(this.addForm.value)
        this._dataService.postImages(Global.BASE_API_PATH + 'Category/Update', formData).subscribe(res => {
          //console.log(res)
          if (res.isSuccess) {
            this.elname.select('Viewtab');
            this._toastr.success('Category Update Sucessfully', 'Category Master');
            this.getData();
            this.setForm();
          } else {
            this._toastr.error('Category Not Update', 'Category Master');
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
    this.addForm.controls['isSave'].setValue(this.objRow.isSave);
    this.addForm.controls['title'].setValue(this.objRow.title);
    this.addForm.controls['link'].setValue(this.objRow.link);
    this.buttonText = 'Update';
    this.editImagePath = this.objRow.imagePath;
  }


  delete(id: number) {
    //console.log(id)
    let obj = { id: id }
    this._dataService.post(Global.BASE_API_PATH + 'Category/Delete', obj).subscribe(res => {
      if (res.isSuccess) {
        this.getData();
        this._toastr.success('Category Delete Successfully', 'Category Master')
      } else {
        this._toastr.error('Category not Delete Successfully', 'Category Master')
      }
    })

  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + 'Category/GetAll').subscribe(res => {
      //console.log(res)
      if (res.isSuccess) {
        this.objRows = res.data
      } else {
        this._toastr.error(res.errors[0], "Category Master");
      }
    })
  }

  setForm() {
    this.dbops = DbOperations.create;
    this.buttonText = 'Save';
    this.fileToUpload = null;
    this.editImagePath ='assets/images/dashboard/noimage.png';
  }

  onTabChange(event: any) {
    if (event.activeId == 'Addtab') {
      this.addForm.reset({
        Id: 0
      });     
      this.dbops = DbOperations.create;
      this.buttonText = "submit";
      this.editImagePath ='assets/images/dashboard/noimage.png';
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0
    })
    this.dbops = DbOperations.create;
    this.buttonText = 'Save';    
    this.elname.select('Viewtab')
    this.editImagePath ='assets/images/dashboard/noimage.png';
  }

  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
    this.fileToUpload = null;
  }


}
