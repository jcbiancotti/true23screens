import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { Funciones, GlobalService, spinnerstatus } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-crud0',
  templateUrl: './crud0.component.html',
  styleUrls: ['./crud0.component.css']
})
export class Crud0Component implements OnInit  {

  @Input() crud0id: string = "";
  @Input() tipo: string = "";
  @Input() rutaAdd: string = "";
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  campos: any[] = [];
  colTitulos: any[] = [];
  colCampos: any[] = [];
  nuevo: boolean = true;
  editar: boolean = true;
  borrar: boolean = true;
  listar: boolean = true;
  pantallaCrud1: string = "/";
  pantalladefQuery: string = "";
  pantallaListado: string = "";

  hayDatos: boolean = false;
  registros: any[] = [];

  // Paginator
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  pageEvent!: PageEvent;

  constructor (
    private global: GlobalService,
    private showspinner: spinnerstatus,
    private funciones: Funciones,
    private router: Router, 
    private dataaccess: DataAccessService,
    public _MatPaginatorIntl: MatPaginatorIntl,
  ) { }

  ngOnInit(): void { 
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      // PONER SPINNER
      this.showspinner.updateShowSpinner(true);
      this.recuperarDatosCrud();    
    })

  }
  
  async recuperarDatosCrud() {
  
    this.campos = [
      {
        titulo: "ID",
        ordenar: true,
        campo: "id"
      },
      {
        titulo: "Descripcion",
        ordenar: true,
        campo: "descripcion"
      }
    ];
    this.nuevo = true;
    this.editar = true;
    this.listar = false;

    this.pantallaCrud1 = this.rutaAdd;
    switch (this.tipo) {
      case 'L': {
        this.pantalladefQuery = '62f66176bd8xL';  // ID de la consulta SQL de Listas de valores
        break;
      }
      case 'T': {
        this.pantalladefQuery = '62f66176bd8xT';  // ID de la consulta SQL de Tablas
        break;
      }        
      case 'Q': {
        this.pantalladefQuery = '62f66176bd8xQ';  // ID de la consulta SQL de Consultas SQL
        break;
      }
      case 'I': {
        this.pantalladefQuery = '62f66176bd8xI';  // ID de la consulta SQL de Listas seleccionables
        break;
      }        
      default: {
        this.pantalladefQuery = ''; 
        break; 
     }       
    }

    let xlocalCampoOrden: string | null = localStorage.getItem(this.crud0id + "-orden");
    let xlocalSentido: string | null = localStorage.getItem(this.crud0id + "-sentido");

    this.campos.forEach(campo => {

      let xorden: string | null = "none";
      if (xlocalCampoOrden && xlocalCampoOrden == campo.campo) {
        xorden = xlocalSentido;
      }

      // Componer array de titulos de las columnas
      this.colTitulos.push({
        literal: campo.titulo,
        ordenar: campo.ordenar,
        campo: campo.campo,
        orden: xorden
      });
      // Componer array con los nombres de los campos
      this.colCampos.push({
        campo: campo.campo
      });
    })
    // Si no hay valor en localStorage -> Orden ascendente por la primer columna
    if (!xlocalCampoOrden) {
      this.colTitulos[0].orden = 'up';
      localStorage.setItem(this.crud0id + "-orden", this.colTitulos[0].campo);
      localStorage.setItem(this.crud0id + "-sentido", this.colTitulos[0].orden);
  
    }

    // Recuperar los registros
    if (this.pantalladefQuery) {
      this.recuperarContenido();
    }
    
    this.showspinner.updateShowSpinner(false);

  }

  async recuperarContenido() {

    this.showspinner.updateShowSpinner(true);

    // CAMPO PARA ORDENAR
    let campoOrden = "";
    let sentido: string | null = "none";

    // Recuperar el orden desde localStorage
    let localCampoOrden: string | null = "";
    let localSentido: string | null = "";

    if (localStorage.getItem(this.crud0id + "-orden")) {
      localCampoOrden = localStorage.getItem(this.crud0id + "-orden");
    }
    if (localStorage.getItem(this.crud0id + "-sentido")) {
      localSentido = localStorage.getItem(this.crud0id + "-sentido");
    }

    this.colTitulos.forEach((columna) => {

      if (columna.orden != 'none' || (localCampoOrden && columna.campo == localCampoOrden)) {
        
        columna.orden = localSentido;
        
        campoOrden = columna.campo;
        sentido = localSentido;   // columna.orden;

      }

    })

    if (this.global.DEBUG)
      console.log("Ordenado por", campoOrden, sentido);

    // Llamada al servicio de data-access
    await this.dataaccess.idquery(this.pantalladefQuery, this.pageIndex, this.pageSize, [], campoOrden, sentido,
    (respuesta:any, datos:any) => {

      if(respuesta == 'ER') {
        this.hayDatos = false;
      }            
      if(respuesta == 'KO' || respuesta.datos == null) {
        this.hayDatos = false;
      }            
      if(respuesta == 'OK') {
        this.hayDatos = true;

        if(this.global.DEBUG)
          console.log("Datos recuperados", respuesta, datos);
        
        // DATOS DE LA CONSULTA
        this.length = datos[0][2][1];
        this.pageIndex = datos[0][1][1];

        // FIN RECUPERACION
        this.registros = datos[1];

        // Ocultar SPINNER
        this.showspinner.updateShowSpinner(false);

      }
    });      

  }

  handlePageEvent(e: PageEvent) {

    if(this.global.DEBUG)
      console.log("Evento", e);

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.recuperarContenido();

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  setOrden(columna: number) {

    let xcol = columna;
    let xord = this.colTitulos[columna].orden;

    this.colTitulos.forEach(col => col.orden = 'none');

    if (xord == 'up') {
      this.colTitulos[xcol].orden = 'down';
    } else if (xord == 'down') {
      this.colTitulos[xcol].orden = 'none';
    } else if (xord == 'none') {
      this.colTitulos[xcol].orden = 'up';
    }

    localStorage.setItem(this.crud0id + "-orden", this.colTitulos[columna].campo);
    localStorage.setItem(this.crud0id + "-sentido", this.colTitulos[columna].orden);

    this.pageEvent = { previousPageIndex: this.pageIndex, pageIndex: 0, pageSize: this.pageSize, length: this.length };
    this.handlePageEvent(this.pageEvent);
    this.paginator.pageIndex = 0;

  }

  goCrud1(pId: string) {

    if(this.global.DEBUG)
      console.log("Ir a (CRUD1)(Vacío = nuevo)", pId);

    
    
    if(pId && pId != '' && pId != null) {
      // Editar un registro existente
      this.router.navigateByUrl('/in' + this.rutaAdd + '/' + pId );
    } else {
      pId = this.rutaAdd;
      // Nuevo registro
      this.router.navigateByUrl('/in' + this.rutaAdd);
    }
  }

  doListado() {

    this.showspinner.updateShowSpinner(true);

    if(this.global.DEBUG)
      console.log("Solicitar el listado en pdf de los datos", this.pantallaListado);

    // Averiguar el orden a listar
    let campoOrden = "";
    let sentido = "none";
    this.colTitulos.forEach((columna) => {
      if (columna.orden != 'none') {
        campoOrden = columna.campo;
        sentido = columna.orden;
      }
    })
    
    
    this.funciones.generarPDF(this.pantallaListado, campoOrden, sentido, async (respuesta: any, titulo: string, datos64: any) => {

      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Documento en Base64:", titulo); //, datos);
        
        // PREVISUALIZAR PERO AL DESCARGAR NO PONE EL NOMBRE DEL DOCUMENTO
        // var objbuilder = '';
        // objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
        // objbuilder += (datos64);
        // objbuilder += ('" type="application/pdf" class="internal" download="filename.pdf">');
        // objbuilder += ('<embed src="data:application/pdf;base64,');
        // objbuilder += (datos64);
        // objbuilder += ('" type="application/pdf" download="filename.pdf"/>');
        // objbuilder += ('</object>');

        // var win = window.open("#","_blank");
        // win!.document.write('<html><title>' + titulo + '</title>');
        // win!.document.write('<body style = "margin-top:0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;" > ');
        // win!.document.write(objbuilder);
        // win!.document.write('</body></html>');

        // Descarga directamente el PDF 
        const blob = this.funciones.base64toBlob(datos64, "application/pdf")
        const urlBlob = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = urlBlob;
        enlace.download = titulo + "-" + this.funciones.generarUUID("");
        enlace.click();
        
      }
      this.showspinner.updateShowSpinner(false);
    })



  }

  
}
