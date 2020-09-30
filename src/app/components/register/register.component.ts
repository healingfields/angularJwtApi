import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from '../../services/register.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AppError} from '../../common/exceptions/app-error';
import {BadInputError} from '../../common/exceptions/bad-input-error';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = null;
  errorsServer;

  constructor(private registerService: RegisterService,
              private toastr: ToastrService,
              private router: Router) {
    this.registerForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
   /*   lastName: new FormControl(null, [Validators.required]),*/
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
   /*   admin: new FormControl(false, [])*/

    }, {
      validators: this.password.bind(this)
    });
  }

  ngOnInit(): void {
  }

  register(): void {
    console.log(this.registerForm.value);
    this.errorsServer = null;
    this.registerService.register(this.registerForm.value)
      .subscribe(res => this.handleResponse(res),
        err => this.handleError(err));
  }

  handleResponse(data): void {
    this.toastr.success(
      `Bienvenu : ${this.registerForm.get('name').value}`,
      'Vous compte a éte bien crée !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
    this.router.navigateByUrl('/login');
  }

  handleError(error: AppError): void {
    console.log(error);
    if (error instanceof BadInputError) {
      this.errorsServer = error.originalError.error;
      console.log('errors: ', this.errorsServer);
      this.toastr.error(
        `Erreur `, // ${data.error.password ? data.error?.password : data.error?.message}
        'Merci de Vérifier votre donné saisie !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
    } else {
      // alert('error inattendue');
      this.toastr.error(
        ` `,
        'Error inattendue !',
        {
          timeOut: 3000,
          positionClass: 'toast-bottom-left'
        }
      );
    }

  }

  password(formGroup: FormGroup) {
    const {value: password} = formGroup.get('password');
    const {value: confirmPassword} = formGroup.get('confirmPassword');
    // console.log(password, confirmPassword);
    // return password === confirmPassword ? null : {passwordNotMatch: true};
    return password === confirmPassword ? null : formGroup.get('confirmPassword').setErrors({confirmPasswordMatch: true});
  }
}
