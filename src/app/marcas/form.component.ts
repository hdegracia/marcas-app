import { Component, OnInit } from '@angular/core';
import { MarcasService } from './marcas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Marcas } from './marcas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public marcas: Marcas = new Marcas()
  errores: string[];
  public titulo:string = "Crear Marca"

  constructor(private marcasService: MarcasService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

      this.activatedRoute.paramMap.subscribe(params => {
        let id = +params.get('id');
        if (id) {
          this.marcasService.getMarca(id).subscribe((marcas) => this.marcas = marcas);
        }
      });
     // this.marcasService.getRegiones().subscribe(regiones => this.regiones = regiones);
    }



  update(): void {
    console.log(this.marcas)
    this.marcasService.update(this.marcas)
      .subscribe(
        json => {
          this.router.navigate(['/marcas']);
          Swal.fire('Registro Actualizado', `${json.mensaje}: ${json.marcas.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  cargarMarca(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.marcasService.getMarcas(id).subscribe((marcas) => this.marcas = marcas);
      }
    })
  }

  create(): void {
    console.log(this.marcas)
    this.marcasService.create(this.marcas)
      .subscribe(
        marcas => {
          this.router.navigate(['/marcas']);
          Swal.fire('Nuevo registro', `El registro ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

}
