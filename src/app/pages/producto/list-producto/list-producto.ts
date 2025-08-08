import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../../service/web-service';

import { NewProducto } from '../new-producto/new-producto';
import { DestroyProducto } from '../destroy-producto/destroy-producto';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-list-producto',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        ContextMenuModule,
        MenuModule,
        TableModule,
        ImageModule,
    ],
    providers: [DialogService],
    templateUrl: './list-producto.html',
    styleUrl: './list-producto.css',
})
export class ListProducto implements OnInit {
    public listData: any[] = [];
    public selectedRow!: any;
    public loadingTable: boolean = false;

    public listContextMenu: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'fa-solid fa-pencil',
            command: () => this.mdCreate(this.selectedRow),
        },
        {
            label: 'Eliminar',
            icon: 'fa-solid fa-trash',
            command: () => this.mdDestroy(this.selectedRow),
        },
    ];

    constructor(
        private _webService: WebService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.getList();
    }

    ngOnDestroy() {
        if (this.refMdCreate) {
            this.refMdCreate.close();
        }
        if (this.refMdDestroy) {
            this.refMdDestroy.close();
        }
    }

    getList() {
        this.loadingTable = true;

        let query = {
            search: 'search=',
            params: `&from=0&size=10`,
        };
        this._webService.getProductos(query).subscribe(
            (response) => {
                this.listData = response;
                this.loadingTable = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    private refMdCreate?: DynamicDialogRef;
    mdCreate(row: any = null) {
        this.refMdCreate = this.dialogService.open(NewProducto, {
            header: 'Producto',
            width: '80vw',
            modal: true,
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            data: {
                node: row,
            },
            closable: true,
        });

        this.refMdCreate.onClose.subscribe((response: any) => {
            this.mdResponse(response, row);
        });
    }

    private refMdDestroy?: DynamicDialogRef;
    mdDestroy(row: any) {
        this.refMdDestroy = this.dialogService.open(DestroyProducto, {
            header: 'Producto',
            width: '40vw',
            modal: true,
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            data: {
                node: row,
            },
            closable: true,
        });

        this.refMdDestroy.onClose.subscribe((response: any) => {
            this.mdResponse(response, row);
        });
    }

    mdResponse(response: any, row: any) {
        if (response !== undefined && response !== null) {
            row = response.data;

            switch (response.type) {
                case 'created':
                    this.listData.push(row);
                    break;
                case 'updated': {
                    const index = this.listData.findIndex(
                        (e) => e.id == row.id
                    );
                    this.listData[index] = row;
                    break;
                }
                case 'deleted': {
                    const index = this.listData.findIndex(
                        (e) => e.id == row.id
                    );
                    this.listData.splice(index, 1);
                    break;
                }
                default:
                    break;
            }
        }
    }

    mdRefreshData() {
        this.getList();
    }
}
