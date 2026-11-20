import { redirect } from 'next/navigation';

type PageProps = { params: Promise<{ type: string }> };

/**
 * /rent/1bhk → /rent/1bhk/bangalore
 * Keeps the BHK type in the URL so the full [type]/[area] page handles it.
 */
export default async function RentTypeCityRedirect({ params }: PageProps) {
    const { type } = await params;
    redirect(`/rent/${type.toLowerCase()}/bangalore`);
}
