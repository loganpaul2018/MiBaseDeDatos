import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Tarea } from '../tarea';
import { LoadingController, ToastController,AlertController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


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
  constructor(private firestoreService: FirestoreService,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private loadingController: LoadingController,
  private toastController: ToastController,
  private socialSharing: SocialSharing,
  public alertController: AlertController,
  private imagePicker: ImagePicker) {
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

  async clicBotonBorrar() {
    console.log('eoooooo');
    const alert = await this.alertController.create({
      header: '¿Estas seguro que quieres borrarlo?',
      message: 'Una vez lo hagas <strong>no habrá vuelta atrás</strong>',
      buttons: [
         {text: 'Aceptar',
          handler: () => {
            console.log('Borrado');
            this.firestoreService.borrar("tareas", this.id).then(() => {
              // Actualizar la lista completa
              //this.obtenerListaTareas();
              // Limpiar datos de pantalla
              this.tareaEditando = {} as Tarea;
              this.router.navigate(["/home/"]);
            })
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Nah');
            this.router.navigate(["/home/"]);
          }
        }

      ]
    });
    await alert.present();
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

  clicBotonInsertar() {
    this.firestoreService.insertar("tareas", this.tareaEditando).then(() => {
      console.log('Tarea creada correctamente!');
      this.tareaEditando= {} as Tarea;
      this.router.navigate(["/home/"]);
    }, (error) => {
      console.error(error);
    });
  }
  clicCancelar(){
    this.router.navigate(["/home/"]);
  }

  
  compartir(platform){
    switch(platform){
      case 'whatsapp':
      console.log('Whatsapp');
      this.socialSharing.shareViaWhatsApp("Compartir desde Whatsapp",null,null);
      break;

      case 'twitter':
      console.log('Twitter');
      this.socialSharing.shareViaTwitter('Compartido desde Twitter',null,null);
      break;

      case 'facebook':
      console.log('Facebook');
      this.socialSharing.shareViaFacebook('Compartido desde Facebook',null,null)
      break;

    }
  }
  
  async cargarImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              //  aunque realmente sólo será 1 como se ha indicado en las opciones
              for (var i = 0; i < results.length; i++) {      
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                //  evitar duplicidades de nombres        
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        // En la variable downloadURL se tiene la dirección de descarga de la imagen
                        console.log("downloadURL:" + downloadURL);
                        // Mostrar el mensaje de finalización de la subida
                        toast.present();
                        // Ocultar mensaje de espera
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
  
  async borrarFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'El archivo ha sido eliminado satisfactoriamente',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }
 
  ngOnInit() {
    //Saca el Id
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.buscaId();
  }
}