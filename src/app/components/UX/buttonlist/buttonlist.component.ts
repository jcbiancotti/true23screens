import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-buttonlist',
  templateUrl: './buttonlist.component.html',
  styleUrls: ['./buttonlist.component.css']
})
export class ButtonlistComponent implements OnInit {

  @Input() etiqueta: string = "";
  @Input() opciones: any[] = [];
  @Input() addQuery: string = "";

  @Output() quitarJitem = new EventEmitter<string>();
  @Output() agregarJitem = new EventEmitter<any>();

  adding: boolean = false;
  localLista: any[] = [];
  buttonListForm!: FormGroup;

  constructor(
    private global: GlobalService,
    private dataaccess: DataAccessService,
    private fb: FormBuilder,
  ) { }
  
  async ngOnInit() { 
    this.buttonListForm = this.fb.group({});
    this.buttonListForm.addControl("nuevoJitem", new FormControl("", [Validators.required]));
  }

  quitarItem(idItem: string) {
    this.quitarJitem.emit(idItem);
  }

  async cargaAddQuery() {

    await this.dataaccess.idquery(this.addQuery, 0, 0, [], "descripcion", "up",
    async (respuesta: any, datos: any) => {

      if (respuesta == 'OK') {

        if (this.global.DEBUG)
          console.log("Registro recuperado cargaAddQuery:", datos[1]);
        
        let tmp: any[] = [];
        this.localLista = [];

        if (this.opciones.length > 0) {
          tmp = datos[1].filter((d: { id: any; }) => (this.opciones.filter((op: { id: any; }) => op.id == d.id)).length == 0)
        } else {
          tmp = datos[1];
        }

        tmp.forEach((reg: any) => {

          this.localLista.push({
            id: reg.id,
            texto: reg.descripcion
          })

        })

      }

    })
    this.buttonListForm.controls['nuevoJitem'].patchValue("");

  }

  agregarItem(idItem: string) {
    let descripItem: any = this.localLista.filter((op: { id: string; }) => op.id == idItem);
    this.agregarJitem.emit({ id: idItem, descripcion: descripItem[0].texto });
  }


}
