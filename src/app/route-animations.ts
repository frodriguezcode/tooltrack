import { animate, style, transition, trigger, query, group } from '@angular/animations';

export const fadeRouteAnimation = trigger('fadeRouteAnimation', [
  transition('* <=> *', [
    // Opcional: aísla la altura para evitar "saltos"
    query(':enter, :leave', [
      style({ position: 'absolute', left: 0, right: 0, top: 0 })
    ], { optional: true }),

    group([
      query(':leave', [
        style({ opacity: 1 }),
        animate('5000ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('220ms 60ms ease-out', style({ opacity: 1 }))
      ], { optional: true }),
    ])
  ])
]);
