/**
 * Display-only name normalisation (never applied to stored data, slugs or routing).
 *
 * Title-cases each word, then restores the acronyms that title-casing breaks:
 * "Coliving Pg" -> "Coliving PG", "2bhk" -> "2BHK", "Ac" -> "AC", "Ro Water" -> "RO Water".
 */
const ACRONYMS = ['PG', 'BHK', 'AC', 'RO', 'RK', 'TV', 'CCTV'] as const;

function titleCaseWord(word: string): string {
    if (!word) return word;
    // Keep hyphenated / slashed parts independently cased ("Co-living", "A/C").
    return word
        .split(/([-/])/)
        .map((part) => {
            if (/^[-/]$/.test(part) || !part) return part;
            const lower = part.toLowerCase();
            const i = lower.search(/[a-z]/);
            return i < 0 ? part : lower.slice(0, i) + lower.charAt(i).toUpperCase() + lower.slice(i + 1);
        })
        .join('');
}

function restoreAcronyms(word: string): string {
    // Leading digits are allowed for BHK/RK ("2bhk" -> "2BHK").
    const m = word.match(/^(\W*)(\d*)([A-Za-z]+)(\W*)$/);
    if (!m) return word;
    const [, lead, digits, letters, tail] = m;
    const upper = letters.toUpperCase();
    if ((ACRONYMS as readonly string[]).includes(upper)) {
        // Only allow a numeric prefix on BHK / RK.
        if (digits && upper !== 'BHK' && upper !== 'RK') return word;
        return `${lead}${digits}${upper}${tail}`;
    }
    return word;
}

export function normalizeDisplayName(raw: string | undefined | null): string {
    if (raw == null || typeof raw !== 'string') return '';
    const t = raw.trim();
    if (!t) return '';
    return t
        .split(/\s+/)
        .map((w) => restoreAcronyms(titleCaseWord(w)))
        .join(' ');
}
