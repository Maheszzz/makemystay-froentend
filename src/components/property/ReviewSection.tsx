import { useState } from 'react';
import { Star, MessageSquare, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Review } from '@/types/api';
import { api } from '@/lib/api/client';

interface ReviewSectionProps {
    propertyId: string | number;
    initialReviews: Review[];
    onReviewAdded?: () => void;
}

export function ReviewSection({ propertyId, initialReviews, onReviewAdded }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!userName.trim()) {
            setError('Please enter your name');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const newReview = await api.post<Review>(`/realty/properties/${propertyId}/reviews`, {
                rating,
                user_name: userName,
                comment: comment.trim() || undefined
            });

            setReviews([newReview, ...reviews]);
            setRating(0);
            setUserName('');
            setComment('');
            if (onReviewAdded) onReviewAdded();
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-slate-900 border-l-4 border-brand-red pl-4">Reviews & Ratings</h3>
                <div className="self-start md:self-auto flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">
                        {reviews.length > 0
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                            : 'N/A'}
                    </span>
                    <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
                </div>
            </div>

            {/* Review Form */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-white shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-brand-red" />
                    Share your experience
                </h4>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-125 duration-200"
                                >
                                    <Star
                                        className={`w-8 h-8 ${(hoverRating || rating) >= star
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="user_name" className="block text-sm font-semibold text-slate-700">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="user_name"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comment" className="block text-sm font-semibold text-slate-700">Your Review (Optional)</label>
                        <textarea
                            id="comment"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you loved about this place..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-medium resize-none"
                        ></textarea>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium animate-shake">{error}</p>}

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center"
                    >
                        {submitting ? 'Submitting...' : (
                            <>
                                Post Review <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg mr-4 border-2 border-white shadow-sm">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">{review.user_name}</h5>
                                        <p className="text-xs text-slate-400 font-medium">
                                            {new Date(review.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${review.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-slate-600 leading-relaxed font-medium pl-16">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
