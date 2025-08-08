import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { WebService } from '../../../service/web-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-destroy-almacen',
    imports: [ButtonModule, ToastModule],
    templateUrl: './destroy-almacen.html',
    styleUrl: './destroy-almacen.css',
})
export class DestroyAlmacen implements OnInit {
    messageService = inject(MessageService);

    public loadingSubmit = false;

    public node: any = null;

    constructor(
        private _webService: WebService,
        private ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.loadingSubmit = false;
        this.node = this.config.data?.node;
    }

    onSubmit() {
        this.loadingSubmit = true;
        this._webService.deleteAlmacen(this.node.id).subscribe(
            (response) => {
                this.loadingSubmit = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'ÉXITO',
                    detail: 'Eliminado con éxito',
                    life: 3000,
                });

                this.onClose({
                    type: 'deleted',
                    data: null,
                });
            },
            (error) => {}
        );
    }

    onClose(data: any = null) {
        this.ref.close(data);
    }
}
