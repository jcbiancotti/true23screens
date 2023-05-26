import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { Funciones, GlobalService, sistemStatusService, spinnerstatus } from 'src/app/servicios/global.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SistemaService } from 'src/app/servicios/sistema.service';

@Component({
  selector: 'app-crud1',
  templateUrl: './crud1.component.html',
  styleUrls: ['./crud1.component.css']
})
export class Crud1Component implements OnInit {

  @Input() id: string = "";
  @Input() tipo: string = "";
  @Input() rutaRetorno: string = "";
  @Input() campos: any[] = [];
  @Input() tabla: string = "";
  
  extraTitulo: string = "";
  nuevo: boolean = true;

  crud1Form!: FormGroup;
  error: string = "";
  
  lTiposCampo: any[] = [];
  lQueries: any[] = [];
  opc_Lista: any[] = [];
  laQ: any = { id: "", nombre: "" };
  xQuery: any = { id: "", idlocal: "", nombre: "" };

  registroCompleto: any;
  objetoCompleto: any;

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

  async ngOnInit() { 

    if(!this.id) {
      this.nuevo = true;
      this.id = "(nuevo registro)";
      this.extraTitulo = "(nuevo registro)";
    } else {
      this.nuevo = false;
    }

    this.crud1Form = new FormGroup({});

    // Cargar definición de la pantalla y el registro a editar
    if (!this.nuevo) {
      await this.cargarRegistro();
    } else {
      await this.recuperarDatosCrud1();
      this.ListaDeQueries();
    } 

  }
  
  async cargarRegistro() {

    await this.recuperarDatosCrud1();

    let tmpCampos: string[] = [];

    if (this.tabla == "sys_modelo_datos") {
      tmpCampos = ["id", "tipo", "descripcion", "objeto"];
    }
    if (this.tabla == "sys_screens") {
      tmpCampos = ["id", "tipo", "titulo as descripcion", "objeto"];
    }
    if (this.tabla == "sys_roles") {
      tmpCampos = ["id", "descripcion", "es_admin"];
    }
    await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpCampos,
    async (respuesta: any, datos: any) => {

      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Registro recuperado:", datos[0]);

        this.registroCompleto = datos[0];
        this.objetoCompleto = JSON.parse(this.registroCompleto.objeto.replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));

        this.crud1Form.controls["descripcion"].patchValue(datos[0]['descripcion']);
        this.crud1Form.controls["idQuery"].patchValue(this.objetoCompleto.oSelectable.idQuery);
        this.crud1Form.controls["campo_valor"].patchValue(this.objetoCompleto.oSelectable.campo_valor);
        this.crud1Form.controls["campo_descripcion"].patchValue(this.objetoCompleto.oSelectable.campo_descripcion);

        this.extraTitulo = "Código: " + this.id;
        this.ListaDeQueries();

        this.showspinner.updateShowSpinner(false);

      } else {
        this.showspinner.updateShowSpinner(false);
      }

    })
      
  }

  async recuperarDatosCrud1() {

    if(this.global.DEBUG)
      console.log("Definición datos CRUD1", this.id);

    this.lTiposCampo = this.funciones.tiposCampo;

    this.crud1Form = this.fb.group({});

    if (this.tipo == "I") {

      this.campos[3].lista = this.lQueries;
      
      /////// DEFINICION DE LOS CAMPOS PARA EL FORMULARIO ////////
      this.crud1Form.addControl(this.campos[0].campo, new FormControl(this.campos[0].id, [Validators.maxLength(13)]));        // ID
      this.crud1Form.addControl(this.campos[1].campo, new FormControl("", [Validators.required, Validators.maxLength(100)])); // Descripcion
      this.crud1Form.addControl(this.campos[2].campo, new FormControl("", [Validators.maxLength(13)]));                       // idQuery
      this.crud1Form.addControl(this.campos[3].campo, new FormControl("", [Validators.maxLength(150)]));                      // nQuery
      this.crud1Form.addControl(this.campos[4].campo, new FormControl("", [Validators.required, Validators.maxLength(100)])); // Campo_valor
      this.crud1Form.addControl(this.campos[5].campo, new FormControl("", [Validators.required, Validators.maxLength(100)])); // Campo_descripcion
    
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

        // this.laQ = this.lQueries.filter(q => q.nombre.startsWith(this.crud1Form.controls['nQuery'].value));
        // this.crud1Form.controls["idQuery"].patchValue(this.laQ[0].id);
    
        objSelectable = {
          idQuery: this.crud1Form.controls['idQuery'].value,
          campo_valor: this.crud1Form.controls['campo_valor'].value,
          campo_descripcion: this.crud1Form.controls['campo_descripcion'].value
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

  // Recibir el valor del input de la LISTA DE VALORES
  onKey(pLista: string, evento: any) { 
    let valor = evento.target.value;
    switch (pLista) {
      case 'nQuery': {
        this.opc_Lista = this.search(this.lQueries, valor);
        break;
      }

    }
  }
  search(pLista: any[], value: string) { 
    let filter = value.toLowerCase();
    return pLista.filter(opcion => opcion.nombre.toLowerCase().startsWith(filter));
  }
  
  async ListaDeQueries() {

    // PONER SPINNER
    this.showspinner.updateShowSpinner(true);

    this.dataaccess.read(this.tabla, "", "tipo = 'Q'", ["id", "descripcion"],
    async (respuesta: any, datos: any) => {
  
      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Queries recuperadas:", datos);
      
        datos.forEach((q: { id: string; descripcion: string; }) => {
          this.lQueries.push({
            id: q.id,
            idlocal: this.funciones.generarUUID(""),
            nombre: q.descripcion
          })
        
        });
        if (!this.nuevo) {
          if (this.tipo == "I") {

            let lq = this.lQueries.filter(q => q.id == this.objetoCompleto.oSelectable.idQuery);
            this.laQ.id = lq[0].id;
            this.laQ.nombre = lq[0].nombre;

            // this.crud1Form.controls["idQuery"].patchValue(this.laQ[0].id);
            this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);

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

  poneIdQuery(evento: any) {

    let valor = evento.value;

    let lq = this.lQueries.filter(q => q.nombre == valor);
    this.laQ.id = lq[0].id;
    this.laQ.nombre = lq[0].nombre;

    this.crud1Form.controls["idQuery"].patchValue(this.laQ.id);
    this.crud1Form.controls["nQuery"].patchValue(this.laQ.nombre);

  }


} // Fin del Export general

