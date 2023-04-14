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
  error: string = "";
  registroCompleto: any;

  constructor(
    private global: GlobalService,
    private funciones: Funciones,
    private router: Router, 
    private showspinner: spinnerstatus,
    private dataaccess: DataAccessService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    this.tiposCampo = this.funciones.tiposCampo;

    if(!this.idvalor) {
      this.nuevo = true;
      this.idvalor = "(nuevo valor)";
      this.extraTitulo = "(nuevo valor)";
    } else {
      this.nuevo = false;
      this.extraTitulo = "Id principal: " + this.id + " / Id del valor: " + this.idvalor;
    }
  
    this.recuperaRegistroValor();

    // Definición del formulario y los campos
    this.crud2Form = new FormGroup({});    

    this.crud2Form = this.fb.group({});
    this.crud2Campos.forEach((campo: { campo: string; valordefault: any; ancho: number; requerido: any; formato: string; }) => {
      this.crud2Form.addControl(campo.campo, new FormControl(campo.valordefault, [Validators.maxLength(campo.ancho)]));
      if(campo.requerido) {
        this.crud2Form.controls[campo.campo].addValidators(Validators.required);
      }      
      if(campo.formato == 'E') {
        this.crud2Form.controls[campo.campo].addValidators(Validators.email);
      }
    })

  }

  async recuperaRegistroValor() {

    setTimeout(async () => {
      this.showspinner.updateShowSpinner(true);

      let tmpCampos: string[] = ["id", "descripcion", "objeto"];
      
      await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpCampos,
        async (respuesta:any, datos: any) => {
      
          if(this.global.DEBUG)
            console.log("Registro recuperado:", datos[0]);

          // Guardo el registro completo para el SAVE
          this.registroCompleto = datos[0];

          if (!this.nuevo) {

            let tmpObjeto = JSON.parse(this.registroCompleto.objeto.replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));  //JSON.parse(datos[0].objeto);
            let aValor: any;

            switch (this.tipo) {
              case 'L': {
                aValor = tmpObjeto.oLista.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }
              case 'T': {
                aValor = tmpObjeto.oTabla.oCampos.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }
              case 'Q': {
                aValor = tmpObjeto.oQuery.oFiltros.filter((valor: { id: string; }) => valor.id.startsWith(this.idvalor));
                break;
              }                
            }

            this.crud2Campos.forEach((campo: { campo: string | number; }) => {
              this.crud2Form.controls[campo.campo].patchValue(aValor[0][campo.campo]);
            })

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
      let tmpObjeto = JSON.parse(this.registroCompleto.objeto);

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
  cambiarValores(item: string) {

    // Solo cuando es el campo de una tabla
    if (this.tipo == 'T') {

      let ancho, decimales, valdefault: boolean = false;
      let vvaldefault: string = "";
      let vancho: number = 0;

      switch (item) {
        case 'C': {
          ancho = true;
          decimales = false;
          valdefault = true;
          break;
        }
        case 'N':
        case 'M': {
          ancho = true;
          decimales = true;
          valdefault = true;          
          break;
        }
        case 'K': {
          ancho = false;
          vancho = 10;
          decimales = false;
          valdefault = true;
          break;
        }
        case 'D': {
          ancho = false;
          decimales = false;
          valdefault = true;
          break;
        }
        case 'T': {
          ancho = false;
          decimales = false;
          valdefault = true;
          break;
        }
        case 'H': {
          ancho = false;
          decimales = false;
          valdefault = true;
          break;
        }
        case 'A': {
          ancho = false;
          vancho = 65535;
          decimales = false;
          valdefault = false;
          break;
        }
        case 'S': {
          ancho = false;
          decimales = false;
          valdefault = false;
          vvaldefault = "CURRENT_TIMESTAMP";
          break;
        }
      }

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

  }

}
