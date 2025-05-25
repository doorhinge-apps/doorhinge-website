import {
    Component,
    OnInit,
    AfterViewInit,
    Renderer2,
    ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit, AfterViewInit {
    markdownContent: string = '';
    gifSrc: string = 'assets/Images/eyeball.gif'; // Adjust path accordingly

    constructor(
        private http: HttpClient,
        private renderer: Renderer2,
        private elRef: ElementRef,
    ) {}

    ngOnInit(): void {
        this.http
            .get('/assets/privacypolicies/dhprivacy.md', {
                responseType: 'text',
            })
            .subscribe((data) => (this.markdownContent = data));
    }

    ngAfterViewInit(): void {
        this.processGif();
    }

    processGif(): void {
        const img = new Image();
        img.src = this.gifSrc;
        img.crossOrigin = 'Anonymous'; // Needed if image is loaded from a different domain

        img.onload = () => {
            const canvas = this.renderer.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                // Convert dark pixels to white while keeping transparency
                if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
                    data[i] = 255; // Red
                    data[i + 1] = 255; // Green
                    data[i + 2] = 255; // Blue
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Append the canvas to the component (replace original GIF)
            const gifContainer =
                this.elRef.nativeElement.querySelector('#gif-container');
            this.renderer.appendChild(gifContainer, canvas);
        };
    }
}
