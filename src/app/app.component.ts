import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeRouteAnimation } from './route-animations';
import { LangService } from './core/lang.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  template: `
    <main [@fadeRouteAnimation]="getAnimationState(o)" class="route-container">
      <router-outlet #o="outlet"></router-outlet>
    </main>
  `,
  styleUrl: './app.component.scss',
  styles: [`.route-container{ position:relative; min-height:100vh; }`],
  animations: [fadeRouteAnimation]
})
export class AppComponent {
  constructor(private lang: LangService){ this.lang.init(); }

  title = 'tooltrack';
   getAnimationState(outlet: RouterOutlet) {
    return outlet?.activatedRoute?.snapshot?.routeConfig?.path ?? '';
  }
}
