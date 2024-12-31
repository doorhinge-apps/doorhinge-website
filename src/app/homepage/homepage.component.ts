import { Component, HostListener, OnInit } from '@angular/core';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  gridItems: string[] = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);
  gridCols: number = 1;

  ngOnInit() {
    this.updateGridColumns();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateGridColumns();
  }

  updateGridColumns() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 650) {
      this.gridCols = 1;
    } else if (screenWidth <= 1200) {
      this.gridCols = Math.min(2, Math.floor(screenWidth / 450));
    } else {
      this.gridCols = Math.min(3, Math.floor(screenWidth / 450));
    }
  }
}