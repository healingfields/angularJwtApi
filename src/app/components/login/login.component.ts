import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {TokenService} from '../../services/token.service';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = null;

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value)
      .subscribe(res => this.handleResponse(res),
        err => this.handleError(err));
  }

  handleResponse(data): void {
    this.tokenService.handle(data);
    this.accountService.changeStatus(true);
    this.toastr.success(
      `Bienvenu : ${this.tokenService.getInfos().name}`,
      'Vous êtes connectés !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
    this.router.navigateByUrl('/');
  }

  handleError(error): void {
    console.log(error);
    this.toastr.error(
      `Erreur`,
      'Merci de Vérifier votre email ou mot de passe !',
      {
        timeOut: 3000,
        positionClass: 'toast-bottom-left'
      }
    );
  }
}


