import { Component, OnInit } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';
import { Router } from "@angular/router";
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  map:Map;
  newMarker:any;
  address:string[];
  constructor(private router: Router) { }

  ionViewDidEnter(){
    this.loadMap();
  }
 // Mapa
  loadMap(){
    this.map = new Map("mapId").setView([36.68000,-5.44540], 70);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>contributors <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(this.map); // This line is added to add the Tile Layer to our map
    marker([36.68000, -5.44540]).addTo(this.map).bindPopup('<b>IES Los remedios</b><br />Aqui.').openPopup();
  }
  abrircontactos(){
    this.router.navigate(["/contactos/"]);

  }

  abririnfo(){
    this.router.navigate(["/info/"]);
  }

  abrirhome(){
    this.router.navigate(["/home/"]);
  }
  ngOnInit() {
  }

}
