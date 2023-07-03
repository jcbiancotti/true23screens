import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TrueMessageBoxComponent } from '../components/UX/true-message-box/true-message-box.component';
import { avartar_female } from 'src/assets/imagenes/avatar_female';
import { DataAccessService } from './data-access.service';

// OBSERVABLE Si está logged //////////////////////////////////////////////////
@Injectable({
  providedIn: 'root'
})
export class isLoggedFlagService {

  private logged = new Subject<boolean>();
  misLogged$ = this.logged.asObservable();

  updateLogguedStatus(misLoggued: boolean) {
    this.logged.next(misLoggued);
  }

}
// OBSERVABLE Mensaje del sistema ///////////////////////////////////////////
@Injectable({
  providedIn: 'root'
})
export class sistemStatusService {

  private mensaje = new Subject<any>();
  mMensaje$ = this.mensaje.asObservable();

  updateSistemStatus(mMensaje: any) {
    this.mensaje.next(mMensaje);
  }

}

// OBSERVABLE Spinner ///////////////////////////////////////////////////////
@Injectable({
  providedIn: 'root'
})
export class spinnerstatus {

  private showspinner = new Subject<boolean>();
  
  $showSpinner = this.showspinner.asObservable();

  private otrodato = new Subject<string>();
  $otrodato = this.otrodato.asObservable();

  updateShowSpinner(mvalor: boolean) {
    this.showspinner.next(mvalor);
    
  }

}

// GLOBAL //////////////////////////////////////////////////////////////////
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    public dialog: MatDialog,
    private av_female: avartar_female,
  ) { }

  API_ROUTE: string = "";
  DEBUG: boolean = true;
  
  //// PRODUCCION ////
  // API_ROUTE = "https://www.biancotti.es/Backend22/";
  // DEBUG = false;
  
  //// DESARROLLO ////
  // API_ROUTE = "/backend/";
  // DEBUG = true;

  avatar_female = this.av_female.avatar_female;
  txtLopd = "TRUE Software España, en adelante TrueSoft, con domicilio en Alcalá de Henares, Madrid (España), es titular de este sitio Web, y responsable de los datos de carácter personal suministrados por los usuarios a través de este sitio Web. El usuario queda informado sobre el tratamiento de los datos suministrados durante la navegación en la página Web y los que se generen como consecuencia de la utilización de la misma, incluidas, en su caso, las comunicaciones o las transferencias internacionales de los datos que pudieran realizarse, con las finalidades indicadas en el apartado ¿Con qué finalidad utilizamos tus datos personales? En caso de que los datos facilitados se refieran a terceras personas físicas distintas del usuario, éste garantiza haber recabado y contar con el consentimiento previo de los mismos para la comunicación de sus datos y haberles informado, con carácter previo a facilitarlos, de las finalidades del tratamiento, comunicaciones y demás términos previstos en el apartado Información sobre Protección de Datos. El usuario declara que es mayor de 14 años. Si los datos facilitados durante la navegación son de menores de 18 años, incluidos los datos de salud, como titular de la patria potestad o tutela sobre el menor, autoriza expresamente el tratamiento de los mismos en los términos establecidos en la información adicional. El usuario garantiza la exactitud y veracidad de los datos facilitados, adquiriendo el compromiso de comunicar a TrueSoft cualquier cambio en los mismos. La utilización de esta web está sujeta a la Política de Privacidad y Tratamiento de Datos Personales, a las Condiciones de Uso que se detallan a continuación, así como a la Política de Cookies. Te rogamos que las leas atentamente.";
  
  setVariablesGlobales(entorno: string) {

    if (entorno == "P") {
      this.API_ROUTE = "https://www.biancotti.es/Backend22/";
      this.DEBUG = false;
    } else {
      this.API_ROUTE = "/backend/";
      this.DEBUG = true;
    }
     
  }

  mensaje(pTitulo: string, pMensaje: string, pCategoria: string, pOk: string, pCancelar: string) {

    // PARA LLAMARLO
    // let resp = this.global.mensaje("Datos incorrectos", result.message, "E", "Aceptar", "Cancelar");
    // resp.afterClosed().subscribe(dlgResp => {
    //   console.log("Has respondido", dlgResp);
    // })

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'auto';
    dialogConfig.width = '460px';
    dialogConfig.data = {
      titulo: pTitulo,
      mensaje: pMensaje,
      categoria: pCategoria,
      btnOk: pOk,
      btnCancel: pCancelar
    }

    return this.dialog.open(TrueMessageBoxComponent, dialogConfig);


  }


}
// FUNCIONES ///////////////////////////////////////////////////////////////
@Injectable({
  providedIn: 'root',
})
export class Funciones {

  constructor(
    private global: GlobalService,
    private dataaccess: DataAccessService,
  ) { }

  tiposCampo = [
    { codigo: "C", texto: "Caracteres" },
    { codigo: "N", texto: "Numérico" },
    { codigo: "M", texto: "Moneda" },
    { codigo: "F", texto: "Teléfono" },
    { codigo: "E", texto: "Correo electrónico" },
    { codigo: "K", texto: "Número entero" },
    { codigo: "D", texto: "Fecha" },
    { codigo: "T", texto: "Fecha y hora" },
    { codigo: "H", texto: "Hora" },
    { codigo: "A", texto: "Area de texto" },
    { codigo: "S", texto: "Timestamp" },
    { codigo: "L", texto: "Lista de valores" },
    { codigo: "I", texto: "Lista seleccionable" },
    { codigo: "B", texto: "Button List" },
    { codigo: "P", texto: "Imagen/Avatar" },

  ];
  
