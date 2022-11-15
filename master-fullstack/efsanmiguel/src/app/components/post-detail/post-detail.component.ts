import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {
	public post: any;
  public url;

  constructor(
  		private _postService: PostService,
  		private _route: ActivatedRoute,
  		private _router: Router
  	) { 

    this.url = global.url;

  }

  ngOnInit(): void {
  	this.getPost();
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
  						console.log(this.post);
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

}
