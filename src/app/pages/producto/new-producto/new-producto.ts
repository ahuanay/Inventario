import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { WebService } from '../../../service/web-service';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { parse, stringify } from 'flatted';

@Component({
    selector: 'app-new-producto',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        FileUploadModule,
        ImageModule,
        InputNumberModule,
        InputTextModule,
        MessageModule,
        SelectModule,
        TextareaModule,
        ToastModule,
        ToggleSwitchModule,
    ],
    templateUrl: './new-producto.html',
    styleUrl: './new-producto.css',
})
export class NewProducto implements OnInit {
    messageService = inject(MessageService);

    public registerForm: FormGroup = new FormGroup({});

    public formSubmitted = false;
    public loadingSubmit = false;

    public node: any = null;

    public listUnidadMedidas: any[] = [];

    public descripcionLength = 0;
    public descripcionLengthMax = 500;

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

        this.listUnidadMedidas = [
            { label: 'CAJA', value: 'caja' },
            { label: 'KILOGRAMO', value: 'kg' },
            { label: 'LITRO', value: 'L' },
            { label: 'METRO', value: 'm' },
            { label: 'UNIDAD', value: 'und' },
        ];

        if (this.node != null) {
            this.initUpdateData();
        }
    }

    initForm() {
        this.registerForm = this.fb.group({
            id: [null],
            es_activo: [null, Validators.required],
            codigo: [null, Validators.required],
            nombre: [null, Validators.required],
            nombre_largo: [null, Validators.required],
            descripcion: [null, Validators.required],
            img_base64: [null, Validators.required],
            unidad_medida: [null, Validators.required],
        });

        this.resetForm();
    }

    initUpdateData() {
        const data = this.node;

        this.registerForm.get('id')?.setValue(data.id);
        this.registerForm.get('es_activo')?.setValue(data.es_activo);
        this.registerForm.get('codigo')?.setValue(data.codigo);
        this.registerForm.get('nombre')?.setValue(data.nombre);
        this.registerForm.get('nombre_largo')?.setValue(data.nombre_largo);
        this.registerForm.get('descripcion')?.setValue(data.descripcion);
        this.registerForm.get('img_base64')?.setValue(data.img_base64);
        this.registerForm.get('unidad_medida')?.setValue(data.unidad_medida);
        this.registerForm.get('unidad_medida')?.disable();
    }

    resetForm() {
        this.formSubmitted = false;
        this.loadingSubmit = false;

        this.registerForm.reset({
            es_activo: true,
        });

        this.registerForm.get('unidad_medida')?.enable();
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
            es_activo: raw.es_activo,
            codigo: raw.codigo,
            nombre: raw.nombre,
            nombre_largo: raw.nombre_largo,
            descripcion: raw.descripcion,
            img_base64: raw.img_base64,
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
        this._webService.postProducto(data).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'ÉXITO',
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
        this._webService.putProducto(data.id, data).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'ÉXITO',
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

    setNombreLargo() {
        const raw = this.registerForm.getRawValue();

        this.registerForm
            .get('nombre_largo')
            ?.setValue(
                [
                    [raw.codigo, raw.nombre].filter(Boolean).join(' '),
                    raw.unidad_medida,
                ]
                    .filter(Boolean)
                    .join(' x ')
            );
    }

    public errorDimensionesImagen: any = false;
    onFileSelected(event: any) {
        const file: File = event.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;

                const img = new Image();
                img.onload = () => {
                    const width = img.width;
                    const height = img.height;

                    if (width !== 1000 || height !== 1000) {
                        this.errorDimensionesImagen = true;

                        this.registerForm.get('img_base64')?.setValue(null);
                    } else {
                        this.errorDimensionesImagen = false;
                        this.registerForm.get('img_base64')?.setValue(base64);
                    }
                };
                img.src = base64;
            };
            reader.readAsDataURL(file);
        }
    }

    isInvalid(controlName: string) {
        const control = this.registerForm.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    onClose(data: any = null) {
        this.ref.close(data);
    }
}
