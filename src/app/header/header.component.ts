import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupActiveMenuHighlight();
    this.closeMenuOnNavigation();
  }

  private setupActiveMenuHighlight(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentURL = this.router.url;
      const menuItems = document.querySelectorAll('.menuText');

      menuItems.forEach((item: Element) => {
        const linkURL = (item as HTMLAnchorElement).getAttribute('href') || '';

        if (currentURL === '/' && linkURL === '/') {
          item.classList.add('active');
        } else if (currentURL.includes(linkURL) && linkURL !== '/') {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }

  private closeMenuOnNavigation(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  }
}
