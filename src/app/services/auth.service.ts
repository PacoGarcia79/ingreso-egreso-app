import {Injectable} from '@angular/core';

import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from '@angular/fire/compat/auth';

import {map, Subscription} from "rxjs";

import {Store} from "@ngrx/store";

import {Usuario} from "../modelos/usuario.model";
import {AppState} from "../app.reducer";
import {setUser} from "../auth/auth.actions";
import {unSetUser} from "../auth/auth.actions";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription = new Subscription();

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<AppState>) {
  }

  initAuthListener(){
    this.auth.authState.subscribe(fuser =>{
      if(fuser){

        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( firestoreUser => {
            console.log(firestoreUser);

            const user = Usuario.fromFirebase(firestoreUser);

            // this.store.dispatch(setUser({user: user}));
            this.store.dispatch(setUser({user}));
          })
      }
      else{
        this.store.dispatch(unSetUser());
        this.userSubscription.unsubscribe();
      }

    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(fbUser => {

        const newUser = new Usuario(fbUser.user!.uid, nombre, email)

        return this.firestore.doc(`${fbUser.user!.uid}/usuario`)
          .set({...newUser});

      });
  }

  loginUsuario(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }


}
