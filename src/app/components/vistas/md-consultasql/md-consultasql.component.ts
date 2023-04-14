import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-consultasql',
  templateUrl: './md-consultasql.component.html',
  styleUrls: ['./md-consultasql.component.css']
})
export class MdConsultasqlComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/consultasqlfiltro";
  rutaRetorno: string = "/in/consultassql";
  
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
