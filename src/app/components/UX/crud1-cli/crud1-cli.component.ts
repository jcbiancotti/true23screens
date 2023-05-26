import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { GlobalService, Funciones, spinnerstatus, sistemStatusService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-crud1-cli',
  templateUrl: './crud1-cli.component.html',
  styleUrls: ['./crud1-cli.component.css']
})
export class Crud1CliComponent implements OnInit {

    @Input() id: string = "";
    @Input() rutaRetorno: string = "";
    @Input() campos: any[] = [];
    @Input() tabla: string = "";
    
    extraTitulo: string = "";
    nuevo: boolean = true;
  
    crud1Form!: FormGroup;
    error: string = "";
  
    registroCompleto: any;
  
    constructor (
      private global: GlobalService,
      private funciones: Funciones,
      private router: Router, 
      private showspinner: spinnerstatus,
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
      } 
  
    }
    
    async cargarRegistro() {
  
      await this.recuperarDatosCrud1();

      this.showspinner.updateShowSpinner(true);

      let tmpModelo: any[] = [];
      this.campos.forEach(async c => {
        tmpModelo.push(c.campo);
      })
    
      await this.dataaccess.read(this.tabla, "", "id = '" + this.id + "'", tmpModelo,
      async (respuesta: any, datos: any[]) => {

        if (respuesta == 'OK') {

          if (this.global.DEBUG)
            console.log("Registro recuperado:", datos[0]);

          this.campos.forEach(async campo => {

            let xValor = datos[0][campo.campo];

            if (campo.formato == "B") {
              if (xValor == 1) {
                xValor = true;
              } else {
                xValor = false;
              }
            }

            if (campo.formato == "J") {
              xValor = JSON.parse(datos[0][campo.campo].replace(/&quot;/g, '"').replace(/\t/g, '').replace(/\n/g, ''));
              xValor.addQuery = campo.addQuery;
            }

            if (campo.formato == "L") {
              campo.valtmp = xValor;
            }
        
            // Poner el valor en el control
            this.crud1Form.controls[campo.campo].patchValue(xValor);
        
          })

          // Cargar las listas y asignar el valor recuperado
          await this.CargarValoresLista();

          this.extraTitulo = "Código: " + this.id;

          this.showspinner.updateShowSpinner(false);

        } else {
          this.showspinner.updateShowSpinner(false);
        }

      })
      
 
    }
  
    async recuperarDatosCrud1() {
  
      if(this.global.DEBUG)
        console.log("Definición datos CRUD1", this.id,"CAMPOS", this.campos);
      
      this.crud1Form = this.fb.group({});

      this.campos.forEach(campo => {

        this.crud1Form.addControl(campo.campo, new FormControl(campo.valordefault, [Validators.maxLength(campo.ancho)]));

        if (campo.requerido == true) {
          this.crud1Form.controls[campo.campo].addValidators(Validators.required);
        }
        if (campo.formato == 'E') {
          this.crud1Form.controls[campo.campo].addValidators(Validators.email);
        }

      })
    
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
          
          // Componer el modelo y rellenar los datos
          let tmpModelo: any[] = [];
          let tmpObjeto: any = {};

          this.campos.filter(fi => fi.campo != "id").forEach(campo => {

            let xValor = this.crud1Form.controls[campo.campo].value;

            if (campo.formato == 'B') {
              if (xValor == true) {
                xValor = 1;
              } else {
                xValor = 0;
              }
            }

            if (campo.formato == 'J') {
              xValor = JSON.stringify(this.crud1Form.controls[campo.campo].value);
            }

            if (campo.formato == 'L') {
              xValor = campo.valtmp;
            }

            tmpModelo.push(campo.campo)
            tmpObjeto[campo.campo] = xValor;

          });
  
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
  
    // ////////////////// CUANDO SE HACE CLICK EN LA CRUZ DEL JITEM ////////////////////////////////////////////////////
    quitarJitem(campo: string, itemId: any) {
      
      let nuevoValor = this.crud1Form.controls[campo].value.filter((opc: { id: any; }) => opc.id != itemId);
      this.crud1Form.controls[campo].patchValue(nuevoValor);
      this.crud1Form.controls[campo].markAsTouched();

    }
    // ////////////////// CUANDO SE HACE AÑADE UN JITEM ////////////////////////////////////////////////////////////////
    agregarJitem(campo: string, item: any) {
      
      let nuevoValor = this.crud1Form.controls[campo].value;
      nuevoValor.push({
        id: item.id,
        descripcion: item.descripcion
      })
      this.crud1Form.controls[campo].patchValue(nuevoValor);
      this.crud1Form.controls[campo].markAsTouched();

    }
    // ////////////////// COMPLETAR EL CAMPO IDQUERY SEGUN LA LISTA SELECCIONABLE //////////////////////////////////////
    ponerIds(pCmpo: string, evento: any) {

      let valor = evento.value;
      
      let tmpid = this.campos.filter(c => c.campo == pCmpo);
      let tmpli = tmpid[0].lista.filter((l: { texto: any; }) => l.texto == valor);
      tmpid[0].valtmp = tmpli[0].codigo;
  
    }
    // ////////////////// RECUPERAR LA LISTA DE LAS TABLAS DEFINIDAS ///////////////////////////////////////////////////
    async CargarValoresLista() {
      // async CargarValoresLista(pQuery: string, pCampo: any) {

      // PONER SPINNER
      this.showspinner.updateShowSpinner(true);

      this.campos.filter(cf => cf.formato == "L").forEach(async pCampo => {
        
        await this.dataaccess.idquery(pCampo.listQuery, 0, 0, [], "descripcion", "up",
        async (respuesta: any, datos: any) => {
    
          if (respuesta == 'OK') {

            if (this.global.DEBUG)
              console.log(pCampo.listQuery + " recuperadas:", datos);
        
            pCampo.lista = [];
            pCampo.lista.push({
              codigo: '',
              texto: ''
            })
            let txt = "";

            datos[1].forEach((q: { id: string; descripcion: string; }) => {
              pCampo.lista.push({
                codigo: q.id,
                texto: q.descripcion
              })
              if (q.id == pCampo.valtmp) {
                txt = q.descripcion
              }
            });
            
            this.crud1Form.controls[pCampo.campo].patchValue(txt);
                  
          }

          
        })
        // QUITAR SPINNER
        this.showspinner.updateShowSpinner(false);

      })
    
    }

    
  
  } // Fin del Export general
  
  
