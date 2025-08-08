import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WebService } from '../../service/web-service';
import { stringify, parse } from 'flatted';

@Component({
    selector: 'app-panel',
    imports: [RouterModule],
    templateUrl: './panel.html',
    styleUrl: './panel.css',
})
export class Panel implements OnInit {
    constructor(private _webService: WebService) {}

    ngOnInit(): void {
        this.getList();
    }

    getList() {}
}
