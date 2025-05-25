import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';

interface Line {
    top: number; // current vertical position, in percent of the .square height
    color: string; // current stripe’s color
}

@Component({
    selector: 'app-gradient-lines',
    templateUrl: './gradient-lines.component.html',
    styleUrls: ['./gradient-lines.component.scss'],
    standalone: false,
})
export class GradientLinesComponent implements OnInit, OnDestroy {
    /** Number of “stops” in one half of the gradient (pink->purple or purple->pink) */
    @Input() numberOfLines = 15;
    /** Gradient start color */
    @Input() startColor = '#FF6EFA';
    /** Gradient end color */
    @Input() endColor = '#A388FF';
    /**
     * Pixel speed (how many “percentage‐units” the lines move per animation frame).
     * Adjust or make more sophisticated to control actual velocity over time.
     */
    @Input() speed = 0.08;

    /** All the active lines currently on screen (and possibly above/below). */
    lines: Line[] = [];

    /** Height (in px) of the square — locked to 100, but stored for reference. */
    readonly containerSize = 100;

    /** The height of each line (and the gap) in % of the container. */
    lineThickness = 0;

    /** RequestAnimationFrame ID so we can cancel on destroy */
    private animFrameId: number | null = null;

    /** Holds a repeating sequence of colors: pink->purple->pink->purple->... */
    private colorCycle: string[] = [];
    /** Index pointing to the next color in colorCycle. */
    private colorIndex = 0;

    ngOnInit(): void {
        // 1) Compute how thick each line is so that line thickness == gap thickness
        //    and the sum of all lines + gaps exactly fills 100%.
        //
        //    If we place M lines across the container with a gap of the same size
        //    as the line, the pattern is (line + gap + line + gap + ...).
        //    In total, for M lines, we have M lines and (M - 1) gaps, so
        //       total = M * thickness + (M - 1) * thickness = (2M - 1) * thickness
        //    We want that to be 100% of the container (which is 100px high).
        //    So thickness = 100 / (2M - 1).
        //    We’ll use “M = numberOfLines” for one full gradient step.  However,
        //    we’ll actually have more lines on screen because the gradient repeats.
        //
        this.lineThickness = 100 / (2 * this.numberOfLines - 1);

        // 2) Build a color array that goes from start->end->start->end->...,
        //    so the gradient repeatedly reverses.
        //    For example, if numberOfLines=3 (start->end->start), we might get
        //      [startColor, midColor, endColor, midColor, startColor, midColor, endColor, ...]
        //    repeated infinitely.  For simplicity here, we’ll just build enough
        //    and cycle through them in a loop.
        this.buildColorCycle();

        // 3) Initialize enough lines so that we fill the entire square plus
        //    some lines above the top so we have a continuous feed.
        //    We’ll place them with decreasing top so that the “lowest” line is at top=0
        //    and we keep going up in increments of lineThickness*2 for spacing+gap.
        this.initializeLines();

        // 4) Start the animation loop
        this.startAnimation();
    }

    ngOnDestroy(): void {
        this.stopAnimation();
    }

    /**
     * Creates a large “colorCycle” array that goes:
     *   start -> end -> start -> end -> ...
     * for multiple cycles.  Each single “forward” or “reverse” step has
     * `numberOfLines` stops, so for forward+reverse that’s ~2 * numberOfLines - 2
     * unique transitions.  We’ll build a bigger array so we can just keep reusing.
     */
    private buildColorCycle(): void {
        const forwardColors = this.buildGradient(
            this.startColor,
            this.endColor,
            this.numberOfLines,
        );
        const reverseColors = this.buildGradient(
            this.endColor,
            this.startColor,
            this.numberOfLines,
        );

        // Each of those arrays includes both endpoints, so we’d double-count one color
        // if we just concatenated them. Let’s slice off the last color of “forward”
        // when appending “reverse” so we don’t repeat it, and vice versa.
        // Then repeat the pattern a handful of times (just to avoid edge cases).
        const singleCycle = [
            ...forwardColors.slice(0, -1),
            ...reverseColors.slice(0, -1),
        ];
        // Repeat that pattern several times so we have a big array to cycle through
        this.colorCycle = Array(5) // e.g. 5 repeats
            .fill(null)
            .reduce<string[]>((acc) => [...acc, ...singleCycle], []);
    }

    /**
     * Build an array of `count` color stops going from hex `c1` to `c2` inclusive.
     * E.g., if count=3, we get [c1, midpoint, c2].
     */
    private buildGradient(c1: string, c2: string, count: number): string[] {
        if (count <= 1) {
            return [c1];
        }
        const results: string[] = [];
        for (let i = 0; i < count; i++) {
            const factor = i / (count - 1);
            results.push(this.interpolateColor(c1, c2, factor));
        }
        return results;
    }

    private interpolateColor(hex1: string, hex2: string, t: number): string {
        // Convert hex to RGB
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);
        // Interpolate each channel
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
        return `rgb(${r},${g},${b})`;
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } {
        const stripped = hex.replace(/^#/, '');
        const num = parseInt(stripped, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255,
        };
    }

    /**
     * Fill `this.lines` so that they completely cover the square (top=0 to top=100)
     * and also extend above it for a continuous supply.  Each line is separated
     * from the next by lineThickness (for the line) + lineThickness (for the gap).
     * Because we’re scrolling downward, we start from the bottom line at top=0,
     * then move upwards in negative top increments.
     */
    private initializeLines(): void {
        // Estimate the total number of lines needed to cover the entire square + extras for seamless animation
        const neededLines = Math.ceil(
            (this.containerSize * 2) / (2 * this.lineThickness),
        ); // Covering diagonal is ~1414px

        // Start from the bottom (top=0) and move upward
        let currentTop = 0;
        for (let i = 0; i < neededLines; i++) {
            this.lines.push({
                top: currentTop,
                color: this.getNextColor(),
            });

            // Move each line upward by 2*lineThickness (line height + gap)
            currentTop -= 2 * this.lineThickness;
        }

        // Adjust all lines to pre-fill the square
        this.lines.forEach((line) => {
            line.top += this.containerSize; // Offset to make the square fully filled
        });
    }

    /** Returns the next color from colorCycle, advancing colorIndex in a wraparound way. */
    private getNextColor(): string {
        const color = this.colorCycle[this.colorIndex % this.colorCycle.length];
        this.colorIndex++;
        return color;
    }

    private startAnimation() {
        const animate = () => {
            this.updateLines();
            this.animFrameId = requestAnimationFrame(animate);
        };
        this.animFrameId = requestAnimationFrame(animate);
    }

    private stopAnimation() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    /**
     * Move each line downward by `speed`.
     * If a line goes beyond top=100%, remove it from the array and re‐insert it
     * at the top (with a negative top) so it smoothly continues the cycle.
     */
    private updateLines(): void {
        const outOfViewThreshold = 100 + this.lineThickness; // once it’s fully out

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].top += this.speed;

            if (this.lines[i].top > outOfViewThreshold) {
                // This line is now fully off the bottom. Remove it and re-insert
                // up at the top. The topmost line likely has a 'top' around the
                // smallest top value in the array, so we can place a new one
                // just above it.  Or simpler: place it at top = (current min top) - 2*lineThickness.
                const goneLine = this.lines.splice(i, 1)[0];
                i--; // adjust index because we removed one

                // Find the smallest top among the remaining lines:
                const minTop = Math.min(...this.lines.map((l) => l.top));
                goneLine.top = minTop - 2 * this.lineThickness;
                goneLine.color = this.getNextColor();
                this.lines.push(goneLine);
            }
        }
    }
}
