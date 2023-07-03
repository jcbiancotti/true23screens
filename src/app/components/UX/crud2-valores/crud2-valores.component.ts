import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { Funciones, GlobalService, spinnerstatus } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-crud2-valores',
  templateUrl: './crud2-valores.component.html',
  styleUrls: ['./crud2-valores.component.css']
})
export class Crud2ValoresComponent implements OnInit {

  @Input() id: string = "";
  @Input() idvalor: string = "";
  @Input() tipo: string = "";
  @Input() tabla: string = "";
  @Input() crud2Campos: any;
  @Input() rutaRetorno: string = "";
  
  extraTitulo: string = "";
  crud2Form!: FormGroup;
  nuevo: boolean = true;

  campos: any[] = [];
  tiposCampo: any[] = [];
  lPantallas: any[] = [];
  lEntDatos: any[] = [];           // Entidades de datos definidas en sys_modelo_datos
  lListasVal: any[] = [];          // Entidades de datos definidas en sys_modelo_datos
  lSelectables: any[] = [];        // Entidades de datos definidas en sys_modelo_datos
  lQueries: any[] = [];            // Entidades de datos definidas en sys_modelo_datos
  opc_Lista: any[] = [];
  laQ: any = { id: "", nombre: "" };
  laP: any = { id: "", nombre: "" };

  error: string = "";
  registroCompleto: any;
  objetoCompleto: any;

  constructor(
    private global: GlobalService,
    private funciones: Funciones,
    private router: Router, 
    private showspinner: spinnerstatus,
    private dataaccess: DataAccessService,
    private fb: FormBuilder,

  ) { }

  async ngOnInit(): Promise<void> {

    if (!this.idvalor) {
      this.nuevo = true;
      this.idvalor = "(nuevo valor)";
      this.extraTitulo = "(nuevo valor)";
    } else {
      this.nuevo = false;
      this.extraTitulo = "Id principal: " + this.id + " / Id del valor: " + this.idvalor;
    }

    // Definición del formulario y los campos
    this.crud2Form = new FormGroup({});
    this.crud2Form = this.fb.group({});
    this.crud2Campos.forEach(async (campo: { campo: string; valordefault: any; ancho: number; requerido: any; formato: string; lista: any}) => {
      
      this.crud2Form.addControl(campo.campo, new FormControl(campo.valordefault, [Validators.maxLength(campo.ancho)]));
      
      if (campo.requerido) {
        this.crud2Form.controls[campo.campo].addValidators(Validators.required);
      }
      if (campo.formato == 'E') {
        this.crud2Form.controls[campo.campo].addValidators(Validators.email);
      }

      // Completar campos de descripcion
      if (this.tipo == "C") {
        if (campo.campo == "nformato") {
          campo.lista = this.tiposCampo;
        }
        if (campo.campo == "nlistaval") {
          campo.lista = this.lListasVal;
        }
        if (campo.campo == "nselectable") {
          campo.lista = this.lSelectables;
        }
        if (campo.campo == "nBSquery") {
          campo.lista = this.lQueries;
        }
      } 
      if (this.tipo == "T") {
        if (campo.campo == "nformato") {
          campo.lista = this.tiposCampo;
        }
      } 
      if (this.tipo == "Q") {
        if (campo.campo == "nformato") {
          campo.lista = this.tiposCampo;
        }
      } 
    })
    
    await this.recuperarRegistroValor();

  }

