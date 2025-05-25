import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

interface Section {
    colors: [string, string];
    height: string;
    direction: 1 | -1;
    clipPath: string;
    top?: number;
    pxHeight?: number;
}

@Component({
    selector: 'app-aura',
    templateUrl: './aura.component.html',
    styleUrls: ['./aura.component.css'],
})
export class AuraComponent implements OnInit, AfterViewInit {
    /* ---- wave shape --------------------------------------------------- */
    private readonly A = 70; // amplitude ≥ 50 px
    private readonly λ = 1000; // wavelength ≥ 100 px
    // private readonly N = 80;      // samples per viewport
    private readonly N = Math.ceil(window.innerWidth / 4); // ≈ 4‑px resolution

    sections: Section[] = [
        {
            colors: ['#D0B1F9', '#D0B1F9'],
            height: '90vh',
            direction: 1,
            clipPath: '',
        },
        {
            colors: ['#998DEE', '#C5BDFF'],
            height: '70vh',
            direction: -1,
            clipPath: '',
        },
        {
            colors: ['#8A7BF9', '#B2A8FF'],
            height: '70vh',
            direction: 1,
            clipPath: '',
        },
        {
            colors: ['#8E62F4', '#BA9DFE'],
            height: '70vh',
            direction: -1,
            clipPath: '',
        },
        {
            colors: ['#8E62F4', '#BA9DFE'],
            height: '70vh',
            direction: 1,
            clipPath: '',
        },
    ];

    /* ------------ life‑cycle ------------------------------------------ */
    ngOnInit(): void {
        this.cacheGeometry();
        this.recomputeClipPaths(window.scrollY);
    }
    // ngAfterViewInit(): void { this.onScroll(); }
    ngAfterViewInit(): void {
        requestAnimationFrame(() => {
            this.cacheGeometry();
            this.recomputeClipPaths(window.scrollY);
        });
    }

    /* ------------ host listeners -------------------------------------- */
    @HostListener('window:scroll') onScroll() {
        this.recomputeClipPaths(window.scrollY);
    }
    @HostListener('window:resize') onResize() {
        this.cacheGeometry();
        this.onScroll();
    }

    /* ------------ core logic ------------------------------------------ */
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

    /**  progress: 0 when section‑bottom touches viewport‑bottom
     *             1 when section‑bottom touches viewport‑top               */
    private recomputeClipPaths(scrollTop: number): void {
        const vw = window.innerWidth;
        const winH = window.innerHeight;
        const maxShift = vw * 2; // ± travel

        const viewportBottom = scrollTop + winH;

        this.sections.forEach((s) => {
            if (s.top == null || s.pxHeight == null) return;

            const sectionBottom = s.top + s.pxHeight;

            /* start when bottom enters at viewport‑bottom, finish when bottom reaches viewport‑top */
            const startAt = sectionBottom - winH; // p = 0
            const endAt = sectionBottom; // p = 1
            const span = winH || 1; // = endAt - startAt

            let p = (scrollTop - startAt) / span; // raw progress
            p = Math.min(1, Math.max(0, p)); // clamp 0‑1

            const offset = -s.direction * p * maxShift;
            s.clipPath = this.makeClipPath(vw, s.pxHeight, offset);
        });
    }

    private makeClipPath(vw: number, h: number, phasePx: number): string {
        const dx = 4; // 4‑pixel steps  → very smooth
        const pts: string[] = [];

        /* Walk right→left so polygon remains clockwise */
        for (let x = vw; x >= 0; x -= dx) {
            const y = this.waveY(x + phasePx, h);
            pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        }

        /* Build CSS polygon‑path: top‑edge, right‑edge, sine, left‑edge */
        const path = `M0 0 H${vw} V${h} L${pts.join(' ')} L0 ${h} Z`;
        return `path('${path}')`;
    }

    private waveY(x: number, h: number): number {
        /* baseline at h‑A, crest at h (so wave always within section) */
        return h - (this.A * (1 + Math.sin((2 * Math.PI * x) / this.λ))) / 2;
    }
}
