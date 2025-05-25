import {
    animate,
    group,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        // Define the initial state for both `:enter` and `:leave`
        query(
            ':enter, :leave',
            style({ position: 'absolute', width: '100%', height: '100%' }),
            {
                optional: true,
            },
        ),
        // Perform door closing effect on `:leave`
        group([
            query(
                ':leave',
                [
                    style({
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    }),
                    animate(
                        '0.5s ease-in',
                        style({
                            clipPath:
                                'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
                        }), // Close doors
                    ),
                ],
                { optional: true },
            ),
        ]),
        // Perform door opening effect on `:enter`
        group([
            query(
                ':enter',
                [
                    style({
                        clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
                    }), // Doors closed
                    animate(
                        '0.5s ease-out',
                        style({
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                        }), // Open doors
                    ),
                ],
                { optional: true },
            ),
        ]),
    ]),
]);
