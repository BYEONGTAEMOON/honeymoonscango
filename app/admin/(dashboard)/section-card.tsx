export function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-900">{title}</p>
            {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
            <div className="mt-4 space-y-4">{children}</div>
        </div>
    );
}
