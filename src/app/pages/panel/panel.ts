import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../service/web-service';

import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-panel',
    imports: [RouterModule, ChartModule],
    templateUrl: './panel.html',
    styleUrl: './panel.css',
})
export class Panel implements OnInit {
    public messageService = inject(MessageService);
    public platformId = inject(PLATFORM_ID);

    public chartDataEntrada: any;
    public chartDataSalida: any;
    public options: any;

    constructor(
        private _webService: WebService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getList();
    }

    getList() {
        this._webService.getAllMovimientos().subscribe(
            (response) => {
                const respData: any[] = response;

                const currentYear = new Date().getFullYear();

                const movimientos = respData.filter((mov) => {
                    if (!mov.created_at || mov.created_at.startsWith('0001'))
                        return false;
                    const fecha = new Date(mov.created_at);
                    return fecha.getFullYear() === currentYear;
                });

                if (isPlatformBrowser(this.platformId)) {
                    const documentStyle = getComputedStyle(
                        document.documentElement
                    );
                    const textColor =
                        documentStyle.getPropertyValue('--p-text-color');
                    const textColorSecondary = documentStyle.getPropertyValue(
                        '--p-text-muted-color'
                    );
                    const surfaceBorder = documentStyle.getPropertyValue(
                        '--p-content-border-color'
                    );

                    const meses = [
                        'Enero',
                        'Febrero',
                        'Marzo',
                        'Abril',
                        'Mayo',
                        'Junio',
                        'Julio',
                        'Agosto',
                        'Setiembre',
                        'Octubre',
                        'Noviembre',
                        'Diciembre',
                    ];

                    const entradas: Record<string, number[]> = {};
                    const salidas: Record<string, number[]> = {};

                    movimientos.forEach((mov) => {
                        const mes = new Date(mov.created_at).getMonth();
                        const nombre = mov.producto.nombre;

                        if (mov.tipo === 'E') {
                            if (!entradas[nombre])
                                entradas[nombre] = Array(12).fill(0);
                            entradas[nombre][mes] += mov.cantidad;
                        } else if (mov.tipo === 'S') {
                            if (!salidas[nombre])
                                salidas[nombre] = Array(12).fill(0);
                            salidas[nombre][mes] += mov.cantidad;
                        }
                    });

                    const datasetsEntradas = Object.entries(entradas).map(
                        ([nombre, data]) => ({
                            label: nombre,
                            backgroundColor: this.randomColor(),
                            borderColor: 'transparent',
                            data,
                        })
                    );

                    const datasetsSalidas = Object.entries(salidas).map(
                        ([nombre, data]) => ({
                            label: nombre,
                            backgroundColor: this.randomColor(),
                            borderColor: 'transparent',
                            data,
                        })
                    );

                    this.chartDataEntrada = {
                        labels: meses,
                        datasets: datasetsEntradas,
                    };

                    this.chartDataSalida = {
                        labels: meses,
                        datasets: datasetsSalidas,
                    };

                    this.options = {
                        maintainAspectRatio: false,
                        aspectRatio: 0.8,
                        plugins: {
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            },
                            legend: {
                                labels: {
                                    color: textColor,
                                },
                            },
                        },
                        scales: {
                            x: {
                                stacked: true,
                                ticks: {
                                    color: textColorSecondary,
                                },
                                grid: {
                                    color: surfaceBorder,
                                    drawBorder: false,
                                },
                            },
                            y: {
                                stacked: true,
                                ticks: {
                                    color: textColorSecondary,
                                },
                                grid: {
                                    color: surfaceBorder,
                                    drawBorder: false,
                                },
                            },
                        },
                    };

                    this.cd.markForCheck();
                }
            },
            (error) => {
                const respError: any[] = error.error?.errors || [
                    'Ocurrió un error. Por favor, consulte con su administrador.',
                ];

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

    randomColor(opacity = 0.8): string {
        const min = 70;
        const max = 180;
        const r = Math.floor(Math.random() * (max - min + 1)) + min;
        const g = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * (max - min + 1)) + min;
        return `rgba(${r},${g},${b},${opacity})`;
    }
}
