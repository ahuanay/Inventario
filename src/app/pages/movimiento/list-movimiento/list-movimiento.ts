import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../../service/web-service';

import { NewMovimiento } from '../new-movimiento/new-movimiento';
import { DestroyMovimiento } from '../destroy-movimiento/destroy-movimiento';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

import moment from 'moment';

@Component({
    selector: 'app-list-movimiento',
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
    templateUrl: './list-movimiento.html',
    styleUrl: './list-movimiento.css',
})
export class ListMovimiento implements OnInit {
    public messageService = inject(MessageService);

    public listData: any[] = [];
    public selectedRow!: any;
    public loadingTable: boolean = false;

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

        this._webService.getMovimientos(query).subscribe(
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
        this.refMdCreate = this.dialogService.open(NewMovimiento, {
            header: 'Movimiento',
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
        this.refMdDestroy = this.dialogService.open(DestroyMovimiento, {
            header: 'Movimiento',
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
                    this.listData.unshift(row);
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

    getFormatFechaHora(date: any) {
        if (date == null) return null;

        return moment(date).format('DD/MM/YYYY hh:mm A');
    }

    mdRefreshData() {
        this.getList();
    }
}
