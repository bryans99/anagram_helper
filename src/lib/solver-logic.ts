export type KnownLetters = Record<string, string>;

interface ValidationResult {
    valid: boolean;
    error?: string;
    remaining?: string[];
}

export function validatePool(pool: string, knownLetters: KnownLetters): ValidationResult {
    const poolCounts: Record<string, number> = {};
    for (const char of pool.toUpperCase()) {
        if (/[A-Z]/.test(char)) {
            poolCounts[char] = (poolCounts[char] || 0) + 1;
        }
    }

    const usedCounts: Record<string, number> = {};
    for (const char of Object.values(knownLetters)) {
        if (char) {
            usedCounts[char] = (usedCounts[char] || 0) + 1;
        }
    }

    for (const char in usedCounts) {
        if (!poolCounts[char] || usedCounts[char] > poolCounts[char]) {
            return { valid: false, error: `Known letter '${char}' not found in available letters` };
        }
        poolCounts[char] -= usedCounts[char];
    }

    // Collect remaining chars
    let remaining: string[] = [];
    for (const char in poolCounts) {
        for (let i = 0; i < poolCounts[char]; i++) {
            remaining.push(char);
        }
    }

    return { valid: true, remaining };
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}
