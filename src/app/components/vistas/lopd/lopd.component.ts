import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/servicios/navigation.service';

@Component({
  selector: 'app-lopd',
  templateUrl: './lopd.component.html',
  styleUrls: ['./lopd.component.css']
})
export class LopdComponent implements OnInit{

  constructor(
    private navigation: NavigationService,
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.navigation.back()
  }

}
