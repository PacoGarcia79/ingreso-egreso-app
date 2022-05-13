import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

import Swal from 'sweetalert2'
import {AppState} from "../../app.reducer";
import {Store} from "@ngrx/store";
import {isLoading, stopLoading} from "../../shared/ui.actions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading: boolean = false;
  uiSubs: Subscription = new Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.uiSubs = this.store.select('ui').subscribe(ui =>{
      this.loading = ui.isLoading
      console.log('cargando subs');
    });

  }

  loginUsuario() {

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(isLoading());

    // Swal.fire({
    //   title: 'Espere, por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const {email, password} = this.loginForm.value;

    this.authService.loginUsuario(email, password)
      .then(credenciales =>{
        //Swal.close();
        this.store.dispatch(stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      })
  }

  ngOnDestroy(): void {
    this.uiSubs.unsubscribe();
  }
}
