import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
	public page_title: string;
	public user: User;
  public status;

  constructor(
  		private _userService: UserService
  	) {
  	this.page_title = 'Ajustes de usuario';
  	this.user = new User(1, "", "", "ROLE_USER","","","","");
   }

  ngOnInit(): void {

  	console.log(this._userService.test());
  }


  onSubmit(form){
  	this._userService.register(this.user).subscribe(

  			response => {
  				console.log(response);

  				form.reset();

  			},

  			error => {
  				console.log(<any>error);
  			}


  		);


  	
  }

}
