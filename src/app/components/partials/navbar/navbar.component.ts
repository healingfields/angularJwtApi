import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {TokenService} from '../../../services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: null;
  public loggedIn = false;

  constructor(private tokenService: TokenService,
              private accountService: AccountService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.accountService.authStatus.subscribe(res => {
      this.loggedIn = res;
      this.currentUser = this.tokenService.getInfos();
    });
  }

  logout(): void {
    this.tokenService.remove();
    this.accountService.changeStatus(false);
    this.router.navigateByUrl('/login');
  }

}

