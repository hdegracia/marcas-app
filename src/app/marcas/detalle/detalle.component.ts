import { Component, OnInit, Input } from '@angular/core';
import { Marcas } from '../marcas';
import { MarcasService } from '../marcas.service';
import { ModalService } from './modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() marcas: Marcas;
  titulo: string = "Detalle de la marca"
  private fotoSeleccionada: File
  private progreso: number = 0;

  constructor(private marcasService: MarcasService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService ) { }

    ngOnInit() {
      this.activatedRoute.paramMap.subscribe(params => {
        let id: number = +params.get('id');
        if (id) {
          this.marcasService.getMarca(id).subscribe(marcas => {
            this.marcas = marcas;
          });
        }
      });
    }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0]
    this.progreso = 0
    console.log(this.fotoSeleccionada)
    if(this.fotoSeleccionada.type.indexOf('image') <0){
      Swal.fire('Error al seleccionar imagen', 'El archivo debe ser de tipo imagen','error')
    }
  }

  subirFoto() {

    if(!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'debe seleccionar una foto','error')
    } else {

    this.marcasService.subirFoto(this.fotoSeleccionada, this.marcas.id)
    .subscribe(event => {
      if(event.type === HttpEventType.UploadProgress) {
        this.progreso = Math.round((event.loaded/event.loaded)*100)
      } else if(event.type === HttpEventType.Response) {
        let response: any = event.body
        this.marcas = response.marcas as Marcas;

        this.modalService.notificarUpload.emit(this.marcas)
        Swal.fire('la foto subio con exito', response.mensaje, 'success')
      }
      
      
      
    })
  }
}

cerrarModal() {
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
  this.progreso = 0;
}

}
