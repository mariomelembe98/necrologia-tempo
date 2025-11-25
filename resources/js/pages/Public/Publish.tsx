import { Head } from '@inertiajs/react';

import PublishPage from '@/components/public/publish-page';
import PublicLayout from '@/layouts/public-layout';

interface PublishPageProps {
    plans: {
        id: number;
        name: string;
        slug: string;
        type: 'homenagem' | 'comunicado' | 'outros';
        duration_days: number;
        price_mt: number;
    }[];
}

export default function PublishPageScreen({ plans }: PublishPageProps) {
    return (
        <PublicLayout>
            <Head title="Publicar Anúncio" />
            <PublishPage plans={plans} />
        </PublicLayout>
    );
}

