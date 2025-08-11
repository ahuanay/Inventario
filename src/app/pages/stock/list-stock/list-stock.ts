import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../../service/web-service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-list-stock',
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
    templateUrl: './list-stock.html',
    styleUrl: './list-stock.css',
})
export class ListStock implements OnInit {
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

    getList() {
        this.loadingTable = true;

        const from = this.paginationTableOptions.first;
        const size = this.paginationTableOptions.rows;

        let query = {
            search: 'search=',
            params: `&from=${from}&size=${size}`,
        };

        this._webService.getStock(query).subscribe(
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

    mdRefreshData() {
        this.getList();
    }
}
