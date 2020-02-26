import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FirestoreService } from '../firestore.service';
import { Tarea } from '../tarea';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando: Tarea;
  idTareaSelec: string;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea
   }];
  
  constructor(private firestoreService: FirestoreService,private router: Router) {
        // Crear una tarea vacía
        this.tareaEditando = {} as Tarea;
        this.obtenerListaTareas();
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("tareas", this.tareaEditando).then(() => {
      console.log('Tarea creada correctamente!');
      this.tareaEditando= {} as Tarea;
    }, (error) => {
      console.error(error);
    });
  }
//

obtenerListaTareas(){
  this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {
    this.arrayColeccionTareas = [];
    resultadoConsultaTareas.forEach((datosTarea: any) => {
      this.arrayColeccionTareas.push({
        id: datosTarea.payload.doc.id,
        data: datosTarea.payload.doc.data()
      });
    })
  });
}
  selecTarea(tareaSelec) {
    this.idTareaSelec = tareaSelec.id;
    this.router.navigate(["/detalle/"+this.idTareaSelec]);
  }

  selecTareaPlus(tareaSelec) {
    this.idTareaSelec = tareaSelec;
    this.router.navigate(["/detalle/"+this.idTareaSelec]);
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
}
