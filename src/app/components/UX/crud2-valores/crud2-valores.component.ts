import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { Funciones, GlobalService, spinnerstatus } from 'src/app/servicios/global.service';
import { NavigationService } from 'src/app/servicios/navigation.service';

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
    private navigation: NavigationService,
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
    this.crud2Campos.forEach((campo: { id: string; valordefault: any; ancho: number; requerido: any; formato: string; }) => {
      this.crud2Form.addControl(campo.id, new FormControl(campo.valordefault, [Validators.maxLength(campo.ancho)]));
      if(campo.requerido) {
        this.crud2Form.controls[campo.id].addValidators(Validators.required);
      }      
      if(campo.formato == 'E') {
        this.crud2Form.controls[campo.id].addValidators(Validators.email);
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
          // this.navigation.back()
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

    if (item != 'N' && item != 'M') {
      this.crud2Form.controls["decimales"].patchValue(0);
    }

  }

}
