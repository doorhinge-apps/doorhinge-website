import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent {
    currentYear: number;

    constructor() {
        this.currentYear = new Date().getFullYear();
    }
}
