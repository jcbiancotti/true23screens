import { Injectable } from '@angular/core';
import { Funciones, GlobalService, sistemStatusService, spinnerstatus } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor(
    private global: GlobalService,
    private showSpinner: spinnerstatus,
    private statusmensaje: sistemStatusService,
  ) { }

  async comprobarSQL(pCadena: any, pFiltros: any, pResponder: Function) {

    if(this.global.DEBUG)
      console.log("datos.comprobarSQL", "datos a enviar", pCadena, pFiltros);
    
    let datos = {
        cadena: pCadena,
        filtros: pFiltros
    }

    try {
      const response = await fetch(this.global.API_ROUTE + "sistema/validarSQL.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {

        const compruebasqlResult = await response.json();

        if(this.global.DEBUG)
          console.log("datos.comprobarSQL", "datos devueltos back", compruebasqlResult);

        pResponder("OK", compruebasqlResult);
        
      } else {
        this.showSpinner.updateShowSpinner(false);
        console.log("Error desde backend", response);
        this.statusmensaje.updateSistemStatus({ status: "ERR", texto: "El backend no responde, intentalo más tarde!" });
        pResponder("ER");
      }

    } catch (err) {
      this.showSpinner.updateShowSpinner(false);
      this.statusmensaje.updateSistemStatus({ status: "ERR", texto: "No es posible leer datos en este momento!" });
      console.error(err);
      return err;
    }
        
  }
  
}
