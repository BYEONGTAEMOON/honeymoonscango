export function SectionCard({
    title,
    description,
    action,
    dimmed = false,
    children,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    dimmed?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
                </div>
                {action}
            </div>
            <div className={`mt-4 space-y-4 ${dimmed ? 'opacity-50' : ''}`}>{children}</div>
        </div>
    );
}
