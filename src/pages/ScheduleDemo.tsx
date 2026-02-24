import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { contactApi } from '@/lib/api';

export default function ScheduleDemo() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Generate days for the current month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = [];
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        // Previous month padding
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, current: false });
        }

        // Current month days
        for (let i = 1; i <= lastDay; i++) {
            days.push({ day: i, current: true });
        }

        return days;
    };

    // Helper to get actual date object from day number
    const getDateFromDay = (day: number) => {
        return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    };

    const isDateInPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const timeSlots = [
        "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM",
        "05:00 PM", "06:00 PM"
    ];

    const handleNextStep = () => {
        if (selectedDate && selectedTime) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;

        setLoading(true);
        try {
            // Combine date and time
            const [time, period] = selectedTime.split(' ');
            const [hoursStr, minutesStr] = time.split(':');
            let hours = parseInt(hoursStr);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const finalDate = new Date(selectedDate);
            finalDate.setHours(hours, parseInt(minutesStr), 0, 0);

            await contactApi.scheduleDemo({
                ...formData,
                selected_slot: finalDate.toISOString()
            });

            setStep(3);
        } catch (error: any) {
            console.error("Error scheduling demo:", error);
            alert(error.message || "Failed to schedule demo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Header */}
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
                            Schedule a Personalized Demo
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Experience the future of rental operations. Pick a time that works for you and we'll show you how to scale.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Left: Calendar */}
                                    <div className="p-6 md:p-8 border-r border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <CalendarIcon className="w-5 h-5 text-brand-red" />
                                                Select Date
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center mb-4 font-semibold text-slate-700">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <div key={d} className="text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
                                            ))}
                                            {getDaysInMonth(currentMonth).map((d, i) => {
                                                if (d.day === null) return <div key={`empty-${i}`} />;

                                                const date = getDateFromDay(d.day);
                                                const isPast = isDateInPast(date);
                                                const isSel = selectedDate?.toDateString() === date.toDateString();
                                                const isTdy = isToday(date);

                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={isPast}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`
                                                            aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                                            ${isPast ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-brand-red/5 text-slate-700'}
                                                            ${isSel ? 'bg-brand-red text-white hover:bg-brand-red shadow-lg shadow-brand-red/20' : ''}
                                                            ${isTdy && !isSel ? 'border border-brand-red/30 text-brand-red' : ''}
                                                        `}
                                                    >
                                                        {d.day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Right: Time Slots */}
                                    <div className="p-6 md:p-8 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                                            <Clock className="w-5 h-5 text-brand-red" />
                                            Available Slots
                                        </h3>

                                        {!selectedDate ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center px-6">
                                                <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                                                <p>Please select a date to view available time slots.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {timeSlots.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`
                                                            py-3 px-4 rounded-xl text-sm font-semibold transition-all border
                                                            ${selectedTime === time
                                                                ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20'
                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-red/50 hover:text-brand-red'}
                                                        `}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-8">
                                            <Button
                                                disabled={!selectedDate || !selectedTime}
                                                onClick={handleNextStep}
                                                className="w-full py-4 text-base shadow-glow"
                                            >
                                                Confirm Slot
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto border border-slate-100"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-slate-500 hover:text-brand-red transition-colors mb-8 text-sm font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Calendar
                                </button>

                                <div className="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center shrink-0">
                                        <CalendarIcon className="w-6 h-6 text-brand-red" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Your Selected Slot</div>
                                        <div className="font-bold text-slate-900">
                                            {selectedDate?.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all bg-slate-50/50"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all bg-slate-50/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all bg-slate-50/50"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 text-base shadow-glow mt-4"
                                    >
                                        {loading ? "Scheduling..." : "Schedule Demo"}
                                    </Button>

                                    <p className="text-center text-xs text-slate-400">
                                        By scheduling, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center max-w-2xl mx-auto border border-slate-100"
                            >
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">You're All Set!</h2>
                                <p className="text-slate-500 mb-10 leading-relaxed px-6">
                                    Your demo has been scheduled for <span className="text-slate-900 font-bold">{selectedDate?.toLocaleDateString()} at {selectedTime}</span>.
                                    A Google Meet link has been sent to <span className="text-slate-900 font-bold">{formData.email}</span>.
                                </p>

                                <div className="space-y-4">
                                    <Link to="/">
                                        <Button variant="outline" className="w-full py-4 border-2">
                                            Return to Homepage
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
