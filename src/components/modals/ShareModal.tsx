import { useState } from 'react';
import { X, Mail, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
    location: string;
}

export function ShareModal({ isOpen, onClose, url, title, location }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const shareText = `Check out this property: ${title} in ${location}`;

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon />,
            color: 'bg-[#25D366]',
            href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`
        },
        {
            name: 'Facebook',
            icon: <Facebook className="w-6 h-6" />,
            color: 'bg-[#1877F2]',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: 'X',
            icon: <Twitter className="w-6 h-6" />,
            color: 'bg-[#000000]',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
        },
        {
            name: 'Email',
            icon: <Mail className="w-6 h-6" />,
            color: 'bg-slate-600',
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + ' ' + url)}`
        }
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-[#1A1A1A] text-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-2 flex justify-between items-center">
                    <h3 className="text-xl font-medium text-white/90">Share</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Social Icons Container */}
                <div className="px-6 py-6 border-b border-white/5">
                    <div className="flex justify-between items-center overflow-x-auto pb-2 gap-4 no-scrollbar">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group shrink-0"
                            >
                                <div className={`w-14 h-14 ${social.color} rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                                    {social.icon}
                                </div>
                                <span className="text-xs text-white/60 group-hover:text-white/90 font-medium">{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Copy Link Section */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-sky-500/50 transition-colors">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm text-white/80 whitespace-nowrap overflow-ellipsis">
                                {url}
                            </p>
                        </div>
                        <Button
                            onClick={handleCopy}
                            className={`ml-3 px-6 py-2 rounded-full text-sm font-bold transition-all ${copied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
                                }`}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background overlay click-to-close */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
}

// Custom simple WhatsApp Icon since lucide doesn't have it
function WhatsAppIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 fill-white stroke-none"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.602a11.834 11.834 0 005.937 1.587h.005c6.635 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.524-8.503z" />
        </svg>
    );
}
