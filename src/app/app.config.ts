import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import esLocaleData from 'primelocale/es.json';

import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        providePrimeNG({
            translation: esLocaleData.es,
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-theme-dark',
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng',
                    },
                },
            },
        }),
        provideHttpClient(withFetch()),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
    ],
};
