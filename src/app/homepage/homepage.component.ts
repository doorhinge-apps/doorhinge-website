import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'], // Corrected to 'styleUrls'
    standalone: false,
})
export class HomepageComponent implements OnInit {
    gridItems: string[] = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);
    gridCols: number = 1;
    isOpen = false; // Dropdown open state
    activeDropdown: string | null = null;

    @ViewChild('dropdown') dropdown!: ElementRef; // Reference to the dropdown container

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.updateGridColumns();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.updateGridColumns();
    }

    updateGridColumns(): void {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 650) {
            this.gridCols = 1;
        } else if (screenWidth <= 1200) {
            this.gridCols = Math.min(2, Math.floor(screenWidth / 450));
        } else {
            this.gridCols = Math.min(3, Math.floor(screenWidth / 450));
        }
    }

    toggleDropdown(id: string, ev: Event): void {
        ev.stopPropagation(); // keep the click local
        this.activeDropdown = this.activeDropdown === id ? null : id;
    }

    @HostListener('document:click', ['$event'])
    closeOnOutsideClick(ev: MouseEvent): void {
        // close the menu only if the click was outside any .dropdown-container
        if (!(ev.target as HTMLElement).closest('.dropdown-container')) {
            this.activeDropdown = null;
        }
    }
}
