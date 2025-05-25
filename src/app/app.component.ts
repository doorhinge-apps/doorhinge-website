import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routerTransition } from './animate';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [routerTransition],
})
export class AppComponent {
    getAnimationState(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
    }
}
