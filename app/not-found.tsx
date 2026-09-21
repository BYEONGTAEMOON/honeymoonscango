import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-gray-400">404</p>
            <h1 className="text-3xl font-extrabold text-gray-900">페이지를 찾을 수 없어요</h1>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                요청하신 페이지가 삭제되었거나 주소가 변경되었어요.
                <br />
                허니문 스캔GO 홈에서 원하는 정보를 다시 찾아보세요.
            </p>
            <Link
                href="/"
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
                홈으로 돌아가기
            </Link>
        </main>
    );
}
