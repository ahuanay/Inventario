import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebService {
    public SERVER_API = '';

    constructor(private http: HttpClient) {
        this.SERVER_API = 'https://inventarioapi-1h1r.onrender.com';
    }

    getHeader() {
        return new HttpHeaders().set('accept', 'application/json');
    }

    getUbigeos(): Observable<any[]> {
        return this.http.get<any[]>('ubigeos.json ');
    }

    private nameURLAlmacenes = 'api/v1/almacenes';
    getAlmacenes(query: any): Observable<any> {
        return this.http.get(
            `${this.SERVER_API}/${this.nameURLAlmacenes}/?${query.search}${query.params}`,
            { headers: this.getHeader() }
        );
    }
    getAlmacenById(id: any): Observable<any> {
        return this.http.get(
            `${this.SERVER_API}/${this.nameURLAlmacenes}/${id}`,
            {
                headers: this.getHeader(),
            }
        );
    }
    postAlmacen(data: any): Observable<any> {
        return this.http.post(
            `${this.SERVER_API}/${this.nameURLAlmacenes}/`,
            data,
            {
                headers: this.getHeader(),
            }
        );
    }
    putAlmacen(id: any, data: any): Observable<any> {
        return this.http.put(
            `${this.SERVER_API}/${this.nameURLAlmacenes}/${id}`,
            data,
            {
                headers: this.getHeader(),
            }
        );
    }
    deleteAlmacen(id: any): Observable<any> {
        return this.http.delete(
            `${this.SERVER_API}/${this.nameURLAlmacenes}/${id}`,
            {
                headers: this.getHeader(),
            }
        );
    }

     private nameURLProductos = 'api/v1/productos';
    getProductos(query: any): Observable<any> {
        return this.http.get(
            `${this.SERVER_API}/${this.nameURLProductos}/?${query.search}${query.params}`,
            { headers: this.getHeader() }
        );
    }
    getProductoById(id: any): Observable<any> {
        return this.http.get(
            `${this.SERVER_API}/${this.nameURLProductos}/${id}`,
            {
                headers: this.getHeader(),
            }
        );
    }
    postProducto(data: any): Observable<any> {
        return this.http.post(
            `${this.SERVER_API}/${this.nameURLProductos}/`,
            data,
            {
                headers: this.getHeader(),
            }
        );
    }
    putProducto(id: any, data: any): Observable<any> {
        return this.http.put(
            `${this.SERVER_API}/${this.nameURLProductos}/${id}`,
            data,
            {
                headers: this.getHeader(),
            }
        );
    }
    deleteProducto(id: any): Observable<any> {
        return this.http.delete(
            `${this.SERVER_API}/${this.nameURLProductos}/${id}`,
            {
                headers: this.getHeader(),
            }
        );
    }
}
