import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {AppState} from "../../app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {isLoading, stopLoading} from "../../shared/ui.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  loading: boolean = false;
  uiSubs: Subscription = new Subscription;


  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private store: Store<AppState>) {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

  }

  ngOnInit(): void {
    this.uiSubs = this.store.select('ui').subscribe(ui =>{
      this.loading = ui.isLoading;
    });
  }

  crearUsuario() {

    if (this.registroForm.invalid) {
      return;
    }

    this.store.dispatch(isLoading());

    // Swal.fire({
    //   title: 'Espere, por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const {nombre, email, password} = this.registroForm.value;
    this.authService.crearUsuario(nombre, email, password)
      .then(credenciales => {
        //Swal.close();
        this.store.dispatch(stopLoading());
        this.router.navigate(['/']); //SI EL LOGIN ES CORRECTO, NAVEGA HASTA EL DASHBOARD
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
