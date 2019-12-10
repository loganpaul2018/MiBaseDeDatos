import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Tarea } from '../tarea';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id = null;
  tareaEditando: Tarea;
  //V
  coleccionTareas: any = {
    id: "",
    data: {} as Tarea
  };
  constructor(private firestoreService: FirestoreService,private activatedRoute: ActivatedRoute,private router: Router) {
    this.tareaEditando = {} as Tarea;
//    this.obtenerListaTareas();
  }
/* 
  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {
      this.coleccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.coleccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        });
      })
    });
  } */
  
  public buscaId() {
    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un arrayColeccionTareas con ese ID
      if(resultado.payload.data() != null) {
        this.coleccionTareas.id = resultado.payload.id;
        this.coleccionTareas.data = resultado.payload.data();
        this.tareaEditando = this.coleccionTareas.data;
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.tareaEditando.titulo);
      } else {
        // No se ha encontrado un arrayColeccionTareas con ese ID. Vaciar los datos que hubiera
        this.tareaEditando = {} as Tarea;
      } 
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("tareas", this.id).then(() => {
      // Actualizar la lista completa
      //this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
      this.router.navigate(["/home/"]);
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("tareas", this.id, this.tareaEditando).then(() => {
      // Actualizar la lista completa
      //this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
      this.router.navigate(["/home/"]);
    })
  }

  ngOnInit() {
    //Saca el Id
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.buscaId();
  }
}