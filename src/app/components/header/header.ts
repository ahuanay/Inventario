import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
    selector: 'app-header',
    imports: [RouterModule, Menubar],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit(): void {
        this.items = [
            {
                label: 'Inicio',
                icon: 'fa-solid fa-house',
                routerLink: '/',
            },
            {
                label: 'Almacenes',
                icon: 'fa-solid fa-boxes-stacked',
                routerLink: '/almacenes',
            },
            {
                label: 'Productos',
                icon: 'fa-solid fa-box',
                routerLink: '/productos',
            },
            {
                label: 'Movimientos',
                icon: 'fa-solid fa-dolly',
                routerLink: '/movimientos',
            },
        ];
    }
}
