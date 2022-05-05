import {Injectable} from '@angular/core';

import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from '@angular/fire/compat/auth';

import {map} from "rxjs";

import {Usuario} from "../modelos/usuario.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {
  }

  initAuthListener(){
    this.auth.authState.subscribe(fuser =>{
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
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
