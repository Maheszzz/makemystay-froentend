/**
 * EEAT & Search Console Optimization Engine: FAQ Quality Validator
 * Analyzes generated FAQs to detect duplicate questions, weak/placeholder answers,
 * very short answers, and repeated wording across questions.
 */

export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqQualityReport {
    isValid: boolean;
    totalFaqs: number;
    duplicateQuestions: string[];
    weakAnswers: string[];
    shortAnswers: string[];
    repeatedWording: string[];
    qualityScore: number; // 0 to 100
    recommendations: string[];
}

/**
 * Normalizes a string for comparison by removing punctuation and lowercase formatting.
 */
function normalizeString(str: string): string {
    return (str || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Checks if two answer strings share more than 50% identical words.
 */
function hasHighWordingOverlap(str1: string, str2: string): boolean {
    const w1 = new Set(normalizeString(str1).split(' '));
    const w2 = new Set(normalizeString(str2).split(' '));
    if (w1.size === 0 || w2.size === 0) return false;

    let matchCount = 0;
    for (const word of w1) {
        if (word.length > 3 && w2.has(word)) {
            matchCount++;
        }
    }
    const ratio = matchCount / Math.min(w1.size, w2.size);
    return ratio >= 0.6;
}

/**
 * Validates FAQ quality and flags low-EEAT or spammy patterns.
 */
export function validateFaqQuality(faqs: FaqItem[]): FaqQualityReport {
    const duplicateQuestions: string[] = [];
    const weakAnswers: string[] = [];
    const shortAnswers: string[] = [];
    const repeatedWording: string[] = [];
    const recommendations: string[] = [];

    const seenQuestions = new Set<string>();

    if (!faqs || faqs.length === 0) {
        return {
            isValid: false,
            totalFaqs: 0,
            duplicateQuestions: [],
            weakAnswers: ['No FAQs provided.'],
            shortAnswers: [],
            repeatedWording: [],
            qualityScore: 0,
            recommendations: ['Provide at least 5-10 detailed FAQ items with schema.']
        };
    }

    for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        const normQ = normalizeString(faq.question);

        // 1. Check duplicate questions
        if (seenQuestions.has(normQ)) {
            duplicateQuestions.push(faq.question);
        } else {
            seenQuestions.add(normQ);
        }

        // 2. Check weak answers
        const ans = faq.answer || '';
        const lowerAns = ans.toLowerCase();
        if (
            lowerAns.includes('lorem ipsum') ||
            lowerAns.includes('todo') ||
            lowerAns.includes('coming soon') ||
            ans.trim().length === 0
        ) {
            weakAnswers.push(`Q: "${faq.question}" has a weak/placeholder answer.`);
        }

        // 3. Check very short answers (< 15 words)
        const wordCount = ans.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 15) {
            shortAnswers.push(`Q: "${faq.question}" is too short (${wordCount} words). Minimum 15 words recommended.`);
        }

        // 4. Check repeated wording against subsequent answers
        for (let j = i + 1; j < faqs.length; j++) {
            if (hasHighWordingOverlap(ans, faqs[j].answer)) {
                repeatedWording.push(`Q: "${faq.question}" shares >60% wording with Q: "${faqs[j].question}".`);
            }
        }
    }

    // Score deduction math
    let penalty = 0;
    penalty += duplicateQuestions.length * 20;
    penalty += weakAnswers.length * 25;
    penalty += shortAnswers.length * 10;
    penalty += repeatedWording.length * 15;

    const qualityScore = Math.max(0, Math.min(100, 100 - penalty));
    const isValid = qualityScore >= 75 && weakAnswers.length === 0 && duplicateQuestions.length === 0;

    if (duplicateQuestions.length > 0) {
        recommendations.push('Remove or rephrase duplicate FAQ questions.');
    }
    if (shortAnswers.length > 0) {
        recommendations.push('Expand short FAQ answers with specific local data, commute times, or price ranges.');
    }
    if (repeatedWording.length > 0) {
        recommendations.push('Rewrite repetitive FAQ answers so each answer provides unique value.');
    }

    return {
        isValid,
        totalFaqs: faqs.length,
        duplicateQuestions,
        weakAnswers,
        shortAnswers,
        repeatedWording,
        qualityScore,
        recommendations
    };
}