  zfill(number: number, width: number): string {
      var numberOutput = Math.abs(number); /* Valor absoluto del número */
      var length = number.toString().length; /* Largo del número */
      var zero = '0'; /* String de cero */

      if (width <= length) {
          if (number < 0) {
              return '-' + numberOutput.toString();
          } else {
              return numberOutput.toString();
          }
      } else {
          if (number < 0) {
              return '-' + zero.repeat(width - length) + numberOutput.toString();
          } else {
              return zero.repeat(width - length) + numberOutput.toString();
          }
      }
  }
  generarUUID(prefix: string) {
      var d = new Date().getTime();
      // var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
      var uuid = 'xxxxxxxxxxxxx'.replace(
              /[xy]/g,
          function (c) {
              var r = (d + Math.random() * 13) % 13 | 0;
              d = Math.floor(d / 13);
              return (c == 'x' ? r : (r & 0x3) | 0x8).toString(13);
          }
      );
      return prefix + uuid;
  }
  ///////////////// LISTA DE VALORES ////////////////////////////////////////////////////////////////
  async listaDeValores(pId: string, pResponder: Function) {
    
    await this.dataaccess.read("sys_modelo_datos", "", "id='" + pId + "'", ["descripcion","objeto"],  
    (respuesta:any, datos: any) => {
  
      if(respuesta == 'OK') {

        if(this.global.DEBUG)
          console.log("funciones.listaDeValores", respuesta, JSON.parse(datos[0].objeto));
        
        let tmpObjeto = JSON.parse(datos[0].objeto);
        pResponder("OK", tmpObjeto['oLista']);

      }
    })

  }
  ///////////////// LISTA SELECCIONABLE /////////////////////////////////////////////////////////////
  async listaSeleccionable(pId: string, pResponder: Function) {
    
    await this.dataaccess.read("sys_modelo_datos", "", "id='" + pId + "'", ["descripcion","objeto"],  
    async (respuesta:any, datos: any) => {
  
      if(respuesta == 'OK') {
 
        if(this.global.DEBUG)
          console.log("funciones.listaSeleccionable Selectable", respuesta, JSON.parse(datos[0].objeto));
        
        let tmpObjeto = JSON.parse(datos[0].objeto);

        // La query para obtener los valores
        let idQuery = tmpObjeto.oSelectable.idQuery;

        // Ejecutar la query del selectable
        await this.dataaccess.idquery(idQuery, 0, 0, [], '', 'none',
        (respuesta: any, datos: any) => {

          if(respuesta == 'OK') {

            // Cargar resultados de la query en la lista a devolver
            //console.log("IdQuery resultados", datos);
            pResponder('OK', datos[1]);

          }

        })  
      }
    })
  }  
  ///////////////// GENERAR PDF /////////////////////////////////////////////////////////////////////
  async generarPDF(pIdListado: string, pOrden: string, pSentido: string, pResponder: Function) {
    
    await this.dataaccess.read("sys_screens", "", "id='" + pIdListado + "'", ["id", "titulo", "objeto"],
      async (respuesta: any, datos: any) => {
  
        if (respuesta == 'OK') {

          if (this.global.DEBUG)
            console.log("funciones.PantallaListado DEFINICION", respuesta, JSON.parse(datos[0].objeto));
        
          let tmpObjeto = JSON.parse(datos[0].objeto);
          
          // Componer la llamada a la generación del PDF
          try {
            
            let aColumnas: any[] = [];
            tmpObjeto.oListado.Columnas.forEach(
              (col: { titulo: any; campo: any; ancho: any; }) => aColumnas.push({ "label": col.titulo, "field": col.campo, "ancho": col.ancho }));

            let parametros = {
              titulo: tmpObjeto.oDisenio.titulo,
              subtitulo: tmpObjeto.oDisenio.subtitulo,
              orientacion: tmpObjeto.oListado.orientacion,
              query: tmpObjeto.oListado.idQuery,
              columnas: aColumnas,
              orden: pOrden,
              sentido: pSentido,
              filtros: [{ "campo": "xusuario", "valor": "CURRENTUSER" }]
            };

            const response = await fetch(this.global.API_ROUTE + "sistema/crudListado.php", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'inline; filename="Project_Report_xxxx.pdf"',
                Authorization: 'Bearer ' + localStorage.getItem('token')
              },
              body: JSON.stringify(parametros)
            });
      
            if (response.ok) {
      
              const pdfGenerado = await response.json();

              console.log("pdfGenerado", pdfGenerado);

              if(pdfGenerado.success == 1 && pdfGenerado.status == 201) {
                pResponder("OK", tmpObjeto.oDisenio.titulo, pdfGenerado.data);
              }
      
            }

          } catch (err) {
            console.log(err);
          }

        }
    
      })  
    
  
  }

  base64toBlob(base64String: string, mimeType: string): Blob {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  
}

