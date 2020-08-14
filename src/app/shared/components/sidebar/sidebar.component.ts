import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Global } from '../../global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  fullName:string
  userType:string

  userDetails;
  imagePath = "assets/images/user.png";

  menuItems:Menu[];

  constructor(private _navService:NavService) { }

  ngOnInit(): void {

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));

    this.fullName= this.userDetails.firstName + this.userDetails.lastName;
    this.userType="Admin";
    
    //this.imagePath = Global.BASE_USER_IMAGES_PATH + this.userDetails.imagePath;

    this.menuItems = this._navService.MENUITEMS;
  }

  // toggle menu
  toggleNavActive(item:any){
    item.active = !item.active
  }

}
