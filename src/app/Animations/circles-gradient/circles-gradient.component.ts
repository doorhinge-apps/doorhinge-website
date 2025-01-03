import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';

interface Circle {
  size: number;
}

@Component({
    selector: 'app-circles-gradient',
    templateUrl: './circles-gradient.component.html',
    styleUrls: ['./circles-gradient.component.css'],
    standalone: false
})
export class CirclesGradientComponent implements OnInit, OnDestroy {
  @Input() circleSize: number = 30; // Diameter of each circle
  @Input() circleGap: number = 40; // Gap between circles
  @Input() growthRate: number = 2; // Growth rate in pixels per frame
  @Input() animationSpeed: number = 0.2; // Multiplier for the animation speed

  circles: Circle[] = [];
  private animationFrame: number = 0;

  @HostListener('window:resize')
  onResize() {
    // Optional: Handle resize logic if needed
  }

  ngOnInit() {
    // Increase animation speed initially for a "pop" effect
    this.animationSpeed = 20;
    setTimeout(() => {
      this.animationSpeed = 0.3;
    }, 200);

    this.animate();
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private animate() {
    this.updateCircles();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  private updateCircles() {
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) / 2;

    // Create a new circle once the last one has grown enough
    if (
      this.circles.length === 0 ||
      this.circles[this.circles.length - 1].size >= this.circleGap
    ) {
      this.circles.push({ size: 0 });
    }

    // Update circle sizes
    this.circles = this.circles
      .map(circle => ({
        size: circle.size + this.growthRate * this.animationSpeed
      }))
      .filter(circle => circle.size <= maxRadius);
  }

  /**
   * The container style ensures its center is at the left edge of the screen
   * and only the right half is visible via clip-path.
   */
  getContainerStyle() {
    return {
      position: 'absolute',
      top: '50%',
      left: 0,
      // Move left by half its width (50vh) and up by half its height
      transform: 'translate(-50vh, -50%)',
      width: '100vh',
      height: '100vh',
      borderRadius: '50%',
      // Show only the right half
      clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
      overflow: 'hidden'
    };
  }

  /**
   * Each circle is absolutely positioned dead-center inside the container.
   */
  getCircleStyle(circle: Circle) {
    const diameter = `${circle.size * 2}px`;
    return {
      position: 'absolute',
      width: diameter,
      height: diameter,
      left: '50%',
      top: '50%',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
}
