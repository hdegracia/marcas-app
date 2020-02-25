import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Marcas } from './marcas';
import { MarcasService } from './marcas.service';
import { ModalService } from './detalle/modal.service';
import { URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html'
})
export class MarcasComponent implements OnInit {

  marcas: Marcas[]
  paginador: any
  marcaSeleccionada: Marcas
  urlBackend: string = URL_BACKEND;


  constructor(private marcasService: MarcasService,
    public modalService: ModalService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {

      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.marcasService.getMarcas(page).pipe(
        tap(response => {
          console.log('MarcasComponent: tap 3');
          (response.content as Marcas[]).forEach(marcas => {
            console.log(marcas.nombre);
          });
        })
      ).subscribe(response => {
        this.marcas = response.content as Marcas[];
        this.paginador = response;
      });

      this.modalService.notificarUpload.subscribe(marcas => {
        this.marcas = this.marcas.map(marcasOriginal => {
          if (marcas.id == marcasOriginal.id) {
            marcasOriginal.foto = marcas.foto;
          }
          return marcasOriginal;
        })
      })

    });

  }

  delete(marcas: Marcas): void {
    swal.fire({
      title: 'Esta seguro?',
      text: `Seguro desea eliminar el registro ${marcas.nombre} ${marcas.numero_serie}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.marcasService.delete(marcas.id).subscribe(
          response => {
            this.marcas = this.marcas.filter(cli => cli !== marcas)
            swal.fire(
              'Registro Eliminado!',
              `Cliente ${marcas.nombre} Eliminado con éxito.`,
              'success'
            )
          }
        )
        swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }



  abrirModal(marcas: Marcas) {
    this.marcaSeleccionada = marcas;
    this.modalService.abrirModal();
  }

}
