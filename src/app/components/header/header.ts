import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';

@Component({
    selector: 'app-header',
    imports: [RouterModule, Menubar, ButtonModule],
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
                icon: 'fa-solid fa-rectangle-list',
                routerLink: '/productos',
            },
            {
                label: 'Movimientos',
                icon: 'fa-solid fa-dolly',
                routerLink: '/movimientos',
            },
            {
                label: 'Stock',
                icon: 'fa-solid fa-box',
                routerLink: '/stock',
            },
        ];
    }

    public isDark: boolean = false;
    toggleDarkMode() {
        this.isDark = !this.isDark;
        const element: any = document.querySelector('html');
        element.classList.toggle('app-theme-dark');
    }
}
