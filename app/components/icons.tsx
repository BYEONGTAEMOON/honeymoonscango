type IconProps = {
    className?: string;
};

export function SearchIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export function SuitcaseIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 7.5V5.8a1.8 1.8 0 011.8-1.8h3.4a1.8 1.8 0 011.8 1.8v1.7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3.5 12.5h17" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 12v1.6M13.5 12v1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function TicketIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M4 9a2 2 0 012-2h12a2 2 0 012 2v1.2a1.8 1.8 0 000 3.6V15a2 2 0 01-2 2H6a2 2 0 01-2-2v-1.2a1.8 1.8 0 000-3.6V9z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M14 7.5v9" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1.6 2" strokeLinecap="round" />
        </svg>
    );
}

export function PlaneIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M10.5 14.2L4 12l1-1.6 8 1.2 4.8-4.8a1.6 1.6 0 012.3 2.3l-4.8 4.8 1.2 8-1.6 1-2.2-6.5-4.4 4.4.3 2.4-1.3 1.3-1.6-3.4-3.4-1.6 1.3-1.3 2.4.3 4.4-4.4z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function MapPinIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 21s7-6.3 7-11.5A7 7 0 105 9.5C5 14.7 12 21 12 21z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

export function ShieldCheckIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 3l7 3v5.2c0 4.8-3 8.4-7 9.8-4-1.4-7-5-7-9.8V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M9 12l2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ClipboardCheckIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="5.5" y="4.5" width="13" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 4.5V4a2 2 0 012-2h2a2 2 0 012 2v.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 13l2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function GiftIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="4" y="9.5" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 13h16" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 9.5v10" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M12 9.5c-1.2 0-3.5-.4-3.5-2.4S10.2 4.7 12 6.6c1.8-1.9 3.5-.5 3.5.5 0 2-2.3 2.4-3.5 2.4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ClockIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 8v4.5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function StarIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8l-6.1 3.2 1.5-6.8-5.2-4.7 6.9-.7z" />
        </svg>
    );
}

export function CloseIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export function SendIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M3.5 12l17-8.5-6 17-3.2-6.8L3.5 12z" />
        </svg>
    );
}

export function CheckIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function GridIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

export function ListIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M8 6.5h12M8 12h12M8 17.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="4" cy="6.5" r="1.2" fill="currentColor" />
            <circle cx="4" cy="12" r="1.2" fill="currentColor" />
            <circle cx="4" cy="17.5" r="1.2" fill="currentColor" />
        </svg>
    );
}

export function LogoutIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M9 21H5.5A1.5 1.5 0 014 19.5v-15A1.5 1.5 0 015.5 3H9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M16 16l4.5-4-4.5-4M20 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ChatIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5.5A1.5 1.5 0 014 14.5v-9z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function UserIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4.5 20c1.2-3.8 4.3-6 7.5-6s6.3 2.2 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function ArrowRightIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
