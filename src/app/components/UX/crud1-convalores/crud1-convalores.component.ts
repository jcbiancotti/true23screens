import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { Funciones, GlobalService, sistemStatusService, spinnerstatus } from 'src/app/servicios/global.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SistemaService } from 'src/app/servicios/sistema.service';

@Component({
  selector: 'app-crud1-convalores',
  templateUrl: './crud1-convalores.component.html',
  styleUrls: ['./crud1-convalores.component.css']
})
export class Crud1ConvaloresComponent implements OnInit {

  @Input() id: string = "";
  @Input() tipo: string = "";
  @Input() rutaCrud2: string = "";
  @Input() rutaRetorno: string = "";
  @Input() campos: any[] = [];
  @Input() colTitulos: any[] = [];
  @Input() tabla: string = "";
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    
  extraTitulo: string = "";
  nuevo: boolean = true;
  hayDatos: boolean = false;
  showDiferencias: boolean = false;

  label_agregar: string = '';
  
  agregar: boolean = true;
  editar: boolean = true;
  borrar: boolean = true;
  tools: boolean = false;

  crud1Form!: FormGroup;
  error: string = "";
  pErrores: any[] = [];

  registros: any[] = [];
  registroCompleto: any;
  objetoCompleto: any;
  tiposCampo: any[] = [];

  tablasBBDD: any[] = [];       // Tablas con el nombre físico
  opc_tablasBBDD: any[] = [];

  lPantallas: any[] = [];
  lEntDatos: any[] = [];        // Entidades de datos definidas en sys_modelo_datos
  lListasVal: any[] = [];       // Entidades de datos definidas en sys_modelo_datos
  lSelectables: any[] = [];     // Entidades de datos definidas en sys_modelo_datos
  lOrientaciones: any[] = [{ id: "V", nombre: "Vertical" }, { id: "L", nombre: "Apaisada" }];

  opc_Lista: any[] = [];
  laQ: any = { id: "", nombre: "" };
  laP: any = { id: "", nombre: "" };

  // Paginator
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  pageEvent!: PageEvent;
  
  constructor (
    private global: GlobalService,
    private sistema: SistemaService,
    private funciones: Funciones,
    private router: Router, 
    private showspinner: spinnerstatus,
    private statusmensaje: sistemStatusService,
    private dataaccess: DataAccessService,
    private fb: FormBuilder,

  ) {}

  async ngOnInit(): Promise<void> { 

    if(!this.id) {
      this.nuevo = true;
      this.id = "(nuevo registro)";
      this.extraTitulo = "(nuevo registro)";
    } else {
      this.nuevo = false;
    }
  
    // Cargar definición de la pantalla y el registro a editar
    this.crud1Form = new FormGroup({});
    await this.recuperarDatosCrud1();

    if (!this.nuevo) {
      await this.cargarRegistro();
    } else {
      await this.ListaDeEntidadesDatos("T");
      await this.ListaDeEntidadesDatos("Q");
      await this.ListaDePantallas();
    }

  }
  
