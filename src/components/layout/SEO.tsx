import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
}

export function SEO({ title, description }: SEOProps) {
    useEffect(() => {
        // Set document title
        document.title = `${title} | MakeMyStay.ai`;

        // Set or update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

        // Cleanup function to reset title when component unmounts (optional)
        return () => {
            document.title = 'MakeMyStay.ai';
        };
    }, [title, description]);

    return null;
}
