import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listavalor-valor',
  templateUrl: './md-listavalor-valor.component.html',
  styleUrls: ['./md-listavalor-valor.component.css']
})
export class MdListavalorValorComponent implements OnInit {

  id: string | null = '';
  idvalor: string | null = '';
  crud2Campos: any[] = [];
  crud2Columnas: any[] = [];
  rutaRetorno: string = "";

  constructor ( 
    private global: GlobalService,
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {
    this.id = route.snapshot.params['id'];
    this.idvalor = route.snapshot.params['idvalor'];

    if(this.global.DEBUG)
      console.log("Datos recibidos ID:", this.id , "IDvalor:", this.idvalor);

  }
  ngOnInit(): void {

    this.rutaRetorno = "/in/listadevalor/";
    this.crud2Campos = [
      {
        id: "id",
        etiqueta: "ID",
        campo: "id",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: true,
        ancho: 13,
        formato: "C",
      },
      {
        id: "codigo",
        etiqueta: "Código",
        campo: "codigo",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 10,
        formato: "C",
      },
      {
        id: "descripcion",
        etiqueta: "Texto",
        campo: "descripcion",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      },
      {
        id: "orden",
        etiqueta: "Orden",
        campo: "orden",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 10,
        formato: "N",
      }
    ];

  }

}
