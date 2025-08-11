import { forkJoin } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { WebService } from '../../../service/web-service';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { parse, stringify } from 'flatted';

@Component({
    selector: 'app-new-movimiento',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        MessageModule,
        SelectModule,
        ToastModule,
        ToggleSwitchModule,
    ],
    templateUrl: './new-movimiento.html',
    styleUrl: './new-movimiento.css',
})
export class NewMovimiento implements OnInit {
    public messageService = inject(MessageService);

    public registerForm: FormGroup = new FormGroup({});

    public formSubmitted = false;
    public loadingSubmit = false;

    public node: any = null;

    public listAlmacenes: any[] = [];
    public listProductos: any[] = [];
    public listTipos: any[] = [];
    public listMotivos: any[] = [];
    public listUnidadMedidas: any[] = [];

    constructor(
        private _webService: WebService,
        private ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.node = parse(stringify(this.config.data?.node));

        this.getList();
    }

    getList() {
        this.initForm();

        this.listTipos = [
            { value: 'E', label: 'ENTRADA' },
            { value: 'S', label: 'SALIDA' },
        ];

        this.listUnidadMedidas = [
            { label: 'CAJA', value: 'caja' },
            { label: 'KILOGRAMO', value: 'kg' },
            { label: 'LITRO', value: 'L' },
            { label: 'METRO', value: 'm' },
            { label: 'UNIDAD', value: 'und' },
        ];

        let query = {
            search: 'search=',
            params: `&es_activo=true&from=0&size=1000000`,
        };

        forkJoin([
            this._webService.getAlmacenes(query),
            this._webService.getProductos(query),
        ]).subscribe((responses: any[]) => {
            this.listAlmacenes = responses[0];
            this.listProductos = responses[1];

            if (this.node != null) {
                this.initUpdateData();
            }
        });
    }

    initForm() {
        this.registerForm = this.fb.group({
            id: [null],
            tipo: [null, Validators.required],
            motivo: [null, Validators.required],
            almacen_origen: [null, Validators.required],
            almacen_destino: [null, Validators.required],
            producto: [null, Validators.required],
            cantidad: [null, Validators.required],
            unidad_medida: [null, Validators.required],
        });

        this.resetForm();
    }

    initUpdateData() {
        const data = this.node;

        this.registerForm.get('id')?.setValue(data.id);
        this.registerForm.get('tipo')?.setValue(data.tipo);
        this.registerForm.get('motivo')?.setValue(data.motivo);
        this.registerForm.get('almacen')?.setValue(data.almacen);
        this.registerForm.get('producto')?.setValue(data.producto);
        this.registerForm.get('cantidad')?.setValue(data.cantidad);
        this.registerForm.get('unidad_medida')?.setValue(data.unidad_medida);
    }

    resetForm() {
        this.formSubmitted = false;
        this.loadingSubmit = false;

        this.registerForm.reset({
            tipo: 'E',
            cantidad: 1,
        });

        this.changeTipo();
    }

    onSubmit() {
        this.formSubmitted = true;
        this.loadingSubmit = true;

        if (this.registerForm.invalid) {
            this.loadingSubmit = false;
            this.messageService.add({
                severity: 'error',
                summary: 'ERROR',
                detail: 'Complete los campos',
                life: 3000,
            });
            return;
        }

        const raw = this.registerForm.getRawValue();

        let data: any = {
            id: raw.id ?? null,
            tipo: raw.tipo,
            motivo: raw.motivo,
            almacen_origen_id: raw.almacen_origen?.id ?? null,
            almacen_destino_id: raw.almacen_destino?.id ?? null,
            producto_id: raw.producto?.id ?? null,
            cantidad: raw.cantidad,
            unidad_medida: raw.unidad_medida,
        };

        if (data.id == null) {
            delete data.id;
            this.saveForm(data);
        } else {
            this.updateForm(data);
        }
    }

    saveForm(data: any) {
        this._webService.postMovimiento(data).subscribe(
            (response) => {
                const respData = response.data;

                this.messageService.add({
                    severity: 'success',
                    summary: 'ÉXITO',
                    detail: 'Guardado con éxito',
                    life: 3000,
                });

                this.formSubmitted = false;
                this.loadingSubmit = false;

                this.resetForm();

                this.onClose({
                    type: 'created',
                    data: respData,
                });
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

                this.loadingSubmit = false;
            }
        );
    }

    updateForm(data: any) {
        this._webService.putMovimiento(data.id, data).subscribe(
            (response) => {
                const respData = response.data;

                this.messageService.add({
                    severity: 'success',
                    summary: 'ÉXITO',
                    detail: 'Actualizado con éxito',
                    life: 3000,
                });

                this.formSubmitted = false;
                this.loadingSubmit = false;

                this.resetForm();

                this.onClose({
                    type: 'updated',
                    data: respData,
                });
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

                this.loadingSubmit = false;
            }
        );
    }

    changeTipo() {
        switch (this.registerForm.value.tipo) {
            case 'E':
                this.listMotivos = [{ value: 'COMPRA', label: 'COMPRA' }];
                this.registerForm.get('almacen_origen')?.disable();
                this.registerForm.get('almacen_destino')?.enable();
                break;
            case 'S':
                this.listMotivos = [{ value: 'VENTA', label: 'VENTA' }];
                this.registerForm.get('almacen_origen')?.enable();
                this.registerForm.get('almacen_destino')?.disable();
                break;
        }
    }

    changeProducto() {
        const producto = this.registerForm.value.producto;

        this.registerForm.get('unidad_medida')?.setValue(null);

        if (producto == null) return;

        this.registerForm
            .get('unidad_medida')
            ?.setValue(producto.unidad_medida);
    }

    isInvalid(controlName: string) {
        const control = this.registerForm.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    onClose(data: any = null) {
        this.ref.close(data);
    }
}
