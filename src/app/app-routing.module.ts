import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/vistas/home/home.component';
import { Err404Component } from './components/vistas/err404/err404.component';
import { InComponent } from './components/vistas/in/in.component';
import { GuardOutGuard } from './servicios/guard-out.guard';
import { GuardInGuard } from './servicios/guard-in.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { IndesktopComponent } from './components/vistas/indesktop/indesktop.component';
import { OrqOpcionemenuComponent } from './components/vistas/orq-opcionemenu/orq-opcionemenu.component';
import { OrqRolesComponent } from './components/vistas/orq-roles/orq-roles.component';
import { MdListavaloresComponent } from './components/vistas/md-listavalores/md-listavalores.component';
import { MdTablasComponent } from './components/vistas/md-tablas/md-tablas.component';
import { MdConsultassqlComponent } from './components/vistas/md-consultassql/md-consultassql.component';
import { MdListasseleccionablesComponent } from './components/vistas/md-listasseleccionables/md-listasseleccionables.component';
import { ScrCrud0Component } from './components/vistas/scr-crud0/scr-crud0.component';
import { ScrCrud1Component } from './components/vistas/scr-crud1/scr-crud1.component';
import { ScrListadosComponent } from './components/vistas/scr-listados/scr-listados.component';
import { ScrCapturadatosComponent } from './components/vistas/scr-capturadatos/scr-capturadatos.component';
import { ScrBuscadorComponent } from './components/vistas/scr-buscador/scr-buscador.component';
import { ScrSelectorComponent } from './components/vistas/scr-selector/scr-selector.component';
import { MdListavalorComponent } from './components/vistas/md-listavalor/md-listavalor.component';
import { MdTablaComponent } from './components/vistas/md-tabla/md-tabla.component';
import { MdConsultasqlComponent } from './components/vistas/md-consultasql/md-consultasql.component';
import { MdListaseleccionableComponent } from './components/vistas/md-listaseleccionable/md-listaseleccionable.component';
import { MdListavalorValorComponent } from './components/vistas/md-listavalor-valor/md-listavalor-valor.component';
import { ScrCrud0sComponent } from './components/vistas/scr-crud0s/scr-crud0s.component';
import { ScrCrud1sComponent } from './components/vistas/scr-crud1s/scr-crud1s.component';
import { ScrListadoComponent } from './components/vistas/scr-listado/scr-listado.component';
import { MdTablaCampoComponent } from './components/vistas/md-tabla-campo/md-tabla-campo.component';


const routes: Routes = [
  // SIEMPRE
  { path: '', redirectTo: '/in', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [GuardOutGuard]},    // LLamada al GuarOut para que verifique si está logged
  // SOLO DESDE FUERA DE LA APP
  { path: 'login', component: LoginComponent, canActivate: [GuardOutGuard]},
  { 
    path: 'in', component: InComponent, canActivate: [GuardInGuard], children: [
      { path: '', component: IndesktopComponent, canActivate: [GuardInGuard]},   
      { path: 'logout', component: LogoutComponent, canActivate: [GuardInGuard] },  
      // ORQUESTADOR
      { path: 'opcionesmenu', component: OrqOpcionemenuComponent, canActivate: [GuardInGuard]},  
      { path: 'roles', component: OrqRolesComponent, canActivate: [GuardInGuard]},  
      // ORIGENES DE DATOS
      { path: 'listasdevalores', component: MdListavaloresComponent, canActivate: [GuardInGuard]},  
      { path: 'listadevalor', component: MdListavalorComponent, canActivate: [GuardInGuard]},  
      { path: 'listadevalor/:id', component: MdListavalorComponent, canActivate: [GuardInGuard] },  
      { path: 'listavalorvalor/:id', component: MdListavalorValorComponent, canActivate: [GuardInGuard] },  
      { path: 'listavalorvalor/:id/:idvalor', component: MdListavalorValorComponent, canActivate: [GuardInGuard] },  
      
      { path: 'tablas', component: MdTablasComponent, canActivate: [GuardInGuard] },  
      { path: 'tabla', component: MdTablaComponent, canActivate: [GuardInGuard] },  
      { path: 'tabla/:id', component: MdTablaComponent, canActivate: [GuardInGuard] },  
      { path: 'tablacampo/:id', component: MdTablaCampoComponent, canActivate: [GuardInGuard] },  
      { path: 'tablacampo/:id/:idvalor', component: MdTablaCampoComponent, canActivate: [GuardInGuard] },  
      
      { path: 'consultassql', component: MdConsultassqlComponent, canActivate: [GuardInGuard]},  
      { path: 'consultasql', component: MdConsultasqlComponent, canActivate: [GuardInGuard]},  
      { path: 'consultasql/:id', component: MdConsultasqlComponent, canActivate: [GuardInGuard]},  

      { path: 'listasseleccionables', component: MdListasseleccionablesComponent, canActivate: [GuardInGuard] },  
      { path: 'listaseleccionable', component: MdListaseleccionableComponent, canActivate: [GuardInGuard] },  
      { path: 'listaseleccionable/:id', component: MdListaseleccionableComponent, canActivate: [GuardInGuard] },  

      // DEFINICION DE PANTALLAS
      { path: 'tablasdegestion', component: ScrCrud0sComponent, canActivate: [GuardInGuard]},  
      { path: 'tabladegestion', component: ScrCrud0Component, canActivate: [GuardInGuard]},  
      { path: 'tabladegestion/:id', component: ScrCrud0Component, canActivate: [GuardInGuard]},  

      { path: 'edicionesregistros', component: ScrCrud1sComponent, canActivate: [GuardInGuard] },  
      { path: 'edicionregistro', component: ScrCrud1Component, canActivate: [GuardInGuard] },  
      { path: 'edicionregistro/:id', component: ScrCrud1Component, canActivate: [GuardInGuard] },  

      { path: 'listados', component: ScrListadosComponent, canActivate: [GuardInGuard]},  
      { path: 'listado', component: ScrListadoComponent, canActivate: [GuardInGuard]},  
      { path: 'listado/:id', component: ScrListadoComponent, canActivate: [GuardInGuard] },  
      
      { path: 'capturas', component: ScrCapturadatosComponent, canActivate: [GuardInGuard]},  
      { path: 'buscadores', component: ScrBuscadorComponent, canActivate: [GuardInGuard]},  
      { path: 'selectores', component: ScrSelectorComponent, canActivate: [GuardInGuard]},  

    ]
  },  
  { path: '**', component: Err404Component, pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
