import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title;
	public user: User;
	public status: string;
	public token;
	public identity;
  constructor(
  		private _userService: UserService,
      private _router: Router,
      private _route: ActivatedRoute
  	) {
		this.user = new User(1, "", "", "ROLE_USER","","","","");
    this.page_title = "Login";
   }

  ngOnInit(): void {
    // Se ejecuta cuando cargue el componente y cierra sesión cuando le llega el parametro 'sure'
    this.logout();
  }


  onSubmit(form){

  	this._userService.signup(this.user).subscribe(
  			response => {
  				//Token
  				if(response.status != 'error'){
  					this.status = 'success';
  					this.token = response;
  					//OBJETO USUARIO IDENTIFICADO
  					this._userService.signup(this.user, true).subscribe(
			  			response => {
			  				this.identity = response;

			  				console.log(this.token);
			  				console.log(this.identity);

			  				//Persistencia de datos
			  				localStorage.setItem('token', this.token);
			  				localStorage.setItem('identity', JSON.stringify(this.identity));

                this._router.navigate(['inicio']);


		  			},

		  			error => {
		  				this.status = 'error';
		  				console.log(<any>error);

		  			}

		  		);

  				}else{
  					this.status = 'error'
  				}

  			},

  			error => {
  				this.status = 'error';
  				console.log(<any>error);

  			}

  		);
  }




  logout(){

    this._route.params.subscribe(params => {
      let logout = +params['sure'];

      if (logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        // Redirección a la home

        this._router.navigate(['inicio']);
      }
    

    });


  }

}
