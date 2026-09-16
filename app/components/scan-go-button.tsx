'use client';

import type { ButtonHTMLAttributes } from 'react';

import { useScanModal } from './scan-modal-context';

type ScanGoButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
    destination?: string;
};

export function ScanGoButton({ destination, className, ...rest }: ScanGoButtonProps) {
    const { open } = useScanModal();

    return (
        <button
            type="button"
            onClick={() => open(destination)}
            className={`cursor-pointer ${className ?? ''}`}
            {...rest}
        />
    );
}