  async recuperarRegistroValor() {

    setTimeout(async () => {
      this.showspinner.updateShowSpinner(true);

      let tmpCampos: string[] = [];
      if (this.tabla == "sys_modelo_datos" ) {
        tmpCampos = ["id", "descripcion", "objeto"];
      }
      if (this.tabla == "sys_screens") {
        tmpCampos = ["id", "titulo as descripcion", "objeto"];
      }
      
      // Rellenar las listas
      this.tiposCampo = this.funciones.tiposCampo;
      await this.ListaDeEntidadesDatos("L");
      await this.ListaDeEntidadesDatos("I");
      await this.ListaDeEntidadesDatos("Q");

      this.crud2Campos.forEach((campo: { campo: string; lista: any[]; }) => {

        // Asignar las listas
        if (this.tipo == "C" || this.tipo == "T" || this.tipo == "Q") {
          if (campo.campo == "nformato") {
            campo.lista = this.tiposCampo;
          }
          if (campo.campo == "nlistaval") {
            campo.lista = this.lListasVal;
          }
          if (campo.campo == "nselectable") {
            campo.lista = this.lSelectables;
          }
          if (campo.campo == "nBSquery") {
            campo.lista = this.lQueries;
          }
        } 

      })
      
      await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpCampos,
        async (respuesta:any, datos: any) => {
      
          if(this.global.DEBUG)
            console.log("Registro recuperado:", datos[0]);

          // Guardo el registro completo para el SAVE
          this.registroCompleto = datos[0];
          this.objetoCompleto = JSON.parse(this.registroCompleto.objeto.replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));  

          if(this.global.DEBUG)
            console.log("this.objetoCompleto", this.objetoCompleto);

          if (!this.nuevo) {

            let aValor: any;

            switch (this.tipo) {
              case 'L': {
                aValor = this.objetoCompleto.oLista.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }
              case 'T': {
                aValor = this.objetoCompleto.oTabla.oCampos.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }
              case 'Q': {
                aValor = this.objetoCompleto.oQuery.oFiltros.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }      
              case 'G': {
                aValor = this.objetoCompleto.oTablaGestiones.Columnas.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }  
              case 'C': {
                aValor = this.objetoCompleto.oCRUD01.Campos.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }    
              case 'R': {
                aValor = this.objetoCompleto.oListado.Columnas.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }                   
            }
          
            this.crud2Campos.forEach((campo: { lista: any; campo: string | number; }) => {
              this.crud2Form.controls[campo.campo].patchValue(aValor[0][campo.campo]);
            })

            this.ponerValorEnListas();

          }

          this.showspinner.updateShowSpinner(false);

        })

    })

  }

  back() {
    // Volver hacia atras en el historial de navegación
    // comprobar si hay algún campo tocado
    let tocado = false;
    for (const field in this.crud2Form.controls) { 
      if (this.crud2Form.controls[field].touched) {
        tocado = true;
      }
    }
    if (tocado) {
      
      let resp = this.global.mensaje("Hay cambios!", "Descartas los cambios?", "Q", "Si", "No");
      resp.afterClosed().subscribe(async dlgResp => {
        if (dlgResp == true) {
          this.router.navigateByUrl(this.rutaRetorno + this.id);
        }
      })
      
    } else {
      this.router.navigateByUrl(this.rutaRetorno + this.id);
      // this.navigation.back()
    }      
    
  }

  save() {

    setTimeout(async () => {
      this.showspinner.updateShowSpinner(true);

      // Recomponer el campo Objeto para actualizarlo
      console.log(this.registroCompleto);

      let tmpObjeto = this.objetoCompleto;    //JSON.parse(this.registroCompleto.objeto);

      if (this.nuevo) {

        switch (this.tipo) {
          case 'L': {

            tmpObjeto.oLista.push({
              id: this.funciones.generarUUID(""),
              codigo: this.crud2Form.controls['codigo'].value,
              descripcion: this.crud2Form.controls['descripcion'].value,
              orden: this.crud2Form.controls['orden'].value
            })
            break;
          }
          case 'T': {

            let tmpCampos: any[] = [];
            if (tmpObjeto.oTabla.oCampos) {
              tmpCampos = tmpObjeto.oTabla.oCampos;
            }

            let xNombre = this.crud2Form.controls['nombre'].value.toLowerCase().replaceAll(" ", "_").replaceAll("-","_");
            let xRepetido = tmpCampos.filter(c => c.nombre == xNombre).length;
            if (xRepetido > 0) {
              xNombre += "_" + this.funciones.generarUUID("");
            }

            tmpCampos.push({
              id: this.funciones.generarUUID(""),
              nombre: xNombre,
              tipo: this.crud2Form.controls['tipo'].value,
              ancho: this.crud2Form.controls['ancho'].value,
              decimales: this.crud2Form.controls['decimales'].value,
              etiqueta: this.crud2Form.controls['etiqueta'].value,
              default: this.crud2Form.controls['default'].value,
            })
            tmpObjeto.oTabla.oCampos = tmpCampos;
            break;
          }
          case 'Q': {

            let tmpFiltros: any[] = [];
            if (tmpObjeto.oQuery.oFiltros) {
              tmpFiltros = tmpObjeto.oQuery.oFiltros;
            }

            tmpFiltros.push({
              id: this.funciones.generarUUID(""),
              etiqueta: this.crud2Form.controls['etiqueta'].value,
              tipo: this.crud2Form.controls['tipo'].value,
              campo: this.crud2Form.controls['campo'].value,
              obligatorio: this.crud2Form.controls['obligatorio'].value
            })
            tmpObjeto.oQuery.oFiltros = tmpFiltros;
            break;
          }

          case 'G': {

            let tmpColumnas: any[] = [];
            if (tmpObjeto.oTablaGestiones.Columnas) {
              tmpColumnas = tmpObjeto.oTablaGestiones.Columnas;
            }

            tmpColumnas.push({
              id: this.funciones.generarUUID(""),
              titulo: this.crud2Form.controls['titulo'].value,
              campo: this.crud2Form.controls['campo'].value,
              ordenar: this.crud2Form.controls['ordenar'].value,
            })
            tmpObjeto.oTablaGestiones.Columnas = tmpColumnas;
            break;
          }
          case 'C': {

            let tmpCampos: any[] = [];
            
            if(this.global.DEBUG)
              console.log("VALORES:", this.registroCompleto, this.objetoCompleto);

            if (this.objetoCompleto.oCRUD01.Campos) {
              tmpCampos = tmpObjeto.oCRUD01.Campos;
            }

            tmpCampos.push({
              id: this.funciones.generarUUID(""),
              etiqueta: this.crud2Form.controls['etiqueta'].value,
              campo: this.crud2Form.controls['campo'].value,
              orden: this.crud2Form.controls['orden'].value,
              formato: this.crud2Form.controls['formato'].value,
              valdefault: this.crud2Form.controls['valdefault'].value,
              enabledinicial: this.crud2Form.controls['enabledinicial'].value,
              requerido: this.crud2Form.controls['requerido'].value,
              ancho: this.crud2Form.controls['ancho'].value,
              decimales: this.crud2Form.controls['decimales'].value,
              listaval: this.crud2Form.controls['listaval'].value,
              selectable: this.crud2Form.controls['selectable'].value,
              seleBSquery: this.crud2Form.controls['BSquery'].value
            })
            tmpObjeto.oCRUD01.Campos = tmpCampos;
            break;
          }
          case 'R': {

            let tmpCampos: any[] = [];
            
            console.log("VALORES:", this.registroCompleto, this.objetoCompleto);

            if (this.objetoCompleto.oListado.Columnas) {
              tmpCampos = tmpObjeto.oListado.Columnas;
            }

            tmpCampos.push({
              id: this.funciones.generarUUID(""),
              titulo: this.crud2Form.controls['titulo'].value,
              campo: this.crud2Form.controls['campo'].value,
              ancho: this.crud2Form.controls['ancho'].value,
            })
            tmpObjeto.oListado.Columnas = tmpCampos;
            break;
          }
        }  // Fin del switch TIPO


      } else {

        switch (this.tipo) {
          case 'L': {

            tmpObjeto.oLista.forEach((dato: { id: string; codigo: any; descripcion: any; orden: any; }) => {
              
              if (dato.id == this.idvalor) {
                dato.codigo = this.crud2Form.controls['codigo'].value;
                dato.descripcion = this.crud2Form.controls['descripcion'].value;
                dato.orden = this.crud2Form.controls['orden'].value;
              }

            })
            break;
          }
          case 'T': {
          
            tmpObjeto.oTabla.oCampos.forEach((dato: { id: string; nombre: any; tipo: any; ancho: any; decimales: any; etiqueta: any; default: any; }) => {
              
              if (dato.id == this.idvalor) {
                
                let xNombre = this.crud2Form.controls['nombre'].value.toLowerCase().replaceAll(" ", "_").replaceAll("-","_");
                let xRepetido = tmpObjeto.oTabla.oCampos.filter((c: { nombre: any; id: string; }) => c.nombre == xNombre && c.id != this.idvalor).length;
                if (xRepetido > 0) {
                  xNombre += "_" + this.funciones.generarUUID("");
                }

                dato.nombre = xNombre;
                dato.tipo = this.crud2Form.controls['tipo'].value;
                dato.ancho = this.crud2Form.controls['ancho'].value;
                dato.decimales = this.crud2Form.controls['decimales'].value;
                dato.etiqueta = this.crud2Form.controls['etiqueta'].value;
                dato.default = this.crud2Form.controls['default'].value;
              }

            })
            break;
          }
          case 'Q': {
          
            tmpObjeto.oQuery.oFiltros.forEach((dato: { id: string; etiqueta: any; tipo: any; campo: any; obligatorio: boolean; }) => {
              
              if (dato.id == this.idvalor) {

                dato.etiqueta = this.crud2Form.controls['etiqueta'].value;
                dato.tipo = this.crud2Form.controls['tipo'].value;
                dato.campo = this.crud2Form.controls['campo'].value;
                dato.obligatorio = this.crud2Form.controls['obligatorio'].value;
                
              }

            })
            break;
          } 
          case 'G': {
          
            tmpObjeto.oTablaGestiones.Columnas.forEach((dato: { id: string; titulo: any; campo: any; ordenar: boolean; }) => {
              
              if (dato.id == this.idvalor) {

                dato.titulo = this.crud2Form.controls['titulo'].value;
                dato.campo = this.crud2Form.controls['campo'].value;
                dato.ordenar = this.crud2Form.controls['ordenar'].value;
                
              }

            })
            break;
          } 
          case 'C': {
          
            tmpObjeto.oCRUD01.Campos.forEach((dato: { id: string; etiqueta: any; campo: any; orden: any; formato: any; valdefault: any; enabledinicial: any; requerido: any; ancho: any; decimales: any; listaval: any; selectable: any; BSquery: any}) => {
              
              if (dato.id == this.idvalor) {
                dato.etiqueta = this.crud2Form.controls['etiqueta'].value;
                dato.campo = this.crud2Form.controls['campo'].value;
                dato.orden = this.crud2Form.controls['orden'].value;
                dato.formato = this.crud2Form.controls['formato'].value;
                dato.valdefault = this.crud2Form.controls['valdefault'].value;
                dato.enabledinicial = this.crud2Form.controls['enabledinicial'].value;
                dato.requerido = this.crud2Form.controls['requerido'].value;
                dato.ancho = this.crud2Form.controls['ancho'].value;
                dato.decimales = this.crud2Form.controls['decimales'].value;
                dato.listaval = this.crud2Form.controls['listaval'].value;
                dato.selectable = this.crud2Form.controls['selectable'].value;
                dato.BSquery = this.crud2Form.controls['BSquery'].value;
              }

            })
            break;
          }
          case 'R': {
          
            tmpObjeto.oListado.Columnas.forEach((dato: { id: string; titulo: any; campo: any; ancho: any; }) => {
              
              if (dato.id == this.idvalor) {
                dato.titulo = this.crud2Form.controls['titulo'].value;
                dato.campo = this.crud2Form.controls['campo'].value;
                dato.ancho = this.crud2Form.controls['ancho'].value;
              }

            })
            break;
          }
        }  // Fin del switch TIPO

      }

      this.registroCompleto.objeto = JSON.stringify(tmpObjeto);

      if(this.global.DEBUG)
        console.log(tmpObjeto, this.registroCompleto);

      await this.dataaccess.update(this.tabla, "", "id = '" + this.id + "'", ["objeto"], this.registroCompleto,
      async (respuesta: any, datos: any) => {
      
        if (respuesta == 'OK') {
      
          if (this.global.DEBUG)
            console.log(respuesta);

          this.crud2Form.markAsUntouched();
          this.back();
          
        } else {
          // Quitar el spinner y quedar en crud1
          this.showspinner.updateShowSpinner(false);
        }
    
      })

    })

  }

  // Recibir el valor del input de la LISTA DE VALORES
  onKey(evento: any) { 
    let valor = evento.target.value;
    this.tiposCampo = this.search(valor);
  }
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.tiposCampo.filter(opcion => opcion.texto.toLowerCase().startsWith(filter));
  }
  ajustarEnabled(pCampo: string, item: string) {

    // Solo cuando es el campo formato
    if (this.tipo == "T" || this.tipo == "C") {

      let x: any[] = [];
      x = this.tiposCampo.filter(t => t.texto == item);

      let ancho, decimales, valdefault, lisvalores, selectable, BSquery: boolean = false;
      let vvaldefault: string = "";
      let vancho: number = 0;

      switch (x[0].codigo) {
        case 'C':
        case 'E':
        case 'F': {
          ancho = true;
          decimales = false;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'N':
        case 'M': {
          ancho = true;
          decimales = true;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'K': {
          ancho = false;
          vancho = 10;
          decimales = false;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'D': {
          ancho = false;
          decimales = false;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'T': {
          ancho = false;
          decimales = false;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'H': {
          ancho = false;
          decimales = false;
          valdefault = true;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'A': {
          ancho = false;
          vancho = 65535;
          decimales = false;
          valdefault = false;
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'S': {
          ancho = false;
          decimales = false;
          valdefault = false;
          vvaldefault = "CURRENT_TIMESTAMP";
          lisvalores = false;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'L': {
          ancho = false;
          vancho = 100;
          decimales = false;
          valdefault = true;
          vvaldefault = "";
          lisvalores = true;
          selectable = false;
          BSquery = false;
          break;
        }
        case 'I': {
          ancho = false;
          vancho = 100;
          decimales = false;
          valdefault = true;
          vvaldefault = "";
          lisvalores = false;
          selectable = true;
          BSquery = false;
          break;
        }
        case 'P': {
          ancho = false;
          vancho = 4294967295;
          decimales = false;
          valdefault = true;
          vvaldefault = "";
          lisvalores = false;
          selectable = true;
          BSquery = false;
          break;
        }  
        case 'B': {
          ancho = false;
          vancho = 150;
          decimales = false;
          valdefault = true;
          vvaldefault = "";
          lisvalores = false;
          selectable = false;
          BSquery = true;
          break;
        }
      }

      if (this.tipo == "T") {
        // Ajustar ANCHO
        if (ancho) {
          this.crud2Form.controls["ancho"].enable();
        } else {
          this.crud2Form.controls["ancho"].disable();
          this.crud2Form.controls["ancho"].patchValue(0);
        }
        if (vancho != 0) {
          this.crud2Form.controls["ancho"].patchValue(vancho);
        }  // Si no lo deja igual
        
        // Ajustar DECIMALES
        if (decimales) {
          this.crud2Form.controls["decimales"].enable();
        } else {
          this.crud2Form.controls["decimales"].disable();
          this.crud2Form.controls["decimales"].patchValue(0);
        }

        // Ajustar DEFECTO
        if (valdefault) {
          this.crud2Form.controls["default"].enable();
          if (vvaldefault != "") {
            this.crud2Form.controls["default"].patchValue(vvaldefault);
          }  // Si no lo deja igual
        } else {
          this.crud2Form.controls["default"].disable();
          this.crud2Form.controls["default"].patchValue(vvaldefault);
        }


      }
      if (this.tipo == "C") {
        // Ajustar ANCHO
        if (ancho == true) {
          this.crud2Form.controls["ancho"].enable();
        } else {
          this.crud2Form.controls["ancho"].disable();
          this.crud2Form.controls["ancho"].patchValue(0);
        }
        if (vancho != 0) {
          this.crud2Form.controls["ancho"].patchValue(vancho);
        }  // Si no lo deja igual
        
        // Ajustar DECIMALES
        if (decimales == true) {
          this.crud2Form.controls["decimales"].enable();
        } else {
          this.crud2Form.controls["decimales"].disable();
          this.crud2Form.controls["decimales"].patchValue(0);
        }

        // Ajustar DEFECTO
        if (valdefault) {
          this.crud2Form.controls["valdefault"].enable();
          if (vvaldefault != "") {
            this.crud2Form.controls["valdefault"].patchValue(vvaldefault);
          }  // Si no lo deja igual
        } else {
          this.crud2Form.controls["valdefault"].disable();
          this.crud2Form.controls["valdefault"].patchValue(vvaldefault);
        }

        // Ajustar la lista de valores
        if (lisvalores == true) {
          this.crud2Form.controls["nlistaval"].enable();
        } else {
          this.crud2Form.controls["nlistaval"].patchValue("");
          this.crud2Form.controls["nlistaval"].disable();
        }

        // Ajustar la lista seleccionable
        if (selectable == true) {
          this.crud2Form.controls["nselectable"].enable();
        } else {
          this.crud2Form.controls["nselectable"].patchValue("");
          this.crud2Form.controls["nselectable"].disable();
        }

        // Ajustar la lista de BSquery
        if (BSquery == true) {
          this.crud2Form.controls["nBSquery"].enable();
        } else {
          this.crud2Form.controls["nBSquery"].patchValue("");
          this.crud2Form.controls["nBSquery"].disable();
        }
      }

    }

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
            codigo: '',
            texto: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lListasVal.push({
              codigo: q.id,
              texto: q.descripcion
            })
          });          
        } else if (pTipo == "I") {
          this.lSelectables.push({
            codigo: '',
            texto: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lSelectables.push({
              codigo: q.id,
              texto: q.descripcion
            })
          });          
        } else if (pTipo == "Q") {
          this.lQueries.push({
            codigo: '',
            texto: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lQueries.push({
              codigo: q.id,
              texto: q.descripcion
            })
          });          
        } else {
          this.lEntDatos.push({
            codigo: '',
            texto: ''
          })
          datos.forEach((q: { id: string; descripcion: string; }) => {
            this.lEntDatos.push({
              codigo: q.id,
              texto: q.descripcion
            })
          });
        }

        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);

      } else {
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);
      }
    
    })
    
  }
  
  // ////////////////// PONER LOS VALORES DEL REGISTRO EN LAS LISTAS DESPLEGABLES ///////////////////////////////////
  ponerValorEnListas() {

    if (this.tipo == "C") {   // CRUD01

      this.objetoCompleto.oCRUD01.Campos.forEach((c: { id: string; formato: any; listaval: any; selectable: any; BSquery: any }) => {

        if (c.id == this.idvalor) {

          let tmp: any;
          // Tipo de campo según el Formato
          tmp = this.tiposCampo.filter(valor => valor.codigo == c.formato);
          if (tmp.length > 0) {
            this.crud2Form.controls["nformato"].patchValue(tmp[0].texto);

            this.ajustarEnabled("nformato", tmp[0].texto);

          } else {
            this.crud2Form.controls["nformato"].patchValue("");
          }
          // Lista de valores
          tmp = this.lListasVal.filter(valor => valor.codigo == c.listaval);
          if (tmp.length > 0) {
            this.crud2Form.controls["nlistaval"].patchValue(tmp[0].texto);
          } else {
            this.crud2Form.controls["nlistaval"].patchValue("");
          }
          // Lista selectables
          tmp = this.lSelectables.filter(valor => valor.codigo == c.selectable);
          if (tmp.length > 0) {
            this.crud2Form.controls["nselectable"].patchValue(tmp[0].texto);
          } else {
            this.crud2Form.controls["nselectable"].patchValue("");
          }
          // Lista de Queries
          tmp = this.lQueries.filter(valor => valor.codigo == c.BSquery);
          if (tmp.length > 0) {
            this.crud2Form.controls["nBSquery"].patchValue(tmp[0].texto);
          } else {
            this.crud2Form.controls["nBSquery"].patchValue("");
          }
        }

      })

    }
    if (this.tipo == "T") {   // TABLA

      console.log("OBJETO COMPLETO", this.objetoCompleto);

      this.objetoCompleto.oTabla.oCampos.forEach((c: { id: string; tipo: any; }) => {

        if (c.id == this.idvalor) {

          let tmp: any;
          // Tipo de campo según el Formato
          tmp = this.tiposCampo.filter(valor => valor.codigo == c.tipo);
          if (tmp.length > 0) {

            this.crud2Form.controls["nformato"].patchValue(tmp[0].texto);

            this.ajustarEnabled("nformato", tmp[0].texto);

          } else {
            this.crud2Form.controls["nformato"].patchValue("");
          }

        }

      })

    }
    if (this.tipo == "Q") {   // QUERY

      console.log("OBJETO COMPLETO", this.objetoCompleto);

      this.objetoCompleto.oQuery.oFiltros.forEach((c: { id: string; tipo: any; }) => {

        if (c.id == this.idvalor) {

          let tmp: any;
          // Tipo de campo según el Formato
          tmp = this.tiposCampo.filter(valor => valor.codigo == c.tipo);
          if (tmp.length > 0) {

            this.crud2Form.controls["nformato"].patchValue(tmp[0].texto);

            this.ajustarEnabled("nformato", tmp[0].texto);

          } else {
            this.crud2Form.controls["nformato"].patchValue("");
          }

        }

      })

    }
  }

  // ////////////////// COMPLETAR EL CAMPO IDQUERY SEGUN LA LISTA SELECCIONABLE //////////////////////////////////////
  ponerIds(pCampo: string, evento: any) {

    let valor = evento.value;
    let lq: any[] = [];

    if (this.tipo == "C") {
      switch (pCampo) {
        case 'nformato': {
          lq = this.tiposCampo.filter(q => q.texto == valor);
          this.crud2Form.controls["formato"].patchValue(lq[0].codigo);
          this.ajustarEnabled(pCampo, valor);
          break;
        }
        case 'nlistaval': {
          lq = this.lListasVal.filter(q => q.texto == valor);
          this.crud2Form.controls["listaval"].patchValue(lq[0].codigo);
          break;
        }
        case 'nselectable': {
          lq = this.lSelectables.filter(q => q.texto == valor);
          this.crud2Form.controls["selectable"].patchValue(lq[0].codigo);
          break;
        }
        case 'nBSquery': {
          lq = this.lQueries.filter(q => q.texto == valor);
          this.crud2Form.controls["BSquery"].patchValue(lq[0].codigo);
          break;
        } 
      }
    }
    if (this.tipo == "T") {
      if (pCampo == 'nformato') {
        lq = this.tiposCampo.filter(q => q.texto == valor);
        this.crud2Form.controls["tipo"].patchValue(lq[0].codigo);
        this.ajustarEnabled(pCampo, valor);
      }
    }
    if (this.tipo == "Q") {
      if (pCampo == 'nformato') {
        lq = this.tiposCampo.filter(q => q.texto == valor);
        this.crud2Form.controls["tipo"].patchValue(lq[0].codigo);
      }
    }
  }
  
}
