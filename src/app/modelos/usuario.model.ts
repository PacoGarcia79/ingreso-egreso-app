export class Usuario{

  static fromFirebase(firebaseUser: any){

    const {email, uid, nombre} = firebaseUser;

    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {
  }
}
