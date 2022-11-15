import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import {global} from '../../services/global';
import {PostService } from '../../services/post.service';


@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

	public page_title;
	public identity;
	public token;
	public resetVar;
	public status;
	public post: Post;
	public froala_options: Object = {
            charCounterCount: true,
            language: 'es',
            toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
            toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
            toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
            toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
          };

    public categories;
    public is_edit: boolean;
    public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+'post/upload',
      headers: {
     "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Sube la imagen de la entrada',
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !'
    }
  };
  constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _userService: UserService,
  		private _categoryService: CategoryService,
  		private _postService: PostService
  	) {
  	this.page_title = "Editar entrada";
  	this.is_edit = true;
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();

   }

  ngOnInit(): void {

  	this.getCategories();
  	this.post = new Post(1, this.identity.sub, 1, '','',null, null );
  	//console.log(this.post);
  	this.getPost();
  }


  getCategories(){
  	this._categoryService.getCategories().subscribe(
  			response => {

  				if (response.status == 'success'){
  					this.categories = response.categories;
  					console.log(this.categories);
  				}

  			},

  			error => {
  				console.log(error);
  			}


  		);
  }

    getPost(){
    // Sacar el id del post de la url
    this._route.params.subscribe(params => {
      let id = +params['id'];

      // Peticion Ajax para sacar datos

      this._postService.getPost(id).subscribe(

          response => {
            if(response.status == 'success'){
              this.post = response.posts;
            }else{
              this._router.navigate(['/inicio']);
            }

          },

          error => {
            console.log(error);
            this._router.navigate(['/inicio']);
          }


        );

      });



    
  }

  onSubmit(form){

  	this._postService.update(this.token, this.post, this.post.id).subscribe(
  			response => {
  				if(response.status == 'success'){
    					this.status = 'success';
    					// this.post = response.post;

    					//redirigir

    					this._router.navigate(['entrada', this.post.id]);
    				}else{
    					this.status =  'error';
    				}
  			},

  			error => {
          this.status = 'error';
  			}


  		);

  }



  imageUpload(data){
    let image_data = JSON.parse(data.response);

    this.post.image = image_data.image;
  }


}
