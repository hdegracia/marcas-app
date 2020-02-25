import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Marcas } from './marcas';
import { tap, map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_BACKEND} from '../config/config';

@Injectable()
export class MarcasService {
  private urlEndPoint: string =  URL_BACKEND + '/api/marcas';

  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getMarcas(page: number): Observable<any> {

    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {

        console.log('MarcasService: tap 1');
        (response.content as Marcas[]).forEach(marcas => {
          console.log(marcas.nombre);
        });
      }),
      map((response: any) => {

        (response.content as Marcas[]).map(marcas => {
          marcas.nombre = marcas.nombre.toUpperCase();

          return marcas;
        })
        return response;
      }),
      tap(response => {
        console.log('MarcasService: tap 2');
        (response.content as Marcas[]).forEach(marcas => {
          console.log(marcas.nombre);
        }

        )
      })
    );
  }

  getMarca(id: number): Observable<Marcas> {
    return this.http.get<Marcas>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/marcas']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(marcas: Marcas): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${marcas.id}`, marcas, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Marcas> {
    return this.http.delete<Marcas>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje)
        Swal.fire('Error al eliminar el registro', e.error.mensaje, 'error')
        return throwError(e)
      })
    )
  }

  create(marcas: Marcas): Observable<any> {
    return this.http.post(this.urlEndPoint, marcas, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.marcas as Marcas),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{Marcas: any}>> {
    let formData = new FormData();
    formData.append("archivo", archivo)
    formData.append("id", id)

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req)

  }


}
