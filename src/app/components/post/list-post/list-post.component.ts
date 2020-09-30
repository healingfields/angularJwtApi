import {Component, OnInit, ViewChild} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {Post} from '../../../models/post';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {AppError} from '../../../common/exceptions/app-error';
import {NotFoundError} from '../../../common/exceptions/not-found-error';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit {

  posts: Post[] = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private postService: PostService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true
    };
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAll().subscribe((res: Post[]) => {
      this.posts = res;
      // ADD THIS
      this.dtTrigger.next();
      console.log(this.posts);
    }, (error: AppError) => {
      this.toastr.error(
        ` `,
        'Error inattendue !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
      console.log(error);
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  deletePost(post: Post): void {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.postService.delete(post.postId).subscribe((res: Post) => {
          this.handleResponseDelete(post);
        }, (err: AppError) => {
          this.handleErrorDelete(err);
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        );
      }
    });
  }

  handleResponseDelete(data: Post): void {
    const index = this.posts.findIndex(function(item, i) {
      return data.postId === item.postId;
    });
    console.log(index, 'index');
    if (index > -1) {
      this.posts.splice(index, 1);
      this.rerender();
      // this.refreshCustomersList();
    }
    Swal.fire(
      'Deleted!',
      'Your imaginary file has been deleted.',
      'success'
    );
  }

  handleErrorDelete(error: AppError): void {
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
        `Error ${error.originalError.error.message}`,
        'Error inattendue !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
    }

  }
}
