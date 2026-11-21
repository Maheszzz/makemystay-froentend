import { redirect } from 'next/navigation';

// Permanent redirect: /1-bhk → /1bhk
// Consolidates duplicate routes so Google treats /1bhk as the single canonical URL.
export default function Page() {
    redirect('/1bhk');
}
