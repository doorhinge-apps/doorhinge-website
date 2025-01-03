import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scrolling-apps',
  templateUrl: './scrolling-apps.component.html',
  styleUrls: ['./scrolling-apps.component.css']
})
export class ScrollingAppsComponent implements OnInit {

  /**
   * Array of image URLs to display.
   */
  @Input() images: string[] = [
    "Images/App Icons/DH Chat.png",
    "Images/App Icons/Aura.png",
    "Images/App Icons/SF Folders.png",
    "Images/App Icons/DH Parkour.png",
    "Images/App Icons/MacLibrary.png",
    "Images/App Icons/CelsiUSA.png"
  ];

  /**
   * Offset parameter to start at a specific position (0-based).
   */
  @Input() offset: number = 0;

  /**
   * Speed parameter to control the animation duration (seconds).
   */
  @Input() speed: number = 10;

  /**
   * How many times to duplicate the offset array.
   * 2 is usually enough for a seamless loop, but you asked for 4.
   */
  private numberOfCycles = 4;

  /**
   * The final list of images displayed in the template
   * (offset applied + repeated cycles).
   */
  repeatedImages: string[] = [];

  /**
   * We only animate the height of a single cycle, i.e., the
   * original (offset) array length * 100 px each.
   */
  scrollDistancePx = 0;

  /**
   * Height (in px) of each icon.
   */
  private readonly itemHeight = 110;

  ngOnInit(): void {
    if (!this.images || this.images.length === 0) {
      console.error("ScrollingAppsComponent: 'images' is empty.");
      return;
    }

    this.setupRepeatedImages();
  }

  /**
   * Reorders the array based on offset, duplicates it,
   * and sets the scroll distance for one cycle.
   */
  private setupRepeatedImages(): void {
    // 1. Reorder the original array by offset
    const total = this.images.length;
    const offsetIndex = this.offset % total;
    const offsetArray = [
      ...this.images.slice(offsetIndex),
      ...this.images.slice(0, offsetIndex)
    ];

    // 2. Repeat that offset array multiple times
    //    so we have plenty of images in the DOM
    this.repeatedImages = [];
    for (let i = 0; i < this.numberOfCycles; i++) {
      this.repeatedImages.push(...offsetArray);
    }

    // 3. The actual distance to animate is ONLY
    //    the height of one offsetArray cycle (not all 4).
    this.scrollDistancePx = offsetArray.length * this.itemHeight;
  }
}
