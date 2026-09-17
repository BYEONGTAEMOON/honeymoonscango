import { getScenarioWithStatus } from '@/lib/scenario-store';

import { ContentConfigForm } from './content-config-form';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
    const { scenario, error } = await getScenarioWithStatus();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">메인화면 컨텐츠</h1>
            <p className="mt-1 text-sm text-gray-500">
                홈페이지에 노출되는 숙소 이미지와 문구를 관리하세요. 저장하면 바로 사이트에 반영돼요.
            </p>

            {error && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    데이터베이스가 아직 연결되지 않았어요. 지금은 기본값을 보여드리고 있고, 여기서 저장해도 DB 연결 전까지는
                    반영되지 않아요. ({error})
                </div>
            )}

            <div className="mt-6">
                <ContentConfigForm initialScenario={scenario} />
            </div>
        </div>
    );
}
