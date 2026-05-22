import type { Metadata } from 'next';
import { resolveRentSlugMetadata } from '@/lib/routeMetadata';
import RentSlugRoute from '@/routes/RentSlugRoute';


type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveRentSlugMetadata(slug);
}

export default function RentSlugPage() {
    return <RentSlugRoute />;
}
