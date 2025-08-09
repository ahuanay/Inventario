import { Routes } from '@angular/router';
import { Panel } from './pages/panel/panel';
import { ListAlmacen } from './pages/almacen/list-almacen/list-almacen';
import { ListProducto } from './pages/producto/list-producto/list-producto';
import { ListMovimiento } from './pages/movimiento/list-movimiento/list-movimiento';
import { ListStock } from './pages/stock/list-stock/list-stock';

export const routes: Routes = [
    {
        path: '',
        component: Panel,
    },
    {
        path: 'almacenes',
        component: ListAlmacen
    },
    {
        path: 'productos',
        component: ListProducto
    },
    {
        path: 'movimientos',
        component: ListMovimiento
    },
    {
        path: 'stock',
        component: ListStock
    },
    {
        path: '**',
        redirectTo: '',
    }
];