  async cargarRegistro() {

    let tmpCampos: string[] = [];

    if (this.tabla == "sys_modelo_datos") {
      tmpCampos = ["id", "tipo", "descripcion", "objeto"];
    }
    if (this.tabla == "sys_screens") {
      tmpCampos = ["id", "tipo", "titulo as descripcion", "objeto"];
    }

    await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpCampos,
    async (respuesta: any, datos: any) => {
    
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Registro recuperado:", datos[0]);

        this.registroCompleto = datos[0];
        this.objetoCompleto = JSON.parse(this.registroCompleto.objeto.replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));

        if(this.global.DEBUG)
          console.log("OBJETO COMPLETO", this.registroCompleto, this.objetoCompleto);

        switch (this.tipo) {
          // Orígenes de datos
          case 'L': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            break;
          }
          case 'T': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["tabla"].patchValue(this.objetoCompleto.oTabla.nombre);
            break;
          }
          case 'Q': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["cadenaSQL"].patchValue(this.objetoCompleto.oQuery.cadenaSQL);
            break;
          }
          // Definiciones de pantallas
          case 'G': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["titulo"].patchValue(this.objetoCompleto.oDisenio.titulo);
            this.crud1Form.controls["subtitulo"].patchValue(this.objetoCompleto.oDisenio.subtitulo);
            this.crud1Form.controls["idQuery"].patchValue(this.objetoCompleto.oTablaGestiones.idQuery);
            this.crud1Form.controls["rowAgregar"].patchValue(this.objetoCompleto.oTablaGestiones.Row_Agregar);
            this.crud1Form.controls["rowEditar"].patchValue(this.objetoCompleto.oTablaGestiones.Row_Editar);
            this.crud1Form.controls["rowListar"].patchValue(this.objetoCompleto.oTablaGestiones.Row_Listar);
            this.crud1Form.controls["pantallaAdd"].patchValue(this.objetoCompleto.oTablaGestiones.PantallaAdd);
            this.crud1Form.controls["pantallaEdit"].patchValue(this.objetoCompleto.oTablaGestiones.PantallaEdit);
            this.crud1Form.controls["pantallaList"].patchValue(this.objetoCompleto.oTablaGestiones.PantallaList);
            break;
          }
          case 'C': {

            await this.ListaDeEntidadesDatos("L");
            await this.ListaDeEntidadesDatos("I");
            
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["titulo"].patchValue(this.objetoCompleto.oDisenio.titulo);
            this.crud1Form.controls["subtitulo"].patchValue(this.objetoCompleto.oDisenio.subtitulo);
            this.crud1Form.controls["tabla"].patchValue(this.objetoCompleto.oCRUD01.tabla);
            break;
          }
          case 'R': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["titulo"].patchValue(this.objetoCompleto.oDisenio.titulo);
            this.crud1Form.controls["subtitulo"].patchValue(this.objetoCompleto.oDisenio.subtitulo);
            this.crud1Form.controls["idQuery"].patchValue(this.objetoCompleto.oListado.idQuery);
            this.crud1Form.controls["orientacion"].patchValue(this.objetoCompleto.oListado.orientacion);
            break;
          } 
        }

        this.pErrores = [];
        this.showDiferencias = false;

        this.recuperarContenido();
        this.extraTitulo = "Código: " + this.id;

        if (this.tipo == "I" || this.tipo == "G" || this.tipo == "R") {
          this.ListaDeEntidadesDatos("Q");
        }
        if (this.tipo == "G") {
          this.ListaDePantallas();
        }
        if (this.tipo == "C") {
          this.ListaDeEntidadesDatos("T");
        }

      } else {
        // this.showspinner.updateShowSpinner(false);
      }

    })

  }

  async recuperarDatosCrud1() {

    if(this.global.DEBUG)
      console.log("Definición datos CRUD1", this.id);

    this.agregar = true;
    this.editar = true;
    this.borrar = true;

    // this.crud1Form = this.fb.group({});

    switch (this.tipo) {

      // Definición de entidades de datos
      case 'L': {

        this.tools = false;
        this.label_agregar = "Agregar valor";
 
        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));
        break;

      }
      case 'T': {

        // await this.recuperaTablas();

        this.tools = true;
        this.label_agregar = "Agregar campo";

        // Tipos de campos
        this.tiposCampo = this.funciones.tiposCampo;

        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));

        await this.recuperaTablas();
        this.campos[2].lista = this.tablasBBDD;
        break;

      }
      case 'Q': {

        this.tools = true;
        this.label_agregar = "Agregar filtro";
        
        // Tipos de campos
        this.tiposCampo = this.funciones.tiposCampo;
        
        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(2000)]));
        break;
      }
      // Definiciones de pantallas
      case 'G': {

        this.tools = false;
        this.label_agregar = "Agregar columna";

        this.campos[5].lista = this.lEntDatos;
        this.campos[10].lista = this.lPantallas;
        this.campos[12].lista = this.lPantallas;
        this.campos[14].lista = this.lPantallas;

        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));         // id
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Descripcion
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Titulo
        this.crud1Form.addControl(this.campos[3].campo, new FormControl("", [Validators.maxLength(100)]));                       // Subtitulo
        this.crud1Form.addControl(this.campos[4].campo, new FormControl("", [Validators.maxLength(13)]));                        // IdQuery
        this.crud1Form.addControl(this.campos[5].campo, new FormControl("", [Validators.maxLength(200)]));                       // nQuery
        this.crud1Form.addControl(this.campos[6].campo, new FormControl("", [Validators.maxLength(1)]));                         // rowAgregar
        this.crud1Form.addControl(this.campos[7].campo, new FormControl("", [Validators.maxLength(1)]));                         // rowEditar
        this.crud1Form.addControl(this.campos[8].campo, new FormControl("", [Validators.maxLength(1)]));                         // rowListar
        this.crud1Form.addControl(this.campos[9].campo, new FormControl("", [Validators.maxLength(13)]));                        // pantallaAdd
        this.crud1Form.addControl(this.campos[10].campo, new FormControl("", [Validators.maxLength(200)]));                      // npantallaAdd
        this.crud1Form.addControl(this.campos[11].campo, new FormControl("", [Validators.maxLength(13)]));                       // pantallaEdit
        this.crud1Form.addControl(this.campos[12].campo, new FormControl("", [Validators.maxLength(200)]));                      // npantallaEdit
        this.crud1Form.addControl(this.campos[13].campo, new FormControl("", [Validators.maxLength(13)]));                       // pantallaList
        this.crud1Form.addControl(this.campos[14].campo, new FormControl("", [Validators.maxLength(200)]));                      // npantallaList
        break;

      }
      case 'C': {

        this.tools = false;
        this.label_agregar = "Agregar columna";

        // Tipos de campos
        this.tiposCampo = this.funciones.tiposCampo;

        this.campos[5].lista = this.lEntDatos;
        
        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));         // id
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Descripcion
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Titulo
        this.crud1Form.addControl(this.campos[3].campo, new FormControl("", [Validators.maxLength(100)]));                       // Subtitulo
        this.crud1Form.addControl(this.campos[4].campo, new FormControl("", [Validators.maxLength(13)]));                        // tabla
        this.crud1Form.addControl(this.campos[5].campo, new FormControl("", [Validators.maxLength(200)]));                       // nTabla
        break;

      }  
      case 'R': {

        this.tools = false;
        this.label_agregar = "Agregar columna";

        this.campos[5].lista = this.lEntDatos;
        this.campos[7].lista = this.lOrientaciones;

        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));         // id
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Descripcion
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));  // Titulo
        this.crud1Form.addControl(this.campos[3].campo, new FormControl("", [Validators.maxLength(100)]));                       // Subtitulo
        this.crud1Form.addControl(this.campos[4].campo, new FormControl("", [Validators.maxLength(13)]));                        // IdQuery
        this.crud1Form.addControl(this.campos[5].campo, new FormControl("", [Validators.maxLength(200)]));                       // nQuery
        this.crud1Form.addControl(this.campos[6].campo, new FormControl(""));                                                    // orientación
        this.crud1Form.addControl(this.campos[7].campo, new FormControl("", [Validators.required]));                             // norientación
        break;

      }
    }

  }

  back() {
    // Volver hacia atras en el historial de navegación
    // comprobar si hay algún campo tocado
    let tocado = false;
    for (const field in this.crud1Form.controls) { 
      if (this.crud1Form.controls[field].touched) {
        tocado = true;
      }
    }
    if (tocado) {
      
      let resp = this.global.mensaje("Hay cambios!", "Descartas los cambios?", "Q", "Si", "No");
      resp.afterClosed().subscribe(async dlgResp => {
        if (dlgResp == true) {
          this.router.navigateByUrl(this.rutaRetorno);
        }
      })
      
    } else {
      this.router.navigateByUrl(this.rutaRetorno);
    }      
    
  }
  
  reset() {
    // Si en nuevo registro poner todos los valores por defecto
    // Si se está editando un registro poner los valores recuperados de BBDD

    // comprobar si hay algún campo tocado
    let tocado = false;
    for (const field in this.crud1Form.controls) { 
      if (this.crud1Form.controls[field].touched) {
        tocado = true;
      }
    }
    if (tocado) {
      
      let resp = this.global.mensaje("Hay cambios!", "Descartas los cambios?", "Q", "Si", "No");
      resp.afterClosed().subscribe(async dlgResp => {
        if (dlgResp == true) {
          if (this.nuevo) {
            this.recuperarDatosCrud1();
          } else {
            this.cargarRegistro();
          }
        }
      })
      
    } else {
      if (this.nuevo) {
        this.recuperarDatosCrud1();
      } else {
        this.cargarRegistro();
      }
    }

  }

  save() {

    // Guardar Nuevo registro o los cambios
    // Preguntar si guarda los cambios
    let resp = this.global.mensaje("Pregunta...", "Quieres guardar los datos?", "Q", "Si", "No");
    resp.afterClosed().subscribe(async dlgResp => {
      if (dlgResp == true) {
      
        if (this.tabla == "sys_modelo_datos") {
          this.saveDatos();
        }
        if (this.tabla == "sys_screens") {
          this.savePantallas();
        }
      }

    })
  }
  async saveDatos() {

    // Poner spinner
    this.showspinner.updateShowSpinner(true);
    
    let objLista: any[] = [];
    let objTabla: any = {nombre: "", oCampos: []};
    let objQuery: any;
    let objSelectable: any;

    switch (this.tipo) {
      case "L": {
        this.registros.forEach(reg => {
          objLista.push({
            id: reg.id,
            codigo: reg.codigo,
            descripcion: reg.descripcion,
            orden: reg.orden
          });
        })
        break;
      }
      case "T": {

        let tmpCampos: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oTabla && this.objetoCompleto.oTabla.oCampos) {
          this.objetoCompleto.oTabla.oCampos.forEach((reg: { id: any; nombre: any; tipo: any; ancho: any; decimales: any; etiqueta: any; default: any; }) => {
            tmpCampos.push({
              id: reg.id,
              nombre: reg.nombre,
              tipo: reg.tipo,
              ancho: reg.ancho,
              decimales: reg.decimales,
              etiqueta: reg.etiqueta,
              default: reg.default
            });
          })
        }
        objTabla = {
          nombre: this.crud1Form.controls['tabla'].value,
          oCampos: tmpCampos
        }
        break;
      }
      case "Q": {

        let tmpFiltros: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oQuery && this.objetoCompleto.oQuery.oFiltros) {
          this.objetoCompleto.oQuery.oFiltros.forEach((reg: { obligatorio: string; id: any; etiqueta: any; tipo: any; campo: any; }) => {
            let xBoolean = false;
            if (reg.obligatorio == "Si") {
              xBoolean = true;
            }
            tmpFiltros.push({
              id: reg.id,
              etiqueta: reg.etiqueta,
              tipo: reg.tipo,
              campo: reg.campo,
              obligatorio: xBoolean
            });
          })
        }
        objQuery = {
          cadenaSQL: this.crud1Form.controls['cadenaSQL'].value,
          oFiltros: tmpFiltros
        }
        break;
      }
      case "I": {
        objSelectable = {
          idQuery: '',
          campo_valor: '',
          campo_descripcion: ''
        }
        break;
      }
    }

    // Componer el modelo y rellenar los datos
    let tmpModelo = ["tipo", "descripcion", "entorno", "objeto"];
    let tmpObjeto = {
      tipo: this.tipo,
      descripcion: this.crud1Form.controls["descripcion"].value,
      entorno: 'C',
      objeto: JSON.stringify({
        oDatosGenerales: {
          tipo: this.tipo,
          descripcion: this.crud1Form.controls["descripcion"].value,
          entorno: 'C'
        },
        oLista: objLista,
        oTabla: objTabla,
        oQuery: objQuery,
        oSelectable: objSelectable
      })
    }

    if (this.global.DEBUG)
      console.log("Para enviar a GUARDAR:", tmpModelo, tmpObjeto);

    // Enviar al servicio de dataaccess para guardar ( Se envia sys_modelo_datos )
    if (this.nuevo) {

      // Nuevo registro
      await this.dataaccess.add(this.tabla, '', tmpModelo, tmpObjeto,
        async (respuesta: any, datos: any) => {
    
          if (respuesta == 'OK') {
    
            if (this.global.DEBUG)
              console.log(respuesta);

            this.crud1Form.markAsUntouched();
            this.back();

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
      
        })
      // Quitar el spinner y volver al crud0
      this.showspinner.updateShowSpinner(false);

    } else {

      // Actualización
      await this.dataaccess.update(this.tabla, '', "id='" + this.id + "'", tmpModelo, tmpObjeto,
        async (respuesta: any, datos: any) => {
    
          if (respuesta == 'OK') {
                
            if (this.global.DEBUG)
              console.log(respuesta);

            this.crud1Form.markAsUntouched();
            this.back();

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })
      // Quitar el spinner y volver al crud0
      this.showspinner.updateShowSpinner(false);

    } // Fin nuevo o actualizacion

  }
      
  async savePantallas() {

    // Poner spinner
    this.showspinner.updateShowSpinner(true);
    
    let objDatosGenerales: any;
    let objDisenio: any;
    let objTablaGestiones: any = {idQuery: "", Columnas: [], Row_Agregar: false, Row_Listar: false, Row_Editar: false, PantallaAdd: "", PantallaList: "", PantallaEdit: ""};
    let objCRUD01: any = { tabla: "", Campos: [] };
    let objCapturaDatos: any = { campos: [] };
    let objListado: any = { idQuery: "", Columnas: [], orientacion: "" };
    let objBuscador: any = { idQuery: "", Columnas: [], devolverValor: "0" };
    let objSelector:  any = { isQuery: "", ColumnasO: [], ColumnasD: [], maxSeleccion: 0 };

    switch (this.tipo) {
      case "G": {

        let tmpColumnas: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oTablaGestiones && this.objetoCompleto.oTablaGestiones.Columnas) {
          this.objetoCompleto.oTablaGestiones.Columnas.forEach((reg: { id: any; nombre: any; campo: any; ordenar: any; }) => {
            tmpColumnas.push({
              id: reg.id,
              titulo: reg.nombre,
              campo: reg.campo,
              ordenar: reg.ordenar
            });
          })
        }
        objDisenio = {
          titulo: this.crud1Form.controls['titulo'].value,
          subtitulo: this.crud1Form.controls['subtitulo'].value,
        }
        objTablaGestiones = {
          idQuery: this.crud1Form.controls['idQuery'].value,
          Columnas: tmpColumnas,
          Row_Agregar: this.crud1Form.controls['rowAgregar'].value,
          Row_Editar: this.crud1Form.controls['rowEditar'].value,
          Row_Listar: this.crud1Form.controls['rowListar'].value,
          PantallaAdd: this.crud1Form.controls['pantallaAdd'].value,
          PantallaEdit: this.crud1Form.controls['pantallaEdit'].value,
          PantallaList: this.crud1Form.controls['pantallaList'].value
        }
        break;
      }
      case "C": {

        let tmpCampos: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oCRUD01 && this.objetoCompleto.oCRUD01.Campos) {
          this.objetoCompleto.oCRUD01.Campos.forEach((reg: { id: any; etiqueta: any; campo: any; formato: any; requerido: boolean; valdefault: any; enabledinicial: any; ancho: any; decimales: any; listaval: any; selectable: any; }) => {
            tmpCampos.push({
              id: reg.id,
              etiqueta: reg.etiqueta,
              campo: reg.campo,
              formato: reg.formato,
              valdefault: reg.valdefault,
              enabledinicial: reg.enabledinicial,
              requerido: reg.requerido,
              ancho: reg.ancho,
              decimales: reg.decimales,
              listaval: reg.listaval,
              selectable: reg.selectable
            });
          })
        }
        objDisenio = {
          titulo: this.crud1Form.controls['titulo'].value,
          subtitulo: this.crud1Form.controls['subtitulo'].value,
        }
        objCRUD01 = {
          tabla: this.crud1Form.controls['tabla'].value,
          Campos: tmpCampos
        }
        break;
      }
      case "R": {

        let tmpColumnas: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oListado && this.objetoCompleto.oListado.Columnas) {
          this.objetoCompleto.oListado.Columnas.forEach((reg: { id: any; nombre: any; campo: any; ancho: any; }) => {
            tmpColumnas.push({
              id: reg.id,
              titulo: reg.nombre,
              campo: reg.campo,
              ancho: reg.ancho
            });
          })
        }
        objDisenio = {
          titulo: this.crud1Form.controls['titulo'].value,
          subtitulo: this.crud1Form.controls['subtitulo'].value,
        }
        objListado = {
          idQuery: this.crud1Form.controls['idQuery'].value,
          Columnas: tmpColumnas,
          orientacion: this.crud1Form.controls['orientacion'].value
        }
        break;
      } 
    } // Final del switch

    objDatosGenerales = {
      id: this.id,
      titulo: this.crud1Form.controls["descripcion"].value,
    };

    // Componer el modelo y rellenar los datos
    let tmpModelo = ["tipo", "titulo", "objeto"];
    let tmpObjeto = {
      tipo: this.tipo,
      titulo: this.crud1Form.controls["descripcion"].value,
      objeto: JSON.stringify({
        oDatosGenerales: objDatosGenerales,
        oDisenio: objDisenio,
        oTablaGestiones: objTablaGestiones,
        oCRUD01: objCRUD01,
        oCapturaDatos: objCapturaDatos,
        oListado: objListado,
        oBuscador: objBuscador,
        oSelector: objSelector
      })
    }

    if (this.global.DEBUG)
      console.log("Para enviar a GUARDAR:", tmpModelo, tmpObjeto);

    // Enviar al servicio de dataaccess para guardar ( Se envia sys_modelo_datos )
    if (this.nuevo) {

      // Nuevo registro
      await this.dataaccess.add(this.tabla, '', tmpModelo, tmpObjeto,
        async (respuesta: any, datos: any) => {
    
          if (respuesta == 'OK') {
    
            if (this.global.DEBUG)
              console.log(respuesta);

            this.crud1Form.markAsUntouched();
            this.back();

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
      
        })
      // Quitar el spinner y volver al crud0
      this.showspinner.updateShowSpinner(false);

    } else {
    
      // Actualización
      await this.dataaccess.update(this.tabla, '', "id='" + this.id + "'", tmpModelo, tmpObjeto,
        async (respuesta: any, datos: any) => {
    
          if (respuesta == 'OK') {
                
            if (this.global.DEBUG)
              console.log(respuesta);

            this.crud1Form.markAsUntouched();
            this.back();

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })
      // Quitar el spinner y volver al crud0
      this.showspinner.updateShowSpinner(false);

    } // Fin nuevo o actualizacion

  }

  delete() {
    
    let resp = this.global.mensaje("Atención!", "Quieres eliminar este registro?", "W", "Si, bórralo!", "No");
    resp.afterClosed().subscribe(async dlgResp => {
      if (dlgResp == true) {

        // Poner spinner
        this.showspinner.updateShowSpinner(true);

        // ELIMINAR REGISTRO
        await this.dataaccess.delete(this.tabla, "", "id='" + this.id + "'", 
        async (respuesta: any) => {
      
          if (respuesta == 'OK') {
    
            if (this.global.DEBUG)
              console.log(respuesta);

            this.crud1Form.markAsUntouched();
            this.back();

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
      
        })
      // Quitar el spinner y volver al crud0
      this.showspinner.updateShowSpinner(false);
      }
    })
    
  }
  async deleteValor(pId: string) {

    let resp = this.global.mensaje("Atención!", "Quieres eliminar este valor?", "W", "Si, bórralo!", "No");
    resp.afterClosed().subscribe(async dlgResp => {
      if (dlgResp == true) {

        // Poner spinner
        this.showspinner.updateShowSpinner(true);

        // Recomponer el campo Objeto para actualizarlo
        let tmpObjeto = JSON.parse(this.registroCompleto.objeto);

        switch (this.tipo) {
          case 'L': {
            tmpObjeto.oLista = tmpObjeto.oLista.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
          case 'T': {
            tmpObjeto.oTabla.oCampos = tmpObjeto.oTabla.oCampos.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
          case 'Q': {
            tmpObjeto.oQuery.oFiltros = tmpObjeto.oQuery.oFiltros.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
          case 'G': {
            tmpObjeto.oTablaGestiones.Columnas = tmpObjeto.oTablaGestiones.Columnas.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
          case 'C': {
            tmpObjeto.oCRUD01.Campos = tmpObjeto.oCRUD01.Campos.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
          case 'R': {
            tmpObjeto.oListado.Columnas = tmpObjeto.oListado.Columnas.filter((valor: { id: string; }) => valor.id != pId);
            break;
          }
        }

        this.registroCompleto.objeto = JSON.stringify(tmpObjeto);
        this.objetoCompleto = tmpObjeto;

        if (this.global.DEBUG)
          console.log("Datos sin el valor a eliminar:", tmpObjeto, this.registroCompleto);

        await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
        async (respuesta: any, datos: any) => {

          if (respuesta == 'OK') {

            if (this.global.DEBUG)
              console.log(respuesta);

            this.recuperarContenido();

            this.showspinner.updateShowSpinner(false);

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }

        })

      }
    })
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.recuperarContenido();
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map((str: string | number) => +str);
    }
  }
  async recuperarContenido() {

    this.registros = [];

    switch (this.tipo) {

      // Origenes de datos
      case 'L': {
        this.objetoCompleto.oLista.forEach((reg: { id: string, codigo: string; descripcion: string; orden: number; }) => {
          this.registros.push({
            id: reg.id,
            codigo: reg.codigo,
            descripcion: reg.descripcion,
            orden: reg.orden
          })     
        });
        break;
      }
      case 'T': {
        if (this.objetoCompleto.oTabla.oCampos) {

          this.objetoCompleto.oTabla.oCampos.forEach((reg: { id: any; nombre: any; tipo: any; ancho: any; decimales: any; etiqueta: any; default: any; }) => {

            let unTipo = this.tiposCampo.filter(tipo => tipo.codigo.startsWith(reg.tipo));

            this.registros.push({
              id: reg.id,
              nombre: reg.nombre,
              tipo: reg.tipo,
              ntipo: unTipo[0].texto,
              ancho: reg.ancho,
              decimales: reg.decimales,
              etiqueta: reg.etiqueta,
              default: reg.default
            })
          });
        }
        break;
      }
      case 'Q': {
        if (this.objetoCompleto.oQuery.oFiltros) {

          this.objetoCompleto.oQuery.oFiltros.forEach((reg: { id: string; etiqueta: string; tipo: string; campo: string; obligatorio: boolean; }) => {

            let unTipo = this.tiposCampo.filter(tipo => tipo.codigo.startsWith(reg.tipo));

            let xBoolean = "No";
            if (reg.obligatorio == true) {
              xBoolean = "Si";
            }
            this.registros.push({
              id: reg.id,
              etiqueta: reg.etiqueta,
              tipo: reg.tipo,
              ntipo: unTipo[0].texto,
              campo: reg.campo,
              obligatorio: xBoolean,
            })

          });
        }
        break;
      }
      // Definiciones de pantallas
      case 'G': {
        if (this.objetoCompleto.oTablaGestiones.Columnas) {

          this.objetoCompleto.oTablaGestiones.Columnas.forEach((reg: { id: any; titulo: any; campo: any; ordenar: any; }) => {

            let xBoolean = "No";
            if (reg.ordenar) {
              xBoolean = "Si";
            }

            this.registros.push({
              id: reg.id,
              titulo: reg.titulo,
              campo: reg.campo,
              ordenar: xBoolean
            })

          });
        }
        break;
      }
      case 'C': {

        if (this.objetoCompleto.oCRUD01.Campos) {

          this.objetoCompleto.oCRUD01.Campos.forEach((reg: { requerido: any; id: any; etiqueta: any; campo: any; formato: any; valdefault: any; enabledinicial: any; ancho: any; decimales: any; listaval: any; selectable: any; }) => {

            let xReq = "No";
            if (reg.requerido == true) {
              xReq = "Si";
            }

            let xEna = "No";
            if (reg.enabledinicial == true) {
              xEna = "Si"
            }

            let unTipo = this.tiposCampo.filter(tipo => tipo.codigo.startsWith(reg.formato));
            let unaListaVal = this.lListasVal.filter((lista: { id: string; }) => lista.id.startsWith(reg.listaval));
            let xnListaval = "";

            if (unaListaVal.length > 0) {
              xnListaval = unaListaVal[0].nombre; 
            }

            let unaSelectable = this.lSelectables.filter((lista: { id: string; }) => lista.id.startsWith(reg.selectable));
            let xnSelectable = "";

            if (unaSelectable.length > 0) {
              xnSelectable = unaSelectable[0].nombre; 
            }

            this.registros.push({
              id: reg.id,
              etiqueta: reg.etiqueta,
              campo: reg.campo,
              formato: reg.formato,
              nformato: unTipo[0].texto,
              valdefault: reg.valdefault,
              enabledinicial: xEna,
              requerido: xReq,
              ancho: reg.ancho,
              decimales: reg.decimales,
              listaval: reg.listaval,
              nlistaval: xnListaval,
              selectable: reg.selectable,
              nselectable: xnSelectable
            })

          });
        }
        break;
      }
      case 'R': {
        if (this.objetoCompleto.oListado.Columnas) {

          this.objetoCompleto.oListado.Columnas.forEach((reg: { id: any; titulo: any; campo: any; ancho: any; }) => {

            this.registros.push({
              id: reg.id,
              titulo: reg.titulo,
              campo: reg.campo,
              ancho: reg.ancho
            })

          });
        }
        break;
      }
    }

    if (this.registros.length > 0) {

      this.hayDatos = true;

      // Ordenar los registros por el campo orden
      this.registros.sort((a: any, b: any) => {
        // ASC
        if (a.orden < b.orden)
            return -1;
        // DESC
        else if (a.orden > b.orden)
            return 1;
        // NONE
        else 
            return 0;
      })     
      
      // Recortar según paginacion
      this.length = this.registros.length
      let nPaginas = 0;
      let nRegxpag = this.pageSize;
      let nPagina = this.pageIndex;

      if(nRegxpag == 0) {
        nPaginas = 1;
      } else {
        nPaginas = Math.ceil(this.length / nRegxpag);
      }
      if(nPagina > nPaginas) {
          nPagina = nPaginas;
      }

      if (nPaginas > 1) {
        this.registros = this.registros.slice(nPagina * nRegxpag, (nPagina * nRegxpag) + nRegxpag)
      }


    }

  }
  goValor(pIdvalor: string) {

    if (pIdvalor && pIdvalor != '' && pIdvalor != null) {
      // Editar un valor existente
      this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id + '/' + pIdvalor);
    } else {

      if (this.nuevo) {
        // Grabar el nuevo registro antes de crear los valores
        let resp = this.global.mensaje("Pregunta...", "Antes de agregar un valor debes guardar el registro. Quieres guardar los datos?", "Q", "Si y continuar", "No");
        resp.afterClosed().subscribe(async dlgResp => {
          if (dlgResp == true) {
            
            if (this.tabla == "sys_modelo_datos") {
              this.goValorDatos(pIdvalor);
            }
            if (this.tabla == "sys_screens") {
              this.goValorPantallas(pIdvalor);
            }
          }

        })
      } else {
        // Quitar el spinner y ir a crear el valor
        this.showspinner.updateShowSpinner(false);
        pIdvalor = this.rutaCrud2;
        this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id);
      }
    }

  }
  async goValorDatos(pIdvalor: string) {

    // Poner spinner
    this.showspinner.updateShowSpinner(true);
    
    let objLista: any[] = [];
    let objTabla: any;
    let objQuery: any;
    let objSelectable: any;

    switch (this.tipo) {
      case "L": {
        this.registros.forEach(reg => {
          objLista.push({
            id: reg.id,
            codigo: reg.codigo,
            descripcion: reg.descripcion,
            orden: reg.orden
          });
        })
        break;
      }
      case "T": {

        let tmpCampos: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oTabla && this.objetoCompleto.oTabla.oCampos) {
          this.objetoCompleto.oTabla.oCampos.forEach((reg: { id: any; nombre: any; tipo: any; ancho: any; decimales: any; etiqueta: any; default: any; }) => {
            
            tmpCampos.push({
              id: reg.id,
              nombre: reg.nombre,
              tipo: reg.tipo,
              ancho: reg.ancho,
              decimales: reg.decimales,
              etiqueta: reg.etiqueta,
              default: reg.default
            });

          })                  
        }  
        objTabla = {
          nombre: this.crud1Form.controls['tabla'].value,
          oCampos: tmpCampos
        }
        break;
      }
      case "Q": {

        let tmpFiltros: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oQuery && this.objetoCompleto.oQuery.oFiltros) {
          this.objetoCompleto.oQuery.oFiltros.forEach((reg: { obligatorio: string; id: any; etqueta: any; tipo: any; campo: any; }) => {

            let xBoolean = false;
            if (reg.obligatorio == "Si") {
              xBoolean = true;
            }
            
            tmpFiltros.push({
              id: reg.id,
              etiqueta: reg.etqueta,
              tipo: reg.tipo,
              campo: reg.campo,
              obligatorio: xBoolean
            });         
            
          })                  
        }  
        objQuery = {
          cadenaSQL: this.crud1Form.controls['cadenaSQL'].value,
          oCampos: tmpFiltros
        }
        break;
      }
      case "I": {
        objSelectable = {
          idQuery: '',
          campo_valor: '',
          campo_descripcion: ''
        }
        break;
      }
    }

    // Componer el modelo y rellenar los datos
    let tmpModelo = ["tipo", "descripcion", "entorno", "objeto"];
    let tmpObjeto = {
      tipo: this.tipo,
      descripcion: this.crud1Form.controls["descripcion"].value,
      entorno: 'C',
      objeto: JSON.stringify({
        oDatosGenerales: {
          tipo: this.tipo,
          descripcion: this.crud1Form.controls["descripcion"].value,
          entorno: 'C'
        },
        oLista: objLista,
        oTabla: objTabla,
        oQuery: objQuery,
        oSelectable: objSelectable
      })
    }


    if (this.global.DEBUG)
      console.log("Para enviar a GUARDAR:", tmpModelo, tmpObjeto);

    // Enviar al servicio de dataaccess para guardar ( Se envia sys_modelo_datos )
    await this.dataaccess.add(this.tabla, '', tmpModelo, tmpObjeto,
    async (respuesta: any, datos: any) => {

      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Respuesta recibida desde ADD en el front:", respuesta, datos);

        this.crud1Form.markAsUntouched();
        
        this.id = datos;

        // Quitar el spinner y ir a crear el valor
        this.showspinner.updateShowSpinner(false);

        pIdvalor = this.rutaCrud2;
        this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id);


      } else {
        // Quitar el spinner y quedar en crud1
        this.showspinner.updateShowSpinner(false);
      }
  
    })

  }

  async goValorPantallas(pIdvalor: string) {
          
    // Poner spinner
    this.showspinner.updateShowSpinner(true);

    let objDatosGenerales: any;
    let objDisenio: any;
    let objTablaGestiones: any = { idQuery: "", Columnas: [], Row_Agregar: false, Row_Listar: false, Row_Editar: false, PantallaAdd: "", PantallaList: "", PantallaEdit: "" };
    let objCRUD01: any = { tabla: "", Campos: [] };
    let objCapturaDatos: any = { campos: [] };
    let objListado: any = { idQuery: "", Columnas: [], idPlantilla: "" };
    let objBuscador: any = { idQuery: "", Columnas: [], devolverValor: "0" };
    let objSelector: any = { isQuery: "", ColumnasO: [], ColumnasD: [], maxSeleccion: 0 };

    switch (this.tipo) {
      case "G": {

        let tmpColumnas: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oTablaGestiones && this.objetoCompleto.oTablaGestiones.Columnas) {
          this.objetoCompleto.oTablaGestiones.Columnas.forEach((reg: { id: any; titulo: any; campo: any; ordenar: any; }) => {
            tmpColumnas.push({
              id: reg.id,
              titulo: reg.titulo,
              campo: reg.campo,
              ordenar: reg.ordenar
            });
          })
        }
        objDisenio = {
          titulo: this.crud1Form.controls['titulo'].value,
          subtitulo: this.crud1Form.controls['subtitulo'].value,
        }
        objTablaGestiones = {
          idQuery: this.crud1Form.controls['idQuery'].value,
          Columnas: tmpColumnas,
          Row_Agregar: this.crud1Form.controls['rowAgregar'].value,
          Row_Editar: this.crud1Form.controls['rowEditar'].value,
          Row_Listar: this.crud1Form.controls['rowListar'].value,
          PantallaAdd: this.crud1Form.controls['pantallaAdd'].value,
          PantallaEdit: this.crud1Form.controls['pantallaEdit'].value,
          PantallaList: this.crud1Form.controls['pantallaList'].value
        }
        break;
      }
      case "C": {

        let tmpCampos: any[] = [];

        if (this.objetoCompleto && this.objetoCompleto.oCRUD01 && this.objetoCompleto.oCRUD01.Campos) {
          this.objetoCompleto.oCRUD01.Campos.forEach((reg: { id: any; etiqueta: any; campo: any; formato: any; valdefault: any; enabledinicial: any; requerido: any; ancho: any; decimales: any; listaval: any; selectable: any; }) => {
            tmpCampos.push({
              id: reg.id,
              etiqueta: reg.etiqueta,
              campo: reg.campo,
              formato: reg.formato,
              valdefault: reg.valdefault,
              enabledinicial: reg.enabledinicial,
              requerido: reg.requerido,
              ancho: reg.ancho,
              decimales: reg.decimales,
              listaval: reg.listaval,
              selectable: reg.selectable
            });
          })
        }
        objDisenio = {
          titulo: this.crud1Form.controls['titulo'].value,
          subtitulo: this.crud1Form.controls['subtitulo'].value,
        }
        objCRUD01 = {
          tabla: this.crud1Form.controls['tabla'].value,
          Campos: tmpCampos
        }
        break;
      }
    } // Final del switch

    objDatosGenerales = {
      id: this.id,
      titulo: this.crud1Form.controls["descripcion"].value,
    };

    // Componer el modelo y rellenar los datos
    let tmpModelo = ["tipo", "titulo", "objeto"];
    let tmpObjeto = {
      tipo: this.tipo,
      titulo: this.crud1Form.controls["descripcion"].value,
      objeto: JSON.stringify({
        oDatosGenerales: objDatosGenerales,
        oDisenio: objDisenio,
        oTablaGestiones: objTablaGestiones,
        oCRUD01: objCRUD01,
        oCapturaDatos: objCapturaDatos,
        oListado: objListado,
        oBuscador: objBuscador,
        oSelector: objSelector
      })
    }

    if (this.global.DEBUG)
      console.log("Para enviar a GUARDAR:", tmpModelo, tmpObjeto);

    // Enviar al servicio de dataaccess para guardar ( Se envia sys_modelo_datos )
    await this.dataaccess.add(this.tabla, '', tmpModelo, tmpObjeto,
    async (respuesta: any, datos: any) => {

      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Respuesta recibida desde ADD en el front:", respuesta, datos);

        this.crud1Form.markAsUntouched();
      
        this.id = datos;

        // Quitar el spinner y ir a crear el valor
        this.showspinner.updateShowSpinner(false);

        pIdvalor = this.rutaCrud2;
        this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id);


      } else {
        // Quitar el spinner y quedar en crud1
        this.showspinner.updateShowSpinner(false);
      }

    })

  }        

  async recuperaTablas() {

    await this.dataaccess.tablasBBDD(
    async (respuesta: any, datos: any) => {
            
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Lista de tablas recibidas en el front:", respuesta, datos);

        this.tablasBBDD = datos;
        
        // Quitar el spinner y ir a crear el valor
        this.showspinner.updateShowSpinner(false);

      } else {
        // Quitar el spinner y quedar en crud1
        this.showspinner.updateShowSpinner(false);
      }
        
    })

  }

  // Recibir el valor del input de la LISTA DE VALORES
  onKey(pLista: string, evento: any) { 
    let valor = evento.target.value;

    switch (pLista) {
      case 'tabla': {
        this.opc_Lista = this.search(this.tablasBBDD, valor);
        break;
      }
      case 'nQuery': {
        this.opc_Lista = this.search(this.lEntDatos, valor);
        break;
      }
      case 'npantallaAdd':
      case 'npantallaEdit':
      case 'npantallaList':
      {
        this.opc_Lista = this.search(this.lPantallas, valor);
        break;
      }
    }
  }
  search(pLista: any[], value: string) { 
    let filter = value.toLowerCase();
    return pLista.filter((opcion: { nombre: string; }) => opcion.nombre.toLowerCase().startsWith(filter));
  }
  
  // Tool Comparar la definición de la tabla con la tabla existente en la BBDD
  async goCompararEstructura() {

    this.showspinner.updateShowSpinner(true);

    this.pErrores = [];
    this.showDiferencias = false;
    let pDescripcion = this.crud1Form.controls['descripcion'].value;
    let pTabla = this.crud1Form.controls['tabla'].value;

    // Verificar si la tabla existe
    let existe = this.tablasBBDD.filter((t: { nombre: any; }) => t.nombre == pTabla).length > 0;

    if (existe) {
      await this.dataaccess.estructura(pTabla,
      async (respuesta: any, datos: any) => {
        
        if (respuesta == 'OK') {

          if (this.global.DEBUG)
            console.log("Estructura recibida en el front:", respuesta, datos);

          // Comprobar si hay campos en la definición
          if (!this.objetoCompleto.oTabla.oCampos || (this.objetoCompleto.oTabla.oCampos && this.objetoCompleto.oTabla.oCampos.length == 0)) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "La tabla: " + pDescripcion + ", no tiene campos definidos.",
              accionTxt: "Definir campos",
              accionSQL: "NONE",
              resuelto: false,
              manual: true,
              add2def: false,
              objeto:   null
            })
          }

          // Campos de auditoria
          let clave = false;
          let id = false;
          let created_at = false;
          let updated_at = false;
          let deleted_at = false;
          let deleted = false;
          
          // Comprobar si los campos de la BBDD están en la definición
          datos.forEach((campo: { nombre: string; tipo: any; valdefault: string, cancho: number, nancho: number, decimales: number}) => {

            let esta: boolean = false;
            let xDefCampo: any;

            if (this.objetoCompleto.oTabla.oCampos && this.objetoCompleto.oTabla.oCampos.length != 0) {
              this.objetoCompleto.oTabla.oCampos.forEach((defCampo: { nombre: any; tipo: string, default: string, ancho: number, decimales: number}) => {
                if (defCampo.nombre == campo.nombre) {
                  esta = true;
                  xDefCampo = defCampo;
                }
              })
            }
            // Comprobar campos de auditoria
            switch (campo.nombre) {
              case 'clave': {
                clave = true;
                break;
              }
              case 'id': {
                id = true;
                break;
              }
              case 'created_at': {
                created_at = true;
                break;
              }
              case 'updated_at': {
                updated_at = true;
                break;
              }    
              case 'deleted_at': {
                deleted_at = true;
                break;
              }   
              case 'deleted': {
                deleted = true;
                break;
              }                  
            } 

            if (esta) {
              
              // El campo existe -> Comprobar la definición del campo ( comparar campo VS xDefCampo)
              let xdiferencias: string = "";
              let xtipo: string = "";
              let xancho: number = 0;
              let xvaldef: string = "";
              let xdefau: string = "";
              let xdeftipo: string = "";

              // Ajustar el tipo y el ancho
              if (campo.tipo == "int") {
                xtipo = "K";
                xancho = campo.nancho;
              } else if (campo.tipo == "decimal" || campo.tipo == "number") {
                xtipo = "N";
                xancho = campo.nancho;

              } else if (campo.tipo == "varchar") {
                xtipo = "C";
                xancho = campo.cancho;
              } else if (campo.tipo == "datetime") {
                xtipo = "T";
                xancho = campo.cancho;
              } else if (campo.tipo == "date") {
                xtipo = "D";
                xancho = campo.cancho;
              } else if (campo.tipo == "timestamp") {
                xtipo = "S";
                xancho = campo.cancho;
              } else if (campo.tipo == "time") {
                xtipo = "H";
                xancho = campo.cancho;
              } else if (campo.tipo == "text") {
                xtipo = "A";
                xancho = campo.cancho;
              }

              // Ajustar el tipo de la definición
              xdeftipo = xDefCampo.tipo;
              if (xdeftipo == "M") {
                xdeftipo = "N";
              }

              // Ajustar el valor por defecto
              xvaldef = campo.valdefault;
              if (campo.valdefault == null) {
                xvaldef = "";
              } 
              if (xtipo == "N") {
                xvaldef = xvaldef.replace(".", ",");
              }
              xdefau = xDefCampo.default;
              if (xdefau == 'undefined' || xdefau == null) {
                xdefau = "";
              }

              // Comparar diferencias
              let bitDiferencias = 0;

              if (xtipo != xdeftipo) {
                xdiferencias += " Tipo de campo";
                bitDiferencias += 100
              }
              if ((xtipo != "D" && xtipo != "T" && xtipo != "H") && xancho != xDefCampo.ancho) {
                xdiferencias += " Ancho del campo " + xancho;
                bitDiferencias += 10;
              }
              if (xvaldef != xdefau) {
                xdiferencias += " Valor por defecto en la tabla:" + xvaldef + " vs. en la definición:" + xdefau;
                bitDiferencias += 1;
              }              
              // Agregar el error
              if (xdiferencias != "") {
                this.pErrores.push({
                  id: this.funciones.generarUUID(""),
                  categoria: "ERR",
                  texto: "El campo '" + campo.nombre + "' tiene diferencias entre la definición y la tabla (" + xdiferencias + ")",
                  accionTxt: "Revisar definición",
                  accionSQL: "ALTER TABLE",
                  resuelto: false,
                  manual: true,
                  add2def: false,
                  diferencias: bitDiferencias,
                  objeto: {campo: campo, defCampo: xDefCampo }
                })
              }


            } else {
              // El campo no existe en la definición -> Alter table -> crear campo  // Alter table eliminar campo
              this.pErrores.push({
                id: this.funciones.generarUUID(""),
                categoria: "ERR",
                texto: "El campo '" + campo.nombre + "' no está en la definición de la tabla",
                accionTxt: "Definir campos",
                accionSQL: "ALTER TABLE",
                resuelto: false,
                manual: true,
                add2def: true,
                objeto: campo,
                diferencias: 0
              })

            }

          })
          
          // Comprobar si los campos de la definición están en la tabla de la BBDD
          this.objetoCompleto.oTabla.oCampos.forEach((defCampo: { nombre: string; }) => {

            let esta = false;
           
            datos.forEach((campo: { nombre: any; }) => {
              if (campo.nombre == defCampo.nombre) {
                esta = true;
              }
            })
            
            // No se compara la definición del campo existente porque ya se ha comprobado en el paso anterior
            if (!esta) {

              // El campo no existe -> Alter table -> crear campo o Delete en la definicion
              this.pErrores.push({
                id: this.funciones.generarUUID(""),
                categoria: "ERR",
                texto: "El campo '" + defCampo.nombre + "' no está en la tabla",
                accionTxt: "Crear campo",
                accionSQL: "ALTER TABLE",
                resuelto: false,
                manual: true,
                add2def: false,
                add2table: true,
                objeto: defCampo,
                diferencias: 0
              })

            }

          })

          // Comprobar si existen los campos ID, clave y los de auditoría (created_at, updated_at, deleted_at, deleted)
          // No existen -> Crear los campos
          if (!clave) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'clave' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 10,
                decimales: 0,
                default: "",
                etiqueta: "clave",
                id: this.funciones.generarUUID(""),
                nombre: "clave",
                tipo: "K"
              },
              diferencias: 0
            })
          }
          if (!id) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'id' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 13,
                decimales: 0,
                default: "",
                etiqueta: "id",
                id: this.funciones.generarUUID(""),
                nombre: "id",
                tipo: "C"
              },
              diferencias: 0
            })
          }          
          if (!created_at) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'created_at' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 0,
                decimales: 0,
                default: "CURRENT_TIMESTAMP",
                etiqueta: "created_at",
                id: this.funciones.generarUUID(""),
                nombre: "created_at",
                tipo: "S"
              },
              diferencias: 0
            })
          }
          if (!updated_at) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'updated_at' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 0,
                decimales: 0,
                default: "",
                etiqueta: "updated_at",
                id: this.funciones.generarUUID(""),
                nombre: "updated_at",
                tipo: "S"
              },
              diferencias: 0
            })
          }
          if (!deleted_at) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'deleted_at' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 0,
                decimales: 0,
                default: "",
                etiqueta: "deleted_at",
                id: this.funciones.generarUUID(""),
                nombre: "deleted_at",
                tipo: "S"
              },
              diferencias: 0
            })
          }
          if (!deleted) {
            this.pErrores.push({
              id: this.funciones.generarUUID(""),
              categoria: "ERR",
              texto: "El campo 'deleted' (obligatorio) no está en la tabla",
              accionTxt: "Crear campo",
              accionSQL: "ALTER TABLE",
              resuelto: false,
              manual: true,
              add2def: false,
              add2table: true,
              objeto: {
                ancho: 1,
                decimales: 0,
                default: "0",
                etiqueta: "deleted",
                id: this.funciones.generarUUID(""),
                nombre: "deleted",
                tipo: "K"
              },
              diferencias: 0
            })
          }     
          
          // Quitar el spinner e ir a crear el valor
          this.showspinner.updateShowSpinner(false);

        } else {
          // Quitar el spinner y quedar en crud1
          this.showspinner.updateShowSpinner(false);
        }

      })
   
    } else {

      this.pErrores.push({
        id: this.funciones.generarUUID(""),
        categoria: "ERR",
        texto: "La tabla: " + pDescripcion + " (" + pTabla + "), no existe en la BBDD.",
        accionTxt: "Crear",
        accionSQL: "CREATE TABLE",
        resuelto: false,
        manual: false,
        add2def: false,
        objeto: null,
        diferencias: 0
      })

      // Comprobar si hay campos en la definición
      if (
        (!this.objetoCompleto || !this.objetoCompleto.oTabla || !this.objetoCompleto.oTabla.oCampos ||
          (this.objetoCompleto.oTabla.oCampos && this.objetoCompleto.oTabla.oCampos.length == 0)
        )
      ) {
        this.pErrores.push({
          id: this.funciones.generarUUID(""),
          categoria: "ERR",
          texto: "La tabla: " + pTabla + ", no tiene campos definidos.",
          accionTxt: "Definir campos",
          accionSQL: "NONE",
          resuelto: false,
          manual: true,
          add2def: false,
          objeto: null,
          diferencias: 0
        })
      }

    }
    // Quitar el spinner y quedar en crud1
    this.showspinner.updateShowSpinner(false);
    if (this.pErrores.length == 0) {
      this.statusmensaje.updateSistemStatus({ status: "INF", texto: "No hay diferencias entre la definición y la tabla de la base de datos" });
      this.showDiferencias = false;
    } else {
      this.showDiferencias = true;
    }

  }

  async goRecuperarDefinicion() {

    // Verificar si la tabla existe
    let pDescripcion = this.crud1Form.controls['descripcion'].value;
    let pTabla = this.crud1Form.controls['tabla'].value;
    let existe = this.tablasBBDD.filter((t: { nombre: any; }) => t.nombre == pTabla).length > 0;

    // La tabla no existe, no se pueden recuperar los campos
    if (!existe) {

      const resp = this.global.mensaje("Error!", "La tabla '" + pTabla + "' no existe en la BBDD!", "E", "Aceptar", "");
      resp.afterClosed().subscribe(async (dlgResp: any) => {});   

    } else {

      // La tabla existe. La definición es nueva?
      if (this.nuevo) {

        const resp = this.global.mensaje("Aviso!", "Se va a almacenar la definición de la tabla '" + pDescripcion + "'!", "W", "Continuar", "Cancelar");
        resp.afterClosed().subscribe(async (dlgResp: boolean) => {
          if (dlgResp == true) {

            // En nueva y hay campos definidos (raro, porque al añadir un campo se está grabando la definición)
            if (this.registros.length > 0) {
              const resp = this.global.mensaje("Atención!", "Si recuperas la definición desde la BBDD se eliminará la definición existente!", "W", "Continuar", "Cancelar");
              resp.afterClosed().subscribe(async (dlgResp: boolean) => {
                if (dlgResp == true) {
                  this.leerDefinicionDesdeBBDD();
                }
              });
              
            } else {
              // Es nueva y no hay campos definidos
              this.leerDefinicionDesdeBBDD();
            }

          }
        });

      } else {

        // No es una definición nueva y hay campos definidos
        if (this.registros.length > 0) {
          const resp = this.global.mensaje("Atención!", "Si recuperas la definición desde la BBDD se eliminará la definición existente!", "W", "Continuar", "Cancelar");
          resp.afterClosed().subscribe(async (dlgResp: boolean) => {
            if (dlgResp == true) {
              this.leerDefinicionDesdeBBDD();
            }
          });
          
        } else {
          // No es una definición nueva y NO hay campos definidos
          this.leerDefinicionDesdeBBDD();
        }

      }

    }

  }

  async leerDefinicionDesdeBBDD() {
    
    this.showspinner.updateShowSpinner(true);

    let pTabla = this.crud1Form.controls['tabla'].value;

    await this.dataaccess.estructura(pTabla,
    async (respuesta: any, datos: any) => {
          
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Estructura recibida en el front:", respuesta, datos);

        // Tabla nueva
        if (this.nuevo) {
          this.objetoCompleto = {};
          this.objetoCompleto.oTabla = {};
        }
        
        // Eliminar la definición existente
        this.objetoCompleto.oTabla = { nombre: pTabla, oCampos: [] };

        // Recorrer los campos y crear definiciones
        datos.forEach((campo: { tipo: string; nancho: number; cancho: number; nombre: any; decimales: any; valdefault: any; }) => {

          let xtipo = "";
          let xancho = 0;
  
          if (campo.tipo == "int" || campo.tipo == "decimal") {
            xtipo = "N";
            xancho = campo.nancho;
          } else if (campo.tipo == "varchar") {
            xtipo = "C";
            xancho = campo.cancho;
          } else if (campo.tipo == "datetime") {
            xtipo = "T";
            xancho = campo.cancho;
          } else if (campo.tipo == "date") {
            xtipo = "D";
            xancho = campo.cancho;
          } else if (campo.tipo == "timestamp") {
            xtipo = "S";
            xancho = campo.cancho;
          } else if (campo.tipo == "time") {
            xtipo = "H";
            xancho = campo.cancho;
          } else if (campo.tipo == "text") {
            xtipo = "A";
            xancho = campo.cancho;
          }
  
          this.objetoCompleto.oTabla.oCampos.push({
            id: this.funciones.generarUUID(""),
            nombre: campo.nombre,
            tipo: xtipo,
            ancho: xancho,
            decimales: campo.decimales,
            etiqueta: campo.nombre,
            default: campo.valdefault
          })

        })  // Final de los campos recuperados
        
        // Si aun no se ha guardado la tabla crea el objeto vacio
        if (this.nuevo) {
          
          this.id = this.funciones.generarUUID("");

          this.registroCompleto = {
            id: this.id,
            tipo: "T",
            descripcion: this.crud1Form.controls['descripcion'].value,
            entorno: "C",
            objeto: {
              oDatosGenerales: {
                tipo: 'T',
                descripcion: this.crud1Form.controls['descripcion'].value,
                entorno: 'C'
              },
              oLista: [],
              oTabla: {
                nombre: pTabla,
                oCampos: []
              },
              oQuery: {},
              oSelectable: {}
            }
          }
        }

        if (this.global.DEBUG)
          console.log(this.objetoCompleto, this.registroCompleto);

        // Almacenar la dedinición creada
        this.registroCompleto.objeto = JSON.stringify(this.objetoCompleto);

        if (this.nuevo) {

          // Crear porque no existe
          await this.dataaccess.add(this.tabla, "", ["tipo", "descripcion", "entorno", "objeto"], this.registroCompleto,
          async (respuesta: any, datos: any) => {
        
            if (respuesta == 'OK') {
        
              if (this.global.DEBUG)
                console.log(respuesta);
              
              // Actualizar la lista de campos
              this.crud1Form.markAsUntouched();
              this.recuperarContenido();

              this.showspinner.updateShowSpinner(false);

            } else {
              // Quitar el spinner y quedar en crud1
              this.showspinner.updateShowSpinner(false);
            }
      
          })    

        } else {

          // Ya existe, actualizar
          await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
          async (respuesta: any, datos: any) => {
        
            if (respuesta == 'OK') {
        
              if (this.global.DEBUG)
                console.log(respuesta);
              
              // Actualizar la lista de campos
              this.crud1Form.markAsUntouched();
              this.recuperarContenido();

              this.showspinner.updateShowSpinner(false);

            } else {
              // Quitar el spinner y quedar en crud1
              this.showspinner.updateShowSpinner(false);
            }
      
          })    

        }    

      } else {
        // Quitar el spinner y quedar en crud1
        this.showspinner.updateShowSpinner(false);
      }
  
    }) 


  }

  async createtable(errid: string) {

    let accionManual = false;

    this.pErrores.forEach((e: { manual: any; }) => {
      if (e.manual) {
        accionManual = true;
      }
    });

    if (accionManual) {
      
      const resp = this.global.mensaje("Bloqueo!", "Se requiere una acción manual antes de poder crear la tabla", "E", "Aceptar", "");
      resp.afterClosed().subscribe(async (dlgResp: any) => { });
      
    } else {

      let cadena: string = "";
      let pTabla = this.crud1Form.controls['tabla'].value;
      let pDescripcion = this.crud1Form.controls['descripcion'].value;
      
      let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)

      const resp = this.global.mensaje("Atención!", "Se va a crear la tabla '" + pTabla + "'!", "W", "Continuar", "Cancelar");
      resp.afterClosed().subscribe(async (dlgResp: boolean) => { 
        if (dlgResp == true) {
        
          // Crar la tabla
          this.showspinner.updateShowSpinner(true);

          cadena = "CREATE TABLE " + pTabla + "(";
          cadena += "clave int(11) NOT NULL,";
          cadena += "id varchar(13) DEFAULT NULL,";

          this.objetoCompleto.oTabla.oCampos.forEach((campo: { nombre: string; tipo: string; ancho: string; decimales: string; default: string; }) => {

            // Campos de sistema. Se crear por cadena, no por definición
            if (campo.nombre != "clave" &&
              campo.nombre != "id" &&
              campo.nombre != "created_at" &&
              campo.nombre != "deleted_at" &&
              campo.nombre != "deleted" &&
              campo.nombre != "updated_at"              
            ) {

              let campoDef = "";
              switch (campo.tipo) {
                // //////////////// CAMPO TIPO CARACTERES
                case 'C': {
                  campoDef = "varchar(" + campo.ancho + ")";
                  if (campo.default != "") {
                    campoDef += " DEFAULT '" + campo.default + "'";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO NUMERICO
                case 'N': {
                  campoDef = "decimal(" + campo.ancho + "," + campo.decimales + ")";
                  if (campo.default != "") {
                    campoDef += " DEFAULT " + campo.default.replace(",",".") + "";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO MONEDA  
                case 'M': {
                  campoDef = "decimal(" + campo.ancho + "," + campo.decimales + ")";
                  if (campo.default != "") {
                    campoDef += " DEFAULT " + campo.default.replace(",",".") + "";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO SI/NO
                case 'K': {
                  campoDef = "int(" + campo.ancho + ")";
                  if (campo.default != "") {
                    if (campo.default == 'S') {
                      campoDef += " DEFAULT 1";
                    } else {
                      campoDef += " DEFAULT 0";
                    }
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO FECHA
                case 'D': {
                  campoDef = "date";
                  if (campo.default != "") {
                    campoDef += " DEFAULT '" + campo.default.replaceAll("/","-") + "'";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO FECHA Y HORA
                case 'T': {
                  campoDef = "datetime";
                  if (campo.default != "") {
                    campoDef += " DEFAULT '" + campo.default + "'";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO HORA
                case 'H': {
                  campoDef = "time";
                  if (campo.default != "") {
                    campoDef += " DEFAULT '" + campo.default + "'";
                  } else {
                    campoDef += " DEFAULT NULL";
                  }
                  break;
                }
                // //////////////// CAMPO TIPO AREA DE TEXTO  
                case 'A': {
                  campoDef = "text DEFAULT NULL";
                  break;
                }
                // //////////////// CAMPO TIPO TIMESTAMP  
                case 'S': {
                  campoDef = "timestamp DEFAULT 'CURRENT_TIMESTAMP'";
                  break;
                }                      
              }
              // AÑADIR LA DEFINICION DEL CAMPO A LA CADENA

              cadena += "" + campo.nombre + " " + campoDef + ",";
            
            } // Fin de CLAVE o ID

          })
          cadena += "created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,";
          cadena += "updated_at timestamp NULL DEFAULT NULL,";
          cadena += "deleted_at timestamp NULL DEFAULT NULL,";
          cadena += "deleted int(1) DEFAULT '0'";

          cadena += ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
                
          // Cadena para crear la PK
          let cadenaPK = "ALTER TABLE `" + pTabla + "` ADD PRIMARY KEY (`clave`);"

          // Cadena para el AUTOINCREMENTAL
          let cadenaAI = "ALTER TABLE `" + pTabla + "` MODIFY clave int(11) NOT NULL AUTO_INCREMENT;"
          
          // EXECUTE 
          
          if(this.global.DEBUG)
            console.log(cadena, cadenaPK, cadenaAI);

          this.dataaccess.execute(cadena + cadenaPK + cadenaAI,
          async (respuesta: any, datos: any) => {

            if (respuesta == 'OK') {
      
              if (this.global.DEBUG)
                console.log("Respuesta del EXECUTE en front:", datos[0]);
              
              // Marcar el error como resuelto
              elError[0].resuelto = true;
              
              this.showspinner.updateShowSpinner(false);
        
              const resp = this.global.mensaje("Tarea realizada!", "Se ha creado la tabla: " + pDescripcion + " (" + pTabla + ") según la definición!", "I", "Aceptar", "");
              resp.afterClosed().subscribe(async (dlgResp: any) => {

                  // Actualizar la lista de campos
                  this.goCompararEstructura();
      
               });

              this.recuperaTablas();

              this.showspinner.updateShowSpinner(false);
      
            } else {
              this.showspinner.updateShowSpinner(false);
            }
      
          })

        } // Fin de SI, continuar

      });  // Fin de Continuar/Cancelar
      
    } // Fin del else No hay tareas manuales

  }

  // /////////////////// EL CAMPO ESTA EN LA TABLA Y NO EN LA DEFINICION -> AGREGARLO A LA DEFINICION ////////////////////
  async add2definicion(errid: string) {

    const resp = this.global.mensaje("Atención!", "Quieres agregar el campo de la tabla en la definición?", "W", "Si, agrégalo", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        // Añadir el campo a la definición

        this.showspinner.updateShowSpinner(true);

        let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)
        let xtipo = "";
        let xancho = 0;

        if (elError[0].objeto.tipo == "int") {
          xtipo = "K";
          xancho = elError[0].objeto.nancho;
        } else if (elError[0].objeto.tipo == "decimal") {
          xtipo = "N";
          xancho = elError[0].objeto.nancho;
        } else if (elError[0].objeto.tipo == "varchar") {
          xtipo = "C";
          xancho = elError[0].objeto.cancho;
        } else if (elError[0].objeto.tipo == "datetime") {
          xtipo = "T";
          xancho = elError[0].objeto.cancho;
        } else if (elError[0].objeto.tipo == "date") {
          xtipo = "D";
          xancho = elError[0].objeto.cancho;
        } else if (elError[0].objeto.tipo == "timestamp") {
          xtipo = "S";
          xancho = elError[0].objeto.cancho;
        } else if (elError[0].objeto.tipo == "time") {
          xtipo = "H";
          xancho = elError[0].objeto.cancho;
        } else if (elError[0].objeto.tipo == "text") {
          xtipo = "A";
          xancho = elError[0].objeto.cancho;
        }

        let nuevoId = this.funciones.generarUUID("");

        let tmpCampos: any[] = [];
        if (!this.objetoCompleto.oTabla.oCampos) {
          this.objetoCompleto.oTabla.oCampos = tmpCampos;
        }

        this.objetoCompleto.oTabla.oCampos.push({
          id: nuevoId,
          nombre: elError[0].objeto.nombre,
          tipo: xtipo,
          ancho: xancho,
          decimales: elError[0].objeto.decimales,
          etiqueta: elError[0].objeto.nombre,
          default: elError[0].objeto.valdefault
        })

        this.registroCompleto.objeto = JSON.stringify(this.objetoCompleto);

        if (this.global.DEBUG)
          console.log(this.objetoCompleto, this.registroCompleto);

        await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
        async (respuesta: any, datos: any) => {
      
          if (respuesta == 'OK') {
      
            if (this.global.DEBUG)
              console.log(respuesta);
            
            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

            this.showspinner.updateShowSpinner(false);

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })
        
      } // Si

    })

  }

  // /////////////////// EL CAMPO ESTA EN LA TABLA Y NO EN LA DEFINICION -> BORRARLO DE LA TABLA /////////////////////////
  async del2tabla(errid: string) {
    
    let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid);
    let pTabla = this.crud1Form.controls['tabla'].value;
    
    const resp = this.global.mensaje("Atención!", "Quieres ELIMINAR el campo '" + elError[0].objeto.nombre + "' de la tabla '" + pTabla + "'? (Si contiene datos, estos se perderán)", "W", "Si, elimínalo", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        // Añadir el campo a la definición

        this.showspinner.updateShowSpinner(true);

        let cadena: string = "";

        let xcampodef = elError[0].objeto.tipo;
        if (elError[0].objeto.tipo == 'int') {
          xcampodef += "(" + elError[0].objeto.nancho + ")";
        }
        if (elError[0].objeto.tipo == 'decimal') {
          xcampodef += "(" + elError[0].objeto.nancho + "," + elError[0].objeto.decimales + ")";
        }
        if (elError[0].objeto.tipo == 'varchar' || elError[0].objeto.tipo == 'text') {
          xcampodef += "(" + elError[0].objeto.cancho + ")";
        }
        xcampodef += " NULL";

        // Cadena para renombrar el campo (ALTER TABLE `pruebas` CHANGE `xxx` `xxxd` INT(10) NOT NULL;)
        cadena = "ALTER TABLE `" + pTabla + "` CHANGE `" + elError[0].objeto.nombre + "` `_" + this.funciones.generarUUID("") + "_" + elError[0].objeto.nombre + "` " + xcampodef + ";"

        // EXECUTE 
        
        if(this.global.DEBUG)
          console.log(elError, cadena);

        this.dataaccess.execute(cadena,
        async (respuesta: any, datos: any) => {

        if (respuesta == 'OK') {
  
          if (this.global.DEBUG)
            console.log("Respuesta del EXECUTE en front:", datos[0]);
          
          // Marcar el error como resuelto
          elError[0].resuelto = true;
          
          this.showspinner.updateShowSpinner(false);
    
          const resp = this.global.mensaje("Campo eliminado!", "Se ha eliminado el campo '" + elError[0].objeto.nombre + " de la tabla '" + pTabla + "'!", "I", "Aceptar", "");
          resp.afterClosed().subscribe(async (dlgResp: any) => { 

            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

          });

        } else {
          this.showspinner.updateShowSpinner(false);
        }
  
      })

      } // Si

    })

  }

  // /////////////////// EL CAMPO ESTA EN LA DEFINICION Y NO EN LA TABLA -> AGREGARLO EN LA TABLA ///////////////////////
  async add2table(errid: string) {

    let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)
    let pTabla = this.crud1Form.controls['tabla'].value;

    const resp = this.global.mensaje("Atención!", "Quieres CREAR el campo '" + elError[0].objeto.nombre + "' en la tabla '" + pTabla + "'?", "W", "Si, créalo", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        this.showspinner.updateShowSpinner(true);

        let cadena: string = "";

        let xcampodef = "";

        if (elError[0].objeto.tipo == 'K') {
          xcampodef += "int(" + elError[0].objeto.ancho + ") NULL";
          if (elError[0].objeto.default == "1") {
            xcampodef += " DEFAULT '1'";
          } else {
            xcampodef += " DEFAULT '0'";
          }
        }
        if (elError[0].objeto.tipo == 'N' || elError[0].objeto.tipo == 'M') {
          xcampodef += "decimal(" + elError[0].objeto.ancho + "," + elError[0].objeto.decimales + ") NULL";
          if (elError[0].objeto.default && elError[0].objeto.default != "") {
            xcampodef += " DEFAULT " + elError[0].objeto.default.replace(",",".");
          } else {
            xcampodef += " DEFAULT NULL";
          }
        }
        if (elError[0].objeto.tipo == 'C') {
          xcampodef += "varchar(" + elError[0].objeto.ancho + ") NULL";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.default + "'";
          }
        }
        if (elError[0].objeto.tipo == 'A') {
          xcampodef += "text NULL";
        }
        if (elError[0].objeto.tipo == 'S') {
          xcampodef += "timestamp DEFAULT CURRENT_TIMESTAMP";
        }
        if (elError[0].objeto.tipo == 'D') {
          xcampodef += "date";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.default + "'";
          }
        }
        if (elError[0].objeto.tipo == 'T') {
          xcampodef += "datetime";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.default + "'";
          }
        }
        if (elError[0].objeto.tipo == 'H') {
          xcampodef += "time";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.default + "'";
          }
        }
        
        // Cadena para agregar el campo (ALTER TABLE `pruebas1` ADD COLUMN `nuevacol` VARCHAR(45) NULL DEFAULT 'XX';
        cadena = "ALTER TABLE `" + pTabla + "` ADD COLUMN `";

        switch (elError[0].objeto.nombre) {
          case "clave": {
            cadena += "clave` int(11) NOT NULL;";
            // Cadena para crear la PK
            cadena += "ALTER TABLE `" + pTabla + "` ADD PRIMARY KEY (`clave`);";
            // Cadena para el AUTOINCREMENTAL
            cadena += "ALTER TABLE `" + pTabla + "` MODIFY clave int(11) NOT NULL AUTO_INCREMENT;";
            break;
          }
          case "id": {
            cadena += "id` varchar(13) NULL DEFAULT NULL;"
            break;
          }       
          case "created_at": {
            cadena += "created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;";
            break;
          }  
          case "updated_at": {
            cadena += "updated_at` timestamp NULL DEFAULT NULL;";
            break;
          }
          case "deleted_at": {
            cadena += "deleted_at` timestamp NULL DEFAULT NULL;";
            break;
          }
          case "deleted": {
            cadena += "deleted` int(1) DEFAULT '0';";
            break;
          }
          default: {
            cadena += elError[0].objeto.nombre + "` " + xcampodef + ";"
          }
        }
        // EXECUTE 
        
        if(this.global.DEBUG)
          console.log(elError, cadena);

        this.dataaccess.execute(cadena,
        async (respuesta: any, datos: any) => {

        if (respuesta == 'OK') {
  
          if (this.global.DEBUG)
            console.log("Respuesta del EXECUTE en front:", datos[0]);
          
          // Marcar el error como resuelto
          elError[0].resuelto = true;
          
          this.showspinner.updateShowSpinner(false);
    
          const resp = this.global.mensaje("Campo Creado!", "Se ha creado el campo '" + elError[0].objeto.nombre + " en la tabla '" + pTabla + "'!", "I", "Aceptar", "");
          resp.afterClosed().subscribe(async (dlgResp: any) => { 

            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

          });

        } else {
          this.showspinner.updateShowSpinner(false);
        }
  
      })

      } // Si

    })

  }

  // /////////////////// EL CAMPO ESTA EN LA DEFINICION Y NO EN LA TABLA -> ELIMINARLO /////////////////////////////////
  del2definicion(errid: string) {
    
    let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)

    const resp = this.global.mensaje("Atención!", "Quieres ELIMINAR la definición del campo '" + elError[0].objeto.nombre + "'?", "W", "Si, elimínalo", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        // Eliminar el campo a la definición

        this.showspinner.updateShowSpinner(true);

        this.objetoCompleto.oTabla.oCampos = this.objetoCompleto.oTabla.oCampos.filter((c: { id: any; }) => c.id != elError[0].objeto.id)
        this.registroCompleto.objeto = JSON.stringify(this.objetoCompleto);

        if (this.global.DEBUG)
          console.log(this.objetoCompleto, this.registroCompleto);

        await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
        async (respuesta: any, datos: any) => {
      
          if (respuesta == 'OK') {
      
            if (this.global.DEBUG)
              console.log(respuesta);
            
            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

            this.showspinner.updateShowSpinner(false);

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })
        
      }

    })

  }
  // /////////////////// MODIFICAR EL CAMPO EN LA TABLA ////////////////////////////////////////////////////////////////
  change2table(errid: string) {

    let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)
    let pTabla = this.crud1Form.controls['tabla'].value;

    const resp = this.global.mensaje("Atención!", "Quieres modificar el campo '" + elError[0].objeto.campo.nombre + "'?", "W", "Si, modifícalo", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        this.showspinner.updateShowSpinner(true);

        let cadena: string = "";
        let xcampodef = "";

        if (elError[0].objeto.defCampo.tipo == 'K') {
          xcampodef += "int(" + elError[0].objeto.defCampo.ancho + ") NULL";
          if (elError[0].objeto.defCampo.default == "1") {
            xcampodef += " DEFAULT '1'";
          } else {
            xcampodef += " DEFAULT '0'";
          }
        }
        if (elError[0].objeto.defCampo.tipo == 'N' || elError[0].objeto.defCampo.tipo == 'M') {
          xcampodef += "decimal(" + elError[0].objeto.defCampo.ancho + "," + elError[0].objeto.defCampo.decimales + ") NULL";
          if (elError[0].objeto.defCampo.default && elError[0].objeto.defCampo.default != "") {
            xcampodef += " DEFAULT " + elError[0].objeto.defCampo.default.replace(",",".");
          } else {
            xcampodef += " DEFAULT NULL";
          }
        }
        if (elError[0].objeto.defCampo.tipo == 'C') {
          xcampodef += "varchar(" + elError[0].objeto.defCampo.ancho + ") NULL";
          if (elError[0].objeto.defCampo.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.defCampo.default + "'";
          }
        }
        if (elError[0].objeto.defCampo.tipo == 'A') {
          xcampodef += "text NULL";
        }
        if (elError[0].objeto.defCampo.tipo == 'S') {
          xcampodef += "timestamp DEFAULT CURRENT_TIMESTAMP";
        }
        if (elError[0].objeto.defCampo.tipo == 'D') {
          xcampodef += "date";
          if (elError[0].objeto.defCampo.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.defCampo.default + "'";
          }
        }
        if (elError[0].objeto.defCampo.tipo == 'T') {
          xcampodef += "datetime";
          if (elError[0].objeto.defCampo.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.defCampo.default + "'";
          }
        }
        if (elError[0].objeto.defCampo.tipo == 'H') {
          xcampodef += "time";
          if (elError[0].objeto.defCampo.default != "") {
            xcampodef += " DEFAULT '" + elError[0].objeto.defCampo.default + "'";
          }
        }
        
        // // Cadena para agregar el campo (ALTER TABLE `pruebas1` ADD COLUMN `nuevacol` VARCHAR(45) NULL DEFAULT 'XX';
        // cadena = "ALTER TABLE `" + pTabla + "` ADD COLUMN `";

        // Cadena para corregir el campo (ALTER TABLE `pruebas` CHANGE `xxx` `xxxd` INT(10) NOT NULL;)
        cadena = "ALTER TABLE `" + pTabla + "` CHANGE `" + elError[0].objeto.campo.nombre + "` `"; // + elError[0].objeto.campo.nombre + "` " + xcampodef + ";"

        switch (elError[0].objeto.campo.nombre) {
          case "clave": {
            cadena += "clave` int(11) NOT NULL;";
            // Cadena para crear la PK
            cadena += "ALTER TABLE `" + pTabla + "` ADD PRIMARY KEY (`clave`);";
            // Cadena para el AUTOINCREMENTAL
            cadena += "ALTER TABLE `" + pTabla + "` MODIFY clave int(11) NOT NULL AUTO_INCREMENT;";
            break;
          }
          case "id": {
            cadena += "id` varchar(13) NULL DEFAULT NULL;"
            break;
          }       
          case "created_at": {
            cadena += "created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;";
            break;
          }  
          case "updated_at": {
            cadena += "updated_at` timestamp NULL DEFAULT NULL;";
            break;
          }
          case "deleted_at": {
            cadena += "deleted_at` timestamp NULL DEFAULT NULL;";
            break;
          }
          case "deleted": {
            cadena += "deleted` int(1) DEFAULT '0';";
            break;
          }
          default: {
            cadena += elError[0].objeto.campo.nombre + "` " + xcampodef + ";"
          }
        }
        // EXECUTE 
        
        if(this.global.DEBUG)
          console.log(elError, cadena);

        this.dataaccess.execute(cadena,
        async (respuesta: any, datos: any) => {

        if (respuesta == 'OK') {
  
          if (this.global.DEBUG)
            console.log("Respuesta del EXECUTE en front:", datos[0]);
          
          // Marcar el error como resuelto
          elError[0].resuelto = true;
          
          this.showspinner.updateShowSpinner(false);
    
          const resp = this.global.mensaje("Campo modificado!", "Se ha modificado el campo '" + elError[0].objeto.campo.nombre + " en la tabla '" + pTabla + "'!", "I", "Aceptar", "");
          resp.afterClosed().subscribe(async (dlgResp: any) => { 

            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

          });

        } else {
          this.showspinner.updateShowSpinner(false);
        }
  
          })
        
      } // Fin de Si
    })

  }
  // /////////////////// MODIFICAR LA DEFINION DEL CAMPO SEGUN LA TABLA ////////////////////////////////////////////////
  change2definicion(errid: string) {

    let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)

    const resp = this.global.mensaje("Atención!", "Quieres corregir la definición del campo '" + elError[0].objeto.campo.nombre + "'?", "W", "Si, corrígela", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        // Actualizar del campo a la definición

        this.showspinner.updateShowSpinner(true);

        let elError = this.pErrores.filter((e: { id: any; }) => e.id == errid)
        let xtipo = "";
        let xancho = 0;

        if (elError[0].objeto.campo.tipo == "int") {
          xtipo = "K";
          xancho = elError[0].objeto.campo.nancho;
        } else if (elError[0].objeto.campo.tipo == "decimal") {
            xtipo = "N";
            xancho = elError[0].objeto.campo.nancho;          
        } else if (elError[0].objeto.campo.tipo == "varchar") {
          xtipo = "C";
          xancho = elError[0].objeto.campo.cancho;
        } else if (elError[0].objeto.campo.tipo == "datetime") {
          xtipo = "T";
          xancho = elError[0].objeto.campo.cancho;
        } else if (elError[0].objeto.campo.tipo == "date") {
          xtipo = "D";
          xancho = elError[0].objeto.campo.cancho;
        } else if (elError[0].objeto.campo.tipo == "timestamp") {
          xtipo = "S";
          xancho = elError[0].objeto.campo.cancho;
        } else if (elError[0].objeto.campo.tipo == "time") {
          xtipo = "H";
          xancho = elError[0].objeto.campo.cancho;
        } else if (elError[0].objeto.campo.tipo == "text") {
          xtipo = "A";
          xancho = elError[0].objeto.campo.cancho;
        }

        let elId = elError[0].objeto.defCampo.id;

        this.objetoCompleto.oTabla.oCampos.forEach((xcampo: { id: any; tipo: string; ancho: number; decimales: any; default: any; }) => {

          if (xcampo.id == elId) {
            xcampo.tipo = xtipo;
            xcampo.ancho = xancho;
            xcampo.decimales = elError[0].objeto.campo.decimales,
              xcampo.default = elError[0].objeto.campo.valdefault
          }

        })

        this.registroCompleto.objeto = JSON.stringify(this.objetoCompleto);

        if (this.global.DEBUG)
          console.log(this.objetoCompleto, this.registroCompleto);

        await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
        async (respuesta: any, datos: any) => {
      
          if (respuesta == 'OK') {
      
            if (this.global.DEBUG)
              console.log(respuesta);
            
            // Actualizar la lista de campos
            this.recuperarContenido();
            this.goCompararEstructura();

            this.showspinner.updateShowSpinner(false);

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })        

      } // Fin de Si
    })

  }

  // ////////////////// COMPROBAR SI LA CONSULTA SQL ES VALIDA ////////////////////////////////////////////////////////
  goComprobarQuery() {

    const resp = this.global.mensaje("Pregunta!", "Quieres comprobar si la cadena SQL es válida?", "Q", "Si", "No");
    resp.afterClosed().subscribe(async (dlgResp: boolean) => {
      if (dlgResp == true) {
      
        this.showspinner.updateShowSpinner(true);

        let pCadena = this.crud1Form.controls['cadenaSQL'].value;
        let pFiltros = this.objetoCompleto.oQuery.oFiltros;

        await this.sistema.comprobarSQL(pCadena, pFiltros,
          async (respuesta: any, datos: any) => {
          
            if (respuesta == 'OK') {
      
              if (this.global.DEBUG)
                console.log("Respuesta:", respuesta, datos);
  
              this.showspinner.updateShowSpinner(false);

              let tipoMje = "O";
              if (datos.success != 1) {
                tipoMje = "E";
              }
              const resp = this.global.mensaje("Respuesta!", datos.message, tipoMje, "Aceptar", "");
              resp.afterClosed().subscribe(async (dlgResp: boolean) => { })
 
            } else {
              // Quitar el spinner y quedar en crud1
              this.showspinner.updateShowSpinner(false);
            }
      
          })
        
      } // Fin del SI

    })

  }

  // ////////////////// COMPLETAR EL CAMPO IDQUERY SEGUN LA LISTA SELECCIONABLE //////////////////////////////////////
  poneIdQuery(pCampo: string, evento: any) {

    let valor = evento.value;

    switch (pCampo) {
      case 'nQuery': {
        let lq = this.lEntDatos.filter(q => q.nombre == valor);
        this.laQ.id = lq[0].id;
        this.laQ.nombre = lq[0].nombre;

        this.crud1Form.controls["idQuery"].patchValue(this.laQ.id);
        this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);

        break;
      }
      case 'npantallaAdd': {
        let lq = this.lPantallas.filter(q => q.nombre == valor);
        this.laQ.id = lq[0].id;
        this.laQ.nombre = lq[0].nombre;

        this.crud1Form.controls["pantallaAdd"].patchValue(this.laQ.id);
        this.crud1Form.controls[pCampo].patchValue(this.laQ.nombre);
         
        break;
      }
      case 'npantallaEdit': {
        let lq = this.lPantallas.filter(q => q.nombre == valor);
        this.laQ.id = lq[0].id;
        this.laQ.nombre = lq[0].nombre;

        this.crud1Form.controls["pantallaEdit"].patchValue(this.laQ.id);
        this.crud1Form.controls[pCampo].patchValue(this.laQ.nombre);
         
        break;
      }
      case 'npantallaList': {
        let lq = this.lPantallas.filter(q => q.nombre == valor);
        this.laQ.id = lq[0].id;
        this.laQ.nombre = lq[0].nombre;

        this.crud1Form.controls["pantallaList"].patchValue(this.laQ.id);
        this.crud1Form.controls[pCampo].patchValue(this.laQ.nombre);
          
        break;
      }
      case 'nTabla': {
        let lq = this.lEntDatos.filter(q => q.nombre == valor);
        this.laQ.id = lq[0].id;
        this.laQ.nombre = lq[0].nombre;

        this.crud1Form.controls["tabla"].patchValue(this.laQ.id);
        this.crud1Form.controls[pCampo].patchValue(this.laQ.nombre);
          
        break;
      }
      case 'norientacion': {
        let lo = this.lOrientaciones.filter(o => o.nombre == valor);
        this.crud1Form.controls["orientacion"].patchValue(lo[0].id);
        this.crud1Form.controls[pCampo].patchValue(lo[0].nombre);
          
        break;
      }
    }


  }

  // ////////////////// RECUPERAR LA LISTA DE TODAS LAS PANTALLAS ////////////////////////////////////////////////////
  async ListaDePantallas() {

    // PONER SPINNER
    this.showspinner.updateShowSpinner(true);

    await this.dataaccess.read("sys_screens", "", "1=1", ["id", "titulo as descripcion"],
    async (respuesta: any, datos: any) => {
  
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Pantallas recuperadas:", datos);
      
        datos.forEach((q: { id: string; descripcion: string; }) => {
          this.lPantallas.push({
            id: q.id,
            nombre: q.descripcion
          })
        
        });
        if (!this.nuevo) {

          if (this.tipo == "G") {

            let lq: any[] = [];
            lq = this.lPantallas.filter(q => q.id == this.objetoCompleto.oTablaGestiones.PantallaAdd);
            this.laP.id = lq[0].id;
            this.laP.nombre = lq[0].nombre;
            this.crud1Form.controls["npantallaAdd"].patchValue(this.laP.nombre);

            lq = this.lPantallas.filter(q => q.id == this.objetoCompleto.oTablaGestiones.PantallaEdit);
            this.laP.id = lq[0].id;
            this.laP.nombre = lq[0].nombre;
            this.crud1Form.controls["npantallaEdit"].patchValue(this.laP.nombre);

            lq = this.lPantallas.filter(q => q.id == this.objetoCompleto.oTablaGestiones.PantallaList);
            this.laP.id = lq[0].id;
            this.laP.nombre = lq[0].nombre;
            this.crud1Form.controls["npantallaList"].patchValue(this.laP.nombre);

          }

        }
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);

      } else {
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);
      }
    
    })
      

  }

  // ////////////////// RECUPERAR LA LISTA DE LAS TABLAS DEFINIDAS ///////////////////////////////////////////////////
  async ListaDeEntidadesDatos(pTipo: string) {

    // PONER SPINNER
    this.showspinner.updateShowSpinner(true);

    await this.dataaccess.read("sys_modelo_datos", "", "tipo = '" + pTipo + "'", ["id", "descripcion"],
    async (respuesta: any, datos: any) => {
  
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log(pTipo + " recuperadas:", datos);
      
        if (pTipo == "L") {
          this.lListasVal.push({
            id: '',
            nombre: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lListasVal.push({
              id: q.id,
              nombre: q.descripcion
            })
          });          
        } else if (pTipo == "I") {
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lSelectables.push({
              id: '',
              nombre: ''
            })
            this.lSelectables.push({
              id: q.id,
              nombre: q.descripcion
            })
          });          
        } else {
          this.lEntDatos.push({
            id: '',
            nombre: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lEntDatos.push({
              id: q.id,
              nombre: q.descripcion
            })
          });
        }

        if (!this.nuevo) {
          if (this.tipo == "I") {
            let lq = this.lEntDatos.filter(q => q.id == this.objetoCompleto.oSelectable.idQuery);
            if (lq.length > 0) {
              this.laQ.id = lq[0].id;
              this.laQ.nombre = lq[0].nombre;
              this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);
            } else {
              this.laQ.id = "";
              this.laQ.nombre = "";
              this.crud1Form.controls["nQuery"].patchValue("");
            }

          }
          if (this.tipo == "G") {
            let lq = this.lEntDatos.filter(q => q.id == this.objetoCompleto.oTablaGestiones.idQuery);
            if (lq.length > 0) {
              this.laQ.id = lq[0].id;
              this.laQ.nombre = lq[0].nombre;
              this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);
            } else {
              this.laQ.id = "";
              this.laQ.nombre = "";
              this.crud1Form.controls["nQuery"].patchValue("");
            }
          }
          if (this.tipo == "C") {
            let lq = this.lEntDatos.filter(q => q.id == this.objetoCompleto.oCRUD01.tabla);
            if (lq.length > 0) {
              this.laQ.id = lq[0].id;
              this.laQ.nombre = lq[0].nombre;
              this.crud1Form.controls["nTabla"].patchValue(this.laQ.nombre);
            } else {
              this.laQ.id = "";
              this.laQ.nombre = "";
              this.crud1Form.controls["nTabla"].patchValue("");
            }
          }
          if (this.tipo == "R") {
            let lq = this.lEntDatos.filter(q => q.id == this.objetoCompleto.oListado.idQuery);
            if (lq.length > 0) {
              this.laQ.id = lq[0].id;
              this.laQ.nombre = lq[0].nombre;
              this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);
            } else {
              this.laQ.id = "";
              this.laQ.nombre = "";
              this.crud1Form.controls["nQuery"].patchValue("");
            }
            if (!this.objetoCompleto.oListado.orientacion) {
              this.objetoCompleto.oListado.orientacion = "V"
            }
            let lo = this.lOrientaciones.filter(o => o.id == this.objetoCompleto.oListado.orientacion);

            this.crud1Form.controls["norientacion"].patchValue(lo[0].nombre);
          }
        }
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);

      } else {
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);
      }
    
    })
    
  }

} // Fin del Export general

