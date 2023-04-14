import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from './servicios/navigation.service';
import { HomeComponent } from './components/vistas/home/home.component';
import { Err404Component } from './components/vistas/err404/err404.component';
import { InComponent } from './components/vistas/in/in.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { IndesktopComponent } from './components/vistas/indesktop/indesktop.component';
import { TrueMessageBoxComponent } from './components/UX/true-message-box/true-message-box.component';
import { FooterComponent } from './components/UX/footer/footer.component';
import { MenuComponent } from './components/UX/menu/menu.component';
import { SpinnerComponent } from './components/UX/spinner/spinner.component';
import { SubmenuComponent } from './components/UX/submenu/submenu.component';
import { UsrcardComponent } from './components/UX/usrcard/usrcard.component';
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
import { Crud0Component } from './components/UX/crud0/crud0.component';
import { Crud1Component } from './components/UX/crud1/crud1.component';
import { MdListavalorComponent } from './components/vistas/md-listavalor/md-listavalor.component';
import { MdTablaComponent } from './components/vistas/md-tabla/md-tabla.component';
import { MdConsultasqlComponent } from './components/vistas/md-consultasql/md-consultasql.component';
import { MdListaseleccionableComponent } from './components/vistas/md-listaseleccionable/md-listaseleccionable.component';
import { Crud1ConvaloresComponent } from './components/UX/crud1-convalores/crud1-convalores.component';
import { Crud2ValoresComponent } from './components/UX/crud2-valores/crud2-valores.component';
import { MdListavalorValorComponent } from './components/vistas/md-listavalor-valor/md-listavalor-valor.component';
import { ScrCrud0sComponent } from './components/vistas/scr-crud0s/scr-crud0s.component';
import { ScrCrud1sComponent } from './components/vistas/scr-crud1s/scr-crud1s.component';
import { ScrListadoComponent } from './components/vistas/scr-listado/scr-listado.component';
import { MdTablaCampoComponent } from './components/vistas/md-tabla-campo/md-tabla-campo.component';
import { MdConsultasqlFiltroComponent } from './components/vistas/md-consultasql-filtro/md-consultasql-filtro.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Err404Component,
    InComponent,
    LoginComponent,
    LogoutComponent,
    IndesktopComponent,
    TrueMessageBoxComponent,
    FooterComponent,
    MenuComponent,
    SpinnerComponent,
    SubmenuComponent,
    UsrcardComponent,
    OrqOpcionemenuComponent,
    OrqRolesComponent,
    MdListavaloresComponent,
    MdTablasComponent,
    MdConsultassqlComponent,
    MdListasseleccionablesComponent,
    ScrCrud0Component,
    ScrCrud1Component,
    ScrListadosComponent,
    ScrCapturadatosComponent,
    ScrBuscadorComponent,
    ScrSelectorComponent,
    Crud0Component,
    Crud1Component,
    MdListavalorComponent,
    MdTablaComponent,
    MdConsultasqlComponent,
    MdListaseleccionableComponent,
    Crud1ConvaloresComponent,
    Crud2ValoresComponent,
    MdListavalorValorComponent,
    ScrCrud0sComponent,
    ScrCrud1sComponent,
    ScrListadoComponent,
    MdTablaCampoComponent,
    MdConsultasqlFiltroComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => null,
      deps: [NavigationService],
      multi: true,
    },
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
