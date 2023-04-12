import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-tabla',
  templateUrl: './md-tabla.component.html',
  styleUrls: ['./md-tabla.component.css']
})
export class MdTablaComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/tablacampo";
  rutaRetorno = "/in/tablas";
  
    constructor ( 
      private global: GlobalService,
      private route: ActivatedRoute,
    ) {
      this.id = route.snapshot.params['id'];
  
      if(this.global.DEBUG)
        console.log("Datos recibidos ID:", this.id);
  
    }
  
    ngOnInit(): void {} 
  
  }
