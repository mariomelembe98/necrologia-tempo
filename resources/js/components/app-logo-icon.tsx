import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...rest
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...rest}
            className={cn('inline-flex items-center', className)}
        >
            <img
                src="/images/logo/logo-vermelho.png"
                alt="Tempo Necrologia"
                className="h-full w-auto dark:hidden"
            />
            <img
                src="/images/logo/logo-branco.png"
                alt="Tempo Necrologia"
                className="hidden h-full w-auto dark:block"
            />
        </span>
    );
}
