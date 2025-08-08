import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { WebService } from '../../../service/web-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-destroy-producto',
    imports: [ButtonModule, ToastModule],
    templateUrl: './destroy-producto.html',
    styleUrl: './destroy-producto.css',
})
export class DestroyProducto implements OnInit {
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
        this._webService.deleteProducto(this.node.id).subscribe(
            (response) => {
                this.loadingSubmit = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
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
