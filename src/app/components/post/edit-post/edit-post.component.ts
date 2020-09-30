import {Component, OnInit} from '@angular/core';
import {Post} from '../../../models/post';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import {AppError} from '../../../common/exceptions/app-error';
import {NotFoundError} from '../../../common/exceptions/not-found-error';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  id: string;
  post: Post = null;
  editForm: FormGroup = null;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.initialFormGroupe();
    this.getPostByPostId();
  }

  getPostByPostId(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.postService.getOne(this.id).subscribe((res: Post) => {
      this.post = res;
      this.setFormGroupe(this.post);
    }, (error: AppError) => {
      if (error instanceof NotFoundError) {
        this.toastr.error(
          `Ce post est deja supprimée`,
          'Error Not found !',
          {
            timeOut: 3000,
            positionClass: 'toast-bottom-left'
          }
        );
      } else {
        this.toastr.error(
          `Error ${error.originalError.error?.message}`,
          'Error inattendue !',
          {
            timeOut: 3000,
            positionClass: 'toast-bottom-left'
          }
        );
      }
    });
  }

  initialFormGroupe(): void {
    this.editForm = new FormGroup({
      groupeId: new FormControl({value: null}, [Validators.required]),
      nom: new FormControl(null, [Validators.required])
    });
  }

  setFormGroupe(data: Post): void {
    this.editForm.patchValue({
      groupeId: data.postId,
      nom: data.nom
    });
  }

  update(): void {
    this.postService.update(this.id, this.editForm.value).subscribe((res: Post) => {
      this.handleResponse(res);
    }, err => {
      this.handleError(err);
    });
  }

  handleResponse(data: Post): void {
    this.toastr.success(
      `Post : ${data.nom} bien modifier !`,
      'bien modifier !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
    this.router.navigateByUrl('/post');
  }

  handleError(error: AppError): void {

    if (error instanceof NotFoundError) {
      this.toastr.error(
        `Ce post est deja supprimée`,
        'Error Not found !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
    } else {
      this.toastr.error(
        `Error ${error.originalError.error?.message}`,
        'Error inattendue !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
    }
  }
}
