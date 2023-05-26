import { Injectable } from '@angular/core';
import { GlobalService, sistemStatusService, spinnerstatus } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(
    private global: GlobalService,
    private showSpinner: spinnerstatus,
    private statusmensaje: sistemStatusService,
  ) { }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // SERVICIOS DE ACCESO A DATOS
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
    
  // ADD
  async add(pTabla: string, pId: string, pModelo: string[],  pObjeto:any, pResponder: Function) {

    // Si pTabla = "" se usa pID. que es el ID de la tabla SYS_MODELO_DATOS
    // El backend buscará el nombre de la tabla física correspondiente
    let datos = {operacion:"ADD", tabla: pTabla, id: pId, modelo: pModelo, objeto: pObjeto };
    
    if(this.global.DEBUG)
      console.log("Datos a enviar al ADD", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const addResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del ADD: ", addResult);

        if (addResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Error!", "No es posible guardar los datos en este momento!", 'E', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
            pResponder("KO");
          })
        }
        if (addResult.success == 1 && addResult.status == 201) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Exito!", "Se han guardado los datos correctamente!", 'O', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
              pResponder("OK", addResult.data);
          })
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible conectar con la base de datos en este momento", "E", "Aceptar", "");
        pResponder("KO");
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }
  }
  // READ  
  async read(pTabla: string, pId: string, pClave: string, pModelo: string[], pResponder: Function) {

    let datos = {operacion: "READ", tabla: pTabla, id: pId, clave: pClave, modelo: pModelo};  // Modelo son los campos a recuperar

    if(this.global.DEBUG)
      console.log("Datos a enviar al READ", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const readResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del READ: ", readResult);

        if (readResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({status:"ERR", texto:"No es posible leer datos en este momento!"});
          pResponder("ER");
        }
        if (readResult.success == 1 && readResult.status == 204) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({status:"WAR", texto:"No hay datos para la consulta realizada"});
          pResponder("KO", readResult.data);
        }        
        if (readResult.success == 1 && readResult.status == 200) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({status:"", texto:""});
          pResponder("OK", readResult.data);
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        pResponder("ER");
        console.log("Error desde backend", response);
        this.statusmensaje.updateSistemStatus({status:"ERR", texto:"No es posible leer datos en este momento!"});
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }
  }

  // UPDATE
  async update(pTabla: string, pId: string, pClave: string, pModelo: string[], pObjeto: any, pResponder: Function) {

    let datos = {operacion:"UPDATE", tabla: pTabla, id: pId, clave: pClave, modelo: pModelo, objeto: pObjeto };
    
    if(this.global.DEBUG)
      console.log("Datos a enviar al UPDATE", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const updateResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del UPDATE: ", updateResult);

        if (updateResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Error!", "No es posible actualizar los datos en este momento!", 'E', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
            pResponder("KO");
          })
        }
        if (updateResult.success == 1 && updateResult.status == 200) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Exito!", "Se han actualizado los datos correctamente!", 'O', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
              pResponder("OK");
          })
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible actualizar los datos en este momento", "E", "Aceptar", "");
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }

  }

  // DELETE
  async delete(pTabla: string, pId: string, pClave: string, pResponder: Function) {

    let datos = {operacion:"DELETE", tabla: pTabla, id: pId, clave: pClave };
    
    if(this.global.DEBUG)
      console.log("Datos a enviar al DELETE", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const deleteResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del DELETE: ", deleteResult);

        if (deleteResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Error!", "No es posible borrar los datos en este momento!", 'E', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
            pResponder("KO");
          })
        }
        if (deleteResult.success == 1 && deleteResult.status == 200) {
          this.showSpinner.updateShowSpinner(false);
          let resp = this.global.mensaje("Exito!", "El registro ha sido eliminado correctamente!", 'O', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
              pResponder("OK");
          })
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible eliminar los datos en este momento", "E", "Aceptar", "");
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }

  }  
  // QUERY
  // IDQUERY
  async idquery(pQueryId: string, pPagina: number, pRegxPagina: number, pFiltros: any, pOrden: string, pSentido: string, pResponder: Function) {

    let datos = {operacion:"IDQUERY", queryid: pQueryId, pagina: pPagina, nregxpagina: pRegxPagina, filtros: pFiltros, orden: pOrden, sentido: pSentido };
    
    if(this.global.DEBUG)
      console.log("Datos a enviar al IDQUERY", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const idqueryResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del IDQUERY: ", idqueryResult);

        if (idqueryResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({status:"ERR", texto:"No es posible leer datos en este momento!"});
          pResponder("ER");
        }
        if (idqueryResult.success == 1 && idqueryResult.status == 204) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({status:"WAR", texto:"No hay datos para la consulta realizada"});
          pResponder("KO", idqueryResult.data);
        }        
        if(idqueryResult.success == 1 && idqueryResult.status == 200) {
          this.statusmensaje.updateSistemStatus({status:"", texto:""});
          pResponder("OK", idqueryResult.data);
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible conectar con la base de datos en este momento", "E", "Aceptar", "");
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }

  }

  // EXECUTE
  async execute(pCadena: string, pResponder: Function) {

    let datos = { operacion: "EXECUTE", cadena: pCadena };
    
    if (this.global.DEBUG)
      console.log("Datos a enviar al EXECUTE", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "datos/data_manager.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {

        const executeResult = await response.json();

        if (this.global.DEBUG)
          console.log("Respuesta del EXECUTE: ", executeResult);

        if (executeResult.success == 0) {
          this.showSpinner.updateShowSpinner(false);
          this.statusmensaje.updateSistemStatus({ status: "ERR", texto: "No es posible leer datos en este momento!" });
          pResponder("ER");
        }
        // if (executeResult.success == 1 && executeResult.status == 204) {
        //   this.showSpinner.updateShowSpinner(false);
        //   this.statusmensaje.updateSistemStatus({ status: "WAR", texto: "No hay datos para la consulta realizada" });
        //   pResponder("OK", executeResult.data);
        // }
        if (executeResult.success == 1 && (executeResult.status == 200 || executeResult.status == 204)) {
          this.statusmensaje.updateSistemStatus({ status: "", texto: "" });
          pResponder("OK", executeResult.data);
        }

      } else {
        this.showSpinner.updateShowSpinner(false);
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible conectar con la base de datos en este momento", "E", "Aceptar", "");
      }

    } catch (err) {
      pResponder("KO");
      this.showSpinner.updateShowSpinner(false);
      console.error(err);
      return err;
    }

  }

  // CAMBIAR PASSWORD
  async cambiarpass(pCorreo: string, pActual: string, pContrasenia: string, pResponder: Function) {

    let datos = {correo: pCorreo, actual: pActual, contrasenia: pContrasenia };
    
    if(this.global.DEBUG)
      console.log("Datos a enviar para cambiar la contraseña", datos);

    try {
      const response = await fetch(this.global.API_ROUTE + "auth/olvide_pass_cuatro.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) { 

        const cambiarpassResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta del Cambiar contraseña: ", cambiarpassResult);

        if(cambiarpassResult.success == 0) {
          let resp = this.global.mensaje("Error!", "No es posible actualizar los datos en este momento!", 'E', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
            pResponder("KO");
          })
        
        }

        if(cambiarpassResult.success == 1 && cambiarpassResult.status == 404) {
          let resp = this.global.mensaje("Error!", "La contraseña actual no es correcta!", 'E', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
            pResponder("KO");
          })          
        }

        if(cambiarpassResult.success == 1 && cambiarpassResult.status == 200) {
          
          // Eliminar el token actual
          localStorage.setItem('token','');

          let resp = this.global.mensaje("Exito!", "Se han cambiado la contraseña correctamente, vuelve a identificarte!", 'O', 'Aceptar', '');   
          resp.afterClosed().subscribe(dlgResp => {
              pResponder("OK");
          })

        }

      } else {
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible actualizar los datos en este momento", "E", "Aceptar", "");
      }

    } catch (err) {
      pResponder("KO");
      console.error(err);
      return err;
    }

  }

  // SERVICIOS DE APLICACION
  async opcionesMenu_Servicio() {

    const ops: any[] = [];

    ops.push(
      {
        id: "0",
        name: "Inicio",
        padre: null,
        pantalla: '',
        pantalladef: '',
        pantalladefQuery: '',
        ruta: '/',
        children: [
          {
            id: "1",
            name: "Orquestador",
            padre: "0",
            pantalla: '',
            pantalladef: '',
            pantalladefQuery: '',
            ruta: '/',
            children: [
              {
                id: "11",
                name: "Opciones del menú lateral",
                padre: "1",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/opcionesmenu',
                children: []
              },
              {
                id: "12",
                name: "Roles de usuarios",
                padre: "1",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/roles',
                children: []
              },
            ] // FIN ORQUESTADOR
          },
          {
            id: "2",
            name: "Origenes de datos",
            padre: "0",
            pantalla: '',
            pantalladef: '',
            pantalladefQuery: '',
            ruta: '/',
            children: [
              {
                id: "21",
                name: "Lista de valores",
                padre: "2",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/listasdevalores',
                children: []
              },
              {
                id: "22",
                name: "Tablas",
                padre: "2",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/tablas',
                children: []
              },
              {
                id: "23",
                name: "Consultas SQL",
                padre: "2",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/consultassql',
                children: []
              },
              {
                id: "24",
                name: "Listas seleccionables",
                padre: "2",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/listasseleccionables',
                children: []
              }
            ]  // FIN MODELOS DE DATOS
          },
          {
            id: "3",
            name: "Definición de pantallas",
            padre: "0",
            pantalla: '',
            pantalladef: '',
            pantalladefQuery: '',
            ruta: '/',
            children: [
              {
                id: "31",
                name: "Tabla de gestions (CRUD 0)",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/tablasdegestion',
                children: []
              },
              {
                id: "32",
                name: "Edición de un registro (CRUD 1)",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/edicionesregistros',
                children: []
              },
              {
                id: "33",
                name: "Listados",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/listados',
                children: []
              },
              {
                id: "34",
                name: "Captura de datos (...)",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/capturas',
                children: []
              },
              {
                id: "35",
                name: "Buscador (...)",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/buscadores',
                children: []
              },
              {
                id: "36",
                name: "Selector (...)",
                padre: "3",
                pantalla: '',
                pantalladef: '',
                pantalladefQuery: '',
                ruta: '/selectores',
                children: []
              }
            ]
          } // FIN PANTALLAS

        ] // Fin INICIO

      }
    )
    const opcionesMenuResult = ops;
    return opcionesMenuResult;
  }
  async opcionesMenu() {

    try {
      const response = await fetch(this.global.API_ROUTE + "sistema/mainMenuOptions.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {     

        const opcionesMenuResult = response.json();
        return opcionesMenuResult;

      } else {

        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible leer las opciones del menu en este momento", "E", "Aceptar", "");

      }

    } catch (err) {
      console.error(err);
      return err;
    }        

  }

  async opcionMenu(pIdOpcion: string, pResponder: Function) {

    let datos = {opcionId: pIdOpcion};

    try {

      const response = await fetch(this.global.API_ROUTE + "sistema/mainMenuOption.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {     

        const opcionMenu = await response.json();

        if(opcionMenu.success == 1 && opcionMenu.status == 200) {
          this.statusmensaje.updateSistemStatus({status:"", texto:""});
          pResponder("OK", opcionMenu.data);
        }

      } else {

        if(this.global.DEBUG)
          console.log("Error desde backend", response);
  
        this.statusmensaje.updateSistemStatus({status: "ERR", texto: "No es posible leer las opciones del menu en este momento"});

      }

    } catch (err) {
      console.error(err);
      return err;
    }        

  }

  async tablasBBDD(pResponder: Function) {

    try {
      const response = await fetch(this.global.API_ROUTE + "sistema/recuperaTablas.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {     
        const tablasResult = await response.json();
        pResponder("OK", tablasResult.data);
      } else {
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible leer la lista de tablas en este momento", "E", "Aceptar", "");
        pResponder("KO");
      }

    } catch (err) {
      console.error(err);
      return err;
    }        
  
  }

  async estructura(pTabla: string, pResponder: Function) {

    try {

      let datos = {tabla: pTabla};

      const response = await fetch(this.global.API_ROUTE + "sistema/recuperaEstructura.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {     

        const estructuraResult = await response.json();
        pResponder("OK", estructuraResult.data);

      } else {
        pResponder("KO");
        console.log("Error desde backend", response);
        this.global.mensaje("Error", "No es posible leer la lista de tablas en este momento", "E", "Aceptar", "");

      }

    } catch (err) {
      console.error(err);
      return err;
    }        
  
  }

}
