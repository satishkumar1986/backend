import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { Global } from '../../../shared/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userDetails:any;
  fullName:string;

  firstName:string;
  lastName:string;
  email:string;
  
  //fileTobeUpload;
  imagePath ='assets/images/user.png';

  addForm:FormGroup;

  constructor(private _fb:FormBuilder, private _dataService:DataService) { }

  ngOnInit(): void {

   this.userDetails = JSON.parse(localStorage.getItem('userDetails'))
   console.log(this.userDetails)
   
   this.fullName = this.userDetails.firstName + this.userDetails.lastName;

   this.firstName = this.userDetails.firstName;
   this.lastName = this.userDetails.lastName;
   this.email = this.userDetails.email; 

  //  this.addForm = this._fb.group({
  //    id:[''],
  //    firstName:[this.firstName],
  //    lastName:[this.lastName],
  //    email:[this.email]
  //  })

  }

  // setFormState(){
  //   this.addForm = this._fb.group({
  //     id:[],
  //   })
  // }

  // upload(event){    
  //   this.fileTobeUpload = event.target.files[0];
  //   console.log(this.fileTobeUpload)
  //   console.log(this.fileTobeUpload.name)
  // }

  // onSubmit(){

  //   this.addForm.controls['id'].setValue(this.userDetails.id);

  //   const formData = new FormData();
  //   formData.append('id', this.addForm.controls['id'].value);

  //   if(this.fileTobeUpload){
  //     formData.append('image', this.fileTobeUpload, this.fileTobeUpload.name);
  //   }

  //   this._dataService.postImages(Global.BASE_API_PATH + 'UserMaster/Update', formData).subscribe(res=>{
  //     console.log(res)
  //   })

  // }

}
