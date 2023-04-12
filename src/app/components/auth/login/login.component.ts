import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService, isLoggedFlagService } from '../../../servicios/global.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Quitar
  isLogged: boolean = false;

  loginForm!: FormGroup;
  public error: string = "";
  public viewpass: boolean = false;

  constructor(
    private misLoggedFlagService: isLoggedFlagService,
    private router: Router,
    private formBuilder: FormBuilder, 
    private global: GlobalService,
  ) {
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;    
    });    
  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      usrCorreo: ['', [Validators.required, Validators.email]],
      usrClave: ['', [Validators.required]],
    });

    if(localStorage.getItem('user')) {
      this.loginForm.patchValue({usrCorreo: localStorage.getItem('user')});
    }

  }

  forgotpassword() {
    this.router.navigateByUrl('/forgotpass');
  }
  register() {
    this.router.navigateByUrl('/registroUno');
  }


  async send(pusrCorreo: string, pusrClave: string) {

    if(this.global.DEBUG)
      console.log(this.loginForm.value);
   
    let data = '{"correo":"' + pusrCorreo + '","contrasenia": "' + pusrClave + '"}';

    try {
      const response = await fetch(this.global.API_ROUTE + "auth/login.php", {
        method: 'POST',
        headers: {},
        body: data
      });

      if (response.ok) {
        const loginResult = await response.json();

        if(this.global.DEBUG)
          console.log("Retorno:", loginResult);

        if(loginResult.success == 1 && loginResult.status == 200) {
          
          localStorage.setItem('token', loginResult.data.token);
          localStorage.setItem('user', pusrCorreo);
          this.router.navigate(['/in']);


        } else {
          localStorage.setItem('token', '');
          this.error="Usuario o contraseña no válido!"
        }


      }
    } catch (err) {
      console.error(err);
    }

  }

  updateLogged(pLogged: boolean) {
    this.misLoggedFlagService.updateLogguedStatus(pLogged);
  }

}
