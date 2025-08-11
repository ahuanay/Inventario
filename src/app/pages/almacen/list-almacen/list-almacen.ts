import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../../service/web-service';

import { NewAlmacen } from '../new-almacen/new-almacen';
import { DestroyAlmacen } from './../destroy-almacen/destroy-almacen';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-list-almacen',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        CardModule,
        ContextMenuModule,
        MenuModule,
        PaginatorModule,
        TableModule,
    ],
    providers: [DialogService],
    templateUrl: './list-almacen.html',
    styleUrl: './list-almacen.css',
})
export class ListAlmacen implements OnInit {
    public messageService = inject(MessageService);

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

    public paginationTableOptions: any = {
        first: 0,
        rows: 5,
        total: 0,
    };

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

        const from = this.paginationTableOptions.first;
        const size = this.paginationTableOptions.rows;

        let query = {
            search: 'search=',
            params: `&from=${from}&size=${size}`,
        };

        this._webService.getAlmacenes(query).subscribe(
            (response) => {
                const respData = response.data.rows;

                this.paginationTableOptions.total = response.data.total;

                this.listData = respData;
                this.loadingTable = false;
            },
            (error) => {
                const respError: any[] = error.error.errors;

                respError.forEach((e: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e,
                        life: 3000,
                    });
                });
            }
        );
    }

    onPageChange(event: PaginatorState) {
        this.paginationTableOptions.first = event.first;
        this.paginationTableOptions.rows = event.rows;

        this.getList();
    }

    private refMdCreate?: DynamicDialogRef;
    mdCreate(row: any = null) {
        this.refMdCreate = this.dialogService.open(NewAlmacen, {
            header: 'Almacén',
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
        this.refMdDestroy = this.dialogService.open(DestroyAlmacen, {
            header: 'Almacén',
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
