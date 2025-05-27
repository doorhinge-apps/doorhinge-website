import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

interface Section {
  colors: [string,string];
  heights: {
    desktop: string;
    mobile:   string;
  };
  direction: 1 | -1;
  clipPath: string;
  top?:    number;
  pxHeight?: number;
}


@Component({
    selector: 'app-aura',
    templateUrl: './aura.component.html',
    styleUrls: ['./aura.component.css'],
})
export class AuraComponent implements OnInit, AfterViewInit {
    private readonly A = 70;
    private readonly λ = 1000;
    private readonly N = Math.ceil(window.innerWidth / 4);

    sections: Section[] = [
        {
            colors: ['#D0B1F9', '#D0B1F9'],
            heights: { desktop: '90vh', mobile: '90vh' },
            direction: 1,
            clipPath: '',
        },
        {
            colors: ['#998DEE', '#C5BDFF'],
            heights: { desktop: '70vh', mobile: '70vh' },
            direction: -1,
            clipPath: '',
        },
        {
            colors: ['#8A7BF9', '#C8C0FF'],
            heights: { desktop: '70vh', mobile: '900px' },
            direction: 1,
            clipPath: '',
        },
        {
            colors: ['#8E62F4', '#BA9DFE'],
            heights: { desktop: '70vh', mobile: '70vh' },
            direction: -1,
            clipPath: '',
        },
        {
            colors: ['#8E62F4', '#BA9DFE'],
            heights: { desktop: '70vh', mobile: '70vh' },
            direction: 1,
            clipPath: '',
        },
    ];

    ngOnInit(): void {
        this.cacheGeometry();
        this.recomputeClipPaths(window.scrollY);
    }

    ngAfterViewInit(): void {
        requestAnimationFrame(() => {
            this.cacheGeometry();
            this.recomputeClipPaths(window.scrollY);
        });
    }

    @HostListener('window:scroll') onScroll() {
        this.recomputeClipPaths(window.scrollY);
    }
    @HostListener('window:resize') onResize() {
        this.cacheGeometry();
        this.onScroll();
    }

    getHeight(s: Section): string {
    return window.innerWidth <= 800
      ? s.heights.mobile
      : s.heights.desktop;
  }

    private cacheGeometry(): void {
        const els = Array.from(
            document.querySelectorAll<HTMLElement>('section.section'),
        );
        els.forEach((el, i) => {
            const r = el.getBoundingClientRect();
            this.sections[i].top = r.top + window.scrollY;
            this.sections[i].pxHeight = el.offsetHeight;
        });
    }

    private recomputeClipPaths(scrollTop: number): void {
        const vw = window.innerWidth;
        const winH = window.innerHeight;
        const maxShift = vw * 2;

        const viewportBottom = scrollTop + winH;

        this.sections.forEach((s) => {
            if (s.top == null || s.pxHeight == null) return;

            const sectionBottom = s.top + s.pxHeight;

            const startAt = sectionBottom - winH;
            const endAt = sectionBottom;
            const span = winH || 1;

            let p = (scrollTop - startAt) / span;
            p = Math.min(1, Math.max(0, p));

            const offset = -s.direction * p * maxShift;
            s.clipPath = this.makeClipPath(vw, s.pxHeight, offset);
        });
    }

    private makeClipPath(vw: number, h: number, phasePx: number): string {
        const dx = 4;
        const pts: string[] = [];

        for (let x = vw; x >= 0; x -= dx) {
            const y = this.waveY(x + phasePx, h);
            pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        }

        const path = `M0 0 H${vw} V${h} L${pts.join(' ')} L0 ${h} Z`;
        return `path('${path}')`;
    }

    private waveY(x: number, h: number): number {
        return h - (this.A * (1 + Math.sin((2 * Math.PI * x) / this.λ))) / 2;
    }
}
