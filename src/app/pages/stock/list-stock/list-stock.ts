import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../../service/web-service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
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
        TableModule,
    ],
    providers: [DialogService],
    templateUrl: './list-stock.html',
    styleUrl: './list-stock.css',
})
export class ListStock implements OnInit {
    public listData: any[] = [];
    public selectedRow!: any;
    public loadingTable: boolean = false;

    constructor(
        private _webService: WebService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.getList();
    }

    getList() {
        this.loadingTable = true;

        let query = {
            search: 'search=',
            params: `&from=0&size=10`,
        };
        this._webService.getStock(query).subscribe(
            (response) => {
                this.listData = response;
                this.loadingTable = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    mdRefreshData() {
        this.getList();
    }
}
