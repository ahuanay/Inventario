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
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { parse, stringify } from 'flatted';

@Component({
    selector: 'app-new-almacen',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MessageModule,
        SelectModule,
        ToastModule,
        ToggleSwitchModule,
    ],
    templateUrl: './new-almacen.html',
    styleUrl: './new-almacen.css',
})
export class NewAlmacen implements OnInit {
    messageService = inject(MessageService);

    public registerForm: FormGroup = new FormGroup({});

    public formSubmitted = false;
    public loadingSubmit = false;

    public node: any = null;

    public listUbigeos: any[] = [];
    public listDepartamentos: any[] = [];
    public listProvincias: any[] = [];
    public listDistritos: any[] = [];

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

        forkJoin([this._webService.getUbigeos()]).subscribe(
            (responses: any[]) => {
                this.listUbigeos = responses[0];

                this.clasificarUbigeo();

                if (this.node != null) {
                    this.initUpdateData();
                }
            }
        );
    }

    initForm() {
        this.registerForm = this.fb.group({
            id: [null],
            es_activo: [null, Validators.required],
            codigo: [null, Validators.required],
            nombre: [null, Validators.required],
            departamento: [null, Validators.required],
            provincia: [null, Validators.required],
            distrito: [null, Validators.required],
            direccion: [null, Validators.required],
        });

        this.resetForm();
    }

    initUpdateData() {
        const data = this.node;

        this.registerForm.get('id')?.setValue(data.id);
        this.registerForm.get('es_activo')?.setValue(data.es_activo);
        this.registerForm.get('codigo')?.setValue(data.codigo);
        this.registerForm.get('nombre')?.setValue(data.nombre);

        const departamento =
            this.listDepartamentos.find(
                (e: any) => e.codigo == data.ubigeo_codigo_departamento
            ) ?? null;
        this.registerForm.get('departamento')?.setValue(departamento);

        const provincia =
            this.listProvincias.find(
                (e: any) => e.codigo == data.ubigeo_codigo_provincia
            ) ?? null;
        this.registerForm.get('provincia')?.setValue(provincia);

        const distrito =
            this.listDistritos.find(
                (e: any) => e.codigo == data.ubigeo_codigo_distrito
            ) ?? null;
        this.registerForm.get('distrito')?.setValue(distrito);

        this.registerForm.get('direccion')?.setValue(data.direccion);
    }

    resetForm() {
        this.formSubmitted = false;
        this.loadingSubmit = false;

        this.registerForm.reset({
            es_activo: true,
        });
    }

    clasificarUbigeo() {
        const departamentos: any[] = [];
        const provincias: any[] = [];
        const distritos: any[] = [];

        const ubigeos = this.listUbigeos;

        if (ubigeos) {
            ubigeos.forEach((item: any) => {
                const codigo = item.codigo;

                if (codigo.endsWith('0000')) {
                    departamentos.push(item);
                } else if (codigo.endsWith('00')) {
                    provincias.push(item);
                } else {
                    distritos.push(item);
                }
            });
        }

        this.listDepartamentos = this.ordenarPorNombre(departamentos);
        this.listProvincias = this.ordenarPorNombre(provincias);
        this.listDistritos = this.ordenarPorNombre(distritos);
    }

    ordenarPorNombre(array: any[]) {
        return array.slice().sort((a: any, b: any) => {
            return a.nombre.localeCompare(b.nombre, 'es', {
                sensitivity: 'base',
            });
        });
    }

    getProvinciasByDetartamento() {
        const departamento = this.registerForm.value.departamento;

        if (departamento == null) return [];

        const codigoDeptoBase = departamento.codigo.slice(0, 2);

        return this.listProvincias.filter((item) => {
            const codigo = item.codigo;
            return (
                codigo.endsWith('00') &&
                !codigo.endsWith('0000') &&
                codigo.startsWith(codigoDeptoBase)
            );
        });
    }

    getDistritosByProvincia() {
        const provincia = this.registerForm.value.provincia;

        if (provincia == null) return [];

        const codigoProvBase = provincia.codigo.slice(0, 4);

        return this.listDistritos.filter((item) => {
            const codigo = item.codigo;

            return !codigo.endsWith('00') && codigo.startsWith(codigoProvBase);
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        this.loadingSubmit = true;

        if (this.registerForm.invalid) {
            this.loadingSubmit = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Complete los campos',
                life: 3000,
            });
            return;
        }

        const raw = this.registerForm.getRawValue();

        let data: any = {
            id: raw.id ?? null,
            es_activo: raw.es_activo,
            codigo: raw.codigo,
            nombre: raw.nombre,
            ubigeo_codigo_departamento: raw.departamento?.codigo ?? null,
            ubigeo_codigo_provincia: raw.provincia?.codigo ?? null,
            ubigeo_codigo_distrito: raw.distrito?.codigo ?? null,
            ubigeo_nombre: [
                raw.departamento?.nombre,
                raw.provincia?.nombre,
                raw.distrito?.nombre,
            ]
                .filter(Boolean)
                .join('/'),
            direccion: raw.direccion,
        };

        if (data.id == null) {
            delete data.id;
            this.saveForm(data);
        } else {
            this.updateForm(data);
        }
    }

    saveForm(data: any) {
        this._webService.postAlmacen(data).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Guardado con éxito',
                    life: 3000,
                });

                this.resetForm();

                this.onClose({
                    type: 'created',
                    data: response,
                });
            },
            (error) => {}
        );
    }

    updateForm(data: any) {
        this._webService.putAlmacen(data.id, data).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Actualizado con éxito',
                    life: 3000,
                });

                this.resetForm();

                this.onClose({
                    type: 'updated',
                    data: response,
                });
            },
            (error) => {}
        );
    }

    isInvalid(controlName: string) {
        const control = this.registerForm.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    onClose(data: any = null) {
        this.ref.close(data);
    }
}
