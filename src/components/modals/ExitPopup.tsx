import React, { useState, useEffect } from 'react';
import { LeadCaptureModal } from './LeadCaptureModal';

export const ExitPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown in this session
        const shown = sessionStorage.getItem('exit_popup_shown');
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseOut = (e: MouseEvent) => {
            // Trigger when mouse leaves the top of the window (intent to close/change tab)
            if (e.clientY <= 0 && !hasShown) {
                setIsOpen(true);
                setHasShown(true);
                sessionStorage.setItem('exit_popup_shown', 'true');
            }
        };

        // Also trigger after a long dwell time (45s)
        const timer = setTimeout(() => {
            if (!hasShown) {
                setIsOpen(true);
                setHasShown(true);
                sessionStorage.setItem('exit_popup_shown', 'true');
            }
        }, 45000);

        document.addEventListener('mouseleave', handleMouseOut);

        return () => {
            document.removeEventListener('mouseleave', handleMouseOut);
            clearTimeout(timer);
        };
    }, [hasShown]);

    return (
        <LeadCaptureModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Wait! Don't Miss Out 🚀"
            subtitle="Get our exclusive 'PG Growth Playbook' & see how we help operators increase occupancy by 30% in just 30 days."
            source="Website - Exit Popup"
            actionLabel="Send Me the Playbook"
        />
    );
};
