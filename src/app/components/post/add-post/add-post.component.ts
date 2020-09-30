import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PostService} from '../../../services/post.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  createForm: FormGroup = null;
  post : Post = {title:"driss",description:"fdsfgsfsafsfsf"}

  constructor(private router: Router,
              private postService: PostService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.initialFormGroupe();
  }

  initialFormGroupe(): void {
    this.createForm = new FormGroup({
      nom: new FormControl(null, [Validators.required])
    });
  }

  create(): void {

    this.postService.create(post).subscribe((res: Post) => {
      this.handleResponseCreate(res);
    }, err => {
      this.handleErrorCreate(err);
    });
  }

  handleResponseCreate(data: Post): void {
    this.toastr.success(
      `Post : ${data.nom} bien crée !`,
      'bien crée !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
    this.router.navigateByUrl('/post');
  }
  handleErrorCreate(err): void {
    console.log(err);
    this.toastr.error(
      `Error ${err.originalError.error.message}`,
      'Error inattendue !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
  }

}
