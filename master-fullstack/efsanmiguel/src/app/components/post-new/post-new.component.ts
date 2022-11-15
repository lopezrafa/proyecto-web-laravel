import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import {global} from '../../services/global';
import { PostService } from '../../services/post.service';


@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

	public page_title;
	public identity;
	public token;
	public resetVar;
  public is_edit;
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
  	this.page_title = "Noticias EF San Miguel";
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();

   }

  ngOnInit(): void {

  	this.getCategories();
  	this.post = new Post(1, this.identity.sub, 1, '','',null, null );
  	//console.log(this.post);
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

  onSubmit(form){

  	this._postService.create(this.token, this.post).subscribe(
  			response => {

  				if(response.status == 'success'){
  					this.post = response.posts;
  					this.status = 'success';
  					this._router.navigate(['/inicio']);
  				}

  				},
  			error => {
  				console.log(error);
  				this.status = 'error';

  			}

  		)

  }

  imageUpload(data){
    let image_data = JSON.parse(data.response);

    this.post.image = image_data.image;
  }


}
