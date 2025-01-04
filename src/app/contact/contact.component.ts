import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css',
    standalone: false
})
export class ContactComponent implements OnInit {
 gridItems: string[] = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);
  gridCols: number = 1;
  isOpen = false; // Dropdown open state

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

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the document
    this.isOpen = !this.isOpen;
  }

  onActionClick(action: string): void {
    console.log(`Selected: ${action}`);
    this.isOpen = false; // Close dropdown after selection
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const clickedInsideDropdown = this.dropdown.nativeElement.contains(event.target);
    if (!clickedInsideDropdown && this.isOpen) {
      this.isOpen = false; // Close dropdown if the click is outside the dropdown container
    }
  }
}
