import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { NavigationService } from 'src/app/servicios/navigation.service';
import { Funciones, GlobalService, sistemStatusService, spinnerstatus } from 'src/app/servicios/global.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  extraTitulo: string = "";
  nuevo: boolean = true;
  hayDatos: boolean = false;
  showDiferencias: boolean = false;

  label_agregar: string = '';

  tabla: string = '';
  campos: any[] = [];
  colTitulos: any[] = [];
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


  tablasBBDD: any[] = [];
  opc_tablasBBDD: any[] = [];

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
    private funciones: Funciones,
    private router: Router, 
    private showspinner: spinnerstatus,
    private statusmensaje: sistemStatusService,
    private navigation: NavigationService,
    private dataaccess: DataAccessService,
    private fb: FormBuilder,

  ) {}

  ngOnInit(): void { 

    if(!this.id) {
      this.nuevo = true;
      this.id = "(nuevo registro)";
      this.extraTitulo = "(nuevo registro)";
    } else {
      this.nuevo = false;
    }
  
    this.crud1Form = new FormGroup({});

    setTimeout(() => {

      // PONER SPINNER
      this.showspinner.updateShowSpinner(true);

      // Cargar definición de la pantalla y el registro a editar
      if (!this.nuevo) {
        this.cargarRegistro();
      } else {
        this.recuperarDatosCrud1();
      } 
      this.showspinner.updateShowSpinner(false);
    })

  }
  
  async cargarRegistro() {

    await this.recuperarDatosCrud1();

    let tmpCampos = ["id", "tipo", "descripcion", "entorno", "objeto"];

    await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpCampos,
    async (respuesta: any, datos: any) => {
    
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Registro recuperado:", datos[0]);

        this.registroCompleto = datos[0];
        this.objetoCompleto = JSON.parse(this.registroCompleto.objeto.replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));

        switch (this.tipo) {
          case 'L': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            break;
          }
          case 'T': {
            this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
            this.crud1Form.controls["tabla"].patchValue(this.objetoCompleto.oTabla.nombre);
            break;
            }
        }

        this.pErrores = [];
        this.showDiferencias = false;

        this.recuperarContenido();
        this.extraTitulo = "Código: " + this.id;

        this.showspinner.updateShowSpinner(false);

      } else {
        this.showspinner.updateShowSpinner(false);
      }

    })

  }

  async recuperarDatosCrud1() {

    if(this.global.DEBUG)
      console.log("Definición datos CRUD1", this.id);

    this.tabla = "sys_modelo_datos";
    this.agregar = true;
    this.editar = true;
    this.borrar = true;

    this.crud1Form = this.fb.group({});

    switch (this.tipo) {

      case 'L': {

        this.tools = false;
        this.label_agregar = "Agregar valor";
        
        // Los campos del formulario principal del registro
        this.campos = [
          {
            id: this.funciones.generarUUID(""),
            campo: "id",
            requerido: true,
            etiqueta: "ID",
            valordefault: "",
            ancho: 13,
            formato: "C",
            disable: true,
            visible: false
          },
          {
            id: this.funciones.generarUUID(""),
            campo: "descripcion",
            requerido: true,
            etiqueta: "Descripción",
            valordefault: "",
            ancho: 100,
            formato: "C",
            disable: false,
            visible: true
          },
          {
            id: this.funciones.generarUUID(""),
            campo: "objeto",
            requerido: true,
            etiqueta: "objeto",
            valordefault: "",
            ancho: 2000,
            formato: "C",
            disable: false,
            visible: false
          }
        ];   
        // Las columnas de la tabla de valores
        this.colTitulos = [
          {
            literal: "ID",
            ordenar: false,
            orden: false,
            campo: "id"
          },
          {
            literal: "Código",
            ordenar: false,
            orden: "none",
            campo: "codigo"
          },
          {
            literal: "Texto",
            ordenar: false,
            orden: "none",
            campo: "descripcion"
          },
          {
            literal: "Orden",
            ordenar: false,
            orden: "up",
            campo: "orden"
          }
        ];

        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));

        break;
      }
      case 'T': {

        this.recuperaTablas();

        this.tools = true;
        this.label_agregar = "Agregar campo";

        // Los campos del formulario principal del registro
        this.campos = [
          {
            id: this.funciones.generarUUID(""),
            campo: "id",
            requerido: true,
            etiqueta: "ID",
            valordefault: "",
            ancho: 13,
            formato: "C",
            disable: true,
            visible: false
          },
          {
            id: this.funciones.generarUUID(""),
            campo: "descripcion",
            requerido: true,
            etiqueta: "Descripción",
            valordefault: "",
            ancho: 100,
            formato: "C",
            disable: false,
            visible: true
          },
          {
            id: this.funciones.generarUUID(""),
            campo: "tabla",
            requerido: true,
            etiqueta: "Nombre de la tabla en BBDD",
            valordefault: "",
            ancho: 100,
            formato: "C",
            disable: false,
            visible: true
          },
          {
            id: this.funciones.generarUUID(""),
            campo: "objeto",
            requerido: true,
            etiqueta: "objeto",
            valordefault: "",
            ancho: 2000,
            formato: "C",
            disable: false,
            visible: false
          }
        ];   

        // Las columnas de la tabla de valores
        this.colTitulos = [
          {
            literal: "ID",
            ordenar: false,
            orden: false,
            campo: "id"
          },
          {
            literal: "Etiqueta",
            ordenar: false,
            orden: "up",
            campo: "etiqueta"
          },
          {
            literal: "Nombre del campo",
            ordenar: false,
            orden: "none",
            campo: "nombre"
          },
          {
            literal: "Tipo",
            ordenar: false,
            orden: "none",
            campo: "ntipo"
          },
          {
            literal: "Ancho",
            ordenar: false,
            orden: "none",
            campo: "ancho"
          },
          {
            literal: "Decimales",
            ordenar: false,
            orden: "none",
            campo: "decimales"
          },
          {
            literal: "Valor inicial",
            ordenar: false,
            orden: "none",
            campo: "default"
          }
        ];
        // Tipos de campos
        this.tiposCampo = this.funciones.tiposCampo;
        
        /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
        this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));
        this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));
        this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.required, Validators.maxLength(100)]));
        
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
            objQuery = {
              cadenaSQL: '',
              oFiltros: []
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
      
    })
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
  recuperarContenido() {

    this.registros = [];

    switch (this.tipo) {

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

    if(pIdvalor && pIdvalor != '' && pIdvalor != null) {
      // Editar un valor existente
      this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id + '/' + pIdvalor );
    } else {

      if (this.nuevo) {
        // Grabar el nuevo registro antes de crear los valores
        let resp = this.global.mensaje("Pregunta...", "Antes de agregar un valor debes guardar el registro. Quieres guardar los datos?", "Q", "Si", "No");
        resp.afterClosed().subscribe(async dlgResp => {
          if (dlgResp == true) {
          
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
                objQuery = {
                  cadenaSQL: '',
                  oFiltros: []
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
        
        })

      } else {
        // Como ya ha dado de alta algún valor no es nuevo
        pIdvalor = this.rutaCrud2;
        this.router.navigateByUrl('/in' + this.rutaCrud2 + '/' + this.id);
      }
    }

  }
   async recuperaTablas() {

    this.showspinner.updateShowSpinner(true);

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
  onKey(evento: any) { 
    let valor = evento.target.value;
    this.opc_tablasBBDD = this.search(valor);
  }
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.tablasBBDD.filter(opcion => opcion.table_name.toLowerCase().startsWith(filter));
  }
  // Tool Comparar la definición de la tabla con la tabla existente en la BBDD
  async goCompararEstructura() {

    this.showspinner.updateShowSpinner(true);

    this.pErrores = [];
    this.showDiferencias = false;
    let pDescripcion = this.crud1Form.controls['descripcion'].value;
    let pTabla = this.crud1Form.controls['tabla'].value;

    // Verificar si la tabla existe
    let existe = this.tablasBBDD.filter(t => t.table_name == pTabla).length > 0;

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
          datos.forEach((campo: { nombre: any; }) => {

            let esta: boolean = false;

            if (this.objetoCompleto.oTabla.oCampos && this.objetoCompleto.oTabla.oCampos.length != 0) {
              this.objetoCompleto.oTabla.oCampos.forEach((defCampo: { nombre: any; }) => {
                if (defCampo.nombre == campo.nombre) {
                  esta = true;
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
              
              // El campo existe -> Comprobar la definición del campo
                // El campo tiene diferencias de definición -> Alter table
                //  -> modificar el campo según la definición
              // ó
                //  -> modificar la definición según el campo
              
              // El campo está igual definido que en la BBDD -> Nada

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
                objeto: campo
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
            
            if (esta) {

              // El campo existe -> Comprobar la definición del campo
          
              // El campo está igual definido que en la BBDD -> Nada
          
              // El campo tiene diferencias de definición -> Alter table
              //  -> modificar el campo según la definición
              //  -> modificar la definición según el campo
          
            } else {
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
                objeto: defCampo
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
              }
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
              }
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
              }
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
              }
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
              }
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
              }
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
        objeto: null
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
          objeto: null
        })
      }

    }
    // Quitar el spinner y quedar en crud1
    this.showspinner.updateShowSpinner(false);
    console.log("Errores detectados: ", this.pErrores);
    if (this.pErrores.length == 0) {
      this.statusmensaje.updateSistemStatus({ status: "INF", texto: "No hay diferencias entre la definición y la tabla de la base de datos" });
      this.showDiferencias = false;
    } else {
      this.showDiferencias = true;
    }

  }

  async goRecuperarDefinicion() {

    // Verificar si la tabla existe
    let pTabla = this.crud1Form.controls['tabla'].value;
    let existe = this.tablasBBDD.filter(t => t.table_name == pTabla).length > 0;

    if (!existe) {

      const resp = this.global.mensaje("Error!", "La tabla '" + pTabla + "' no existe en la BBDD!", "E", "Aceptar", "");
      resp.afterClosed().subscribe(async dlgResp => {});   

    } else {

      if (this.registros.length > 0) {
        const resp = this.global.mensaje("Atención!", "Si recuperas la definición desde la BBDD se eliminará la definición existente!", "E", "Continuar", "Cancelar");
        resp.afterClosed().subscribe(async dlgResp => {
          if (dlgResp == true) {
            this.leerDefinicionDesdeBBDD();
          }
        });
      } else {
        this.leerDefinicionDesdeBBDD();
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

        // Eliminar la definición existente


         //// COMO TODAVIA NO SE CREO EL objeto completo FALLA
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
        
        // Almacenar la dedinición creada
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

            this.showspinner.updateShowSpinner(false);

          } else {
            // Quitar el spinner y quedar en crud1
            this.showspinner.updateShowSpinner(false);
          }
    
        })        

      } else {
        // Quitar el spinner y quedar en crud1
        this.showspinner.updateShowSpinner(false);
      }
  
    }) 


  }

  async createtable(errid: string) {

    let accionManual = false;

    this.pErrores.forEach(e => {
      if (e.manual) {
        accionManual = true;
      }
    });

    if (accionManual) {
      
      const resp = this.global.mensaje("Bloqueo!", "Se requiere una acción manual antes de poder crear la tabla", "E", "Aceptar", "");
      resp.afterClosed().subscribe(async dlgResp => { });
      
    } else {

      let cadena: string = "";
      let pTabla = this.crud1Form.controls['tabla'].value;
      let pDescripcion = this.crud1Form.controls['descripcion'].value;
      
      let elError = this.pErrores.filter(e => e.id == errid)

      const resp = this.global.mensaje("Atención!", "Se va a crear la tabla '" + pTabla + "'!", "W", "Continuar", "Cancelar");
      resp.afterClosed().subscribe(async dlgResp => { 
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
              resp.afterClosed().subscribe(async dlgResp => {

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
    resp.afterClosed().subscribe(async dlgResp => {
      if (dlgResp == true) {
      
        // Añadir el campo a la definición

        this.showspinner.updateShowSpinner(true);

        let elError = this.pErrores.filter(e => e.id == errid)
        let xtipo = "";
        let xancho = 0;

        if (elError[0].objeto.tipo == "int" || elError[0].objeto.tipo == "decimal") {
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
    
    let elError = this.pErrores.filter(e => e.id == errid);
    let pTabla = this.crud1Form.controls['tabla'].value;
    
    const resp = this.global.mensaje("Atención!", "Quieres ELIMINAR el campo '" + elError[0].objeto.nombre + "' de la tabla '" + pTabla + "'? (Si contiene datos, estos se perderán)", "W", "Si, elimínalo", "No");
    resp.afterClosed().subscribe(async dlgResp => {
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
          resp.afterClosed().subscribe(async dlgResp => { 

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

    let elError = this.pErrores.filter(e => e.id == errid)
    let pTabla = this.crud1Form.controls['tabla'].value;

    const resp = this.global.mensaje("Atención!", "Quieres CREAR el campo '" + elError[0].objeto.nombre + "' en la tabla '" + pTabla + "'?", "W", "Si, créalo", "No");
    resp.afterClosed().subscribe(async dlgResp => {
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
        if (elError[0].objeto.tipo == 'N') {
          xcampodef += "decimal(" + elError[0].objeto.ancho + "," + elError[0].objeto.decimales + ") NULL";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT " + elError[0].objeto.default.replace(",",".");
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
            xcampodef += " DEFAULT " + elError[0].objeto.default;
          }
        }
        if (elError[0].objeto.tipo == 'T') {
          xcampodef += "datetime";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT " + elError[0].objeto.default;
          }
        }
        if (elError[0].objeto.tipo == 'H') {
          xcampodef += "time";
          if (elError[0].objeto.default != "") {
            xcampodef += " DEFAULT " + elError[0].objeto.default;
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
          resp.afterClosed().subscribe(async dlgResp => { 

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
    
    let elError = this.pErrores.filter(e => e.id == errid)

    const resp = this.global.mensaje("Atención!", "Quieres ELIMINAR la definición del campo '" + elError[0].objeto.nombre + "'?", "W", "Si, elimínalo", "No");
    resp.afterClosed().subscribe(async dlgResp => {
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


} // Fin del Export general

