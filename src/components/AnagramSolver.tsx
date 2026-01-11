import { useState, useEffect, useMemo } from 'react'
import { Shuffle, Eraser, AlertCircle, Unlock } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { cn } from '../lib/utils'
import { validatePool, shuffleArray, type KnownLetters } from '../lib/solver-logic'

export interface AnagramData {
    id: string;
    name: string;
    length: number;
    knownLetters: KnownLetters;
    pool: string;
    createdAt: number;
}

interface AnagramSolverProps {
    data: AnagramData;
    onUpdate: (updates: Partial<AnagramData>) => void;
}

export function AnagramSolver({ data, onUpdate }: AnagramSolverProps) {
    // Local state for immediate UI feedback before persisting
    const [length, setLength] = useState<number>(data.length)
    const [pool, setPool] = useState<string>(data.pool)
    const [name, setName] = useState<string>(data.name)
    const [shuffledChars, setShuffledChars] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    // knownLetters is { index: char }
    const [known, setKnown] = useState<KnownLetters>(data.knownLetters || {})

    // Local state handles immediate UI. 
    // We rely on key={id} in App.tsx to reset state when switching anagrams.
    // UseEffect for sync removed to preventing clearing shuffle on self-triggered updates.

    // Shuffle Logic
    const handleShuffle = (poolOverride?: string | React.MouseEvent, knownOverride?: KnownLetters) => {
        // Handle when called via onClick event
        let p = pool;
        if (typeof poolOverride === 'string') {
            p = poolOverride;
        }

        const k = knownOverride !== undefined ? knownOverride : known;

        // 1. Validate
        const result = validatePool(p, k);
        if (!result.valid) {
            setError(result.error || "Validation failed");
            setShuffledChars([]);
            return;
        }
        setError(null);

        // 2. Shuffle remaining
        if (result.remaining) {
            const shuffled = shuffleArray(result.remaining);
            setShuffledChars(shuffled);
        } else {
            setShuffledChars([]);
        }
    };

    // ...



    const handleKnownChange = (index: number, char: string | null) => {
        const newKnown = { ...known };
        if (!char) {
            delete newKnown[index];
        } else {
            newKnown[index] = char.toUpperCase();
        }
        setKnown(newKnown);
        // Clear shuffle when structure changes to avoid confusion
        setShuffledChars([]);
        setError(null); // Clear error to retry validation

        // Auto-save known letters? nice-to-have
        onUpdate({ length, pool, name, knownLetters: newKnown });
    };

    const clearKnown = () => {
        setKnown({});
        setShuffledChars([]);
        onUpdate({ knownLetters: {} });
    }

    // Prepare display
    // We need to merge known slots with shuffled remaining
    // If no shuffle yet, show empty for unknown
    const displaySlots = useMemo(() => {
        const slots = [];
        let shuffleIndex = 0;

        for (let i = 0; i < length; i++) {
            if (known[i]) {
                slots.push({ char: known[i], isKnown: true });
            } else {
                if (shuffledChars.length > shuffleIndex) {
                    slots.push({ char: shuffledChars[shuffleIndex], isKnown: false });
                    shuffleIndex++;
                } else {
                    slots.push({ char: '', isKnown: false });
                }
            }
        }
        return slots;
    }, [length, known, shuffledChars]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header / Config */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Anagram Name</label>
                    <Input
                        value={name}
                        onChange={(e) => { setName(e.target.value); onUpdate({ name: e.target.value }) }}
                        className="bg-card/50 border-border"
                    />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-muted-foreground">Target Length</label>
                        <span className="text-sm font-bold text-primary">{length}</span>
                    </div>
                    <Slider
                        min={1}
                        max={15}
                        step={1}
                        value={length}
                        onChange={(e) => {
                            const l = parseInt(e.target.value) || 0;
                            setLength(l);
                            onUpdate({ length: l });
                            setShuffledChars([]); // Reset shuffle on manual length change
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Pool Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex justify-between">
                    <span>Available Letters (Pool)</span>
                    <span className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
                        {pool.length} chars
                    </span>
                </label>
                <div className="relative">
                    <Input
                        value={pool}
                        maxLength={15}
                        onChange={(e) => {
                            // Upcase, remove non-letters, limit to 15
                            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 15);
                            setPool(val);

                            // Check if we need to expand current length
                            let newLength = length;
                            // Only auto-expand, never auto-shrink
                            if (val.length > length) {
                                newLength = Math.min(val.length, 15); // Limit to max 15 as per slider
                                setLength(newLength);
                            }

                            onUpdate({ pool: val, length: newLength });

                            // Interactive shuffle as we type!
                            // We must use 'val' because state 'pool' hasn't updated in this closure yet
                            handleShuffle(val);
                        }}
                        placeholder="Enter all available letters e.g. RRETOPUCM"
                        className={cn("uppercase tracking-widest text-lg h-14 font-mono", error && "border-destructive focus-visible:ring-destructive")}
                    />
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-2 animate-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Slots Area */}
            <div className="py-8">
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-4">
                    {displaySlots.map((slot, i) => (
                        <div key={i} className="relative group">
                            <div className={cn(
                                "w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 lg:w-20 lg:h-24 rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold transition-all duration-300",
                                slot.isKnown
                                    ? "bg-primary text-primary-foreground shadow-[0_0_30px_-5px_var(--primary)] scale-105 z-10 border-2 border-primary/20"
                                    : "bg-secondary/50 border border-border/50 text-foreground hover:bg-secondary"
                            )}>
                                {slot.char}

                                {/* Input Overlay for setting Known */}
                                {slot.isKnown ? (
                                    <button
                                        onClick={() => handleKnownChange(i, null)}
                                        className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none flex items-center justify-center z-20 opacity-0 hover:opacity-100 bg-black/50 rounded-xl transition-all"
                                        title="Click to unlock"
                                    >
                                        <Unlock className="w-6 h-6 text-white" />
                                    </button>
                                ) : (
                                    <input
                                        value=""
                                        onChange={(e) => {
                                            const val = e.target.value.slice(-1);
                                            if (val) handleKnownChange(i, val);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                                        title="Type to lock a letter"
                                    />
                                )}
                            </div>

                            {/* Index Indicator */}
                            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground/30">
                                {i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 justify-center pt-4">
                <Button
                    onClick={clearKnown}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
                    disabled={Object.keys(known).length === 0}
                >
                    <Eraser className="w-4 h-4 mr-2" />
                    Clear Locked
                </Button>

                <Button
                    onClick={() => handleShuffle()}
                    size="lg"
                    className="w-full sm:w-auto px-8 md:px-12 bg-gradient-to-r from-primary to-purple-600 hover:shadow-[0_0_30px_-5px_var(--primary)] transition-all duration-300 active:scale-95"
                >
                    <Shuffle className={cn("w-5 h-5 mr-2", shuffledChars.length > 0 && "transition-transform group-hover:rotate-180")} />
                    Shuffle Letters
                </Button>
            </div>

            {/* Instructions */}
            <div className="bg-card/30 rounded-xl p-4 text-sm text-muted-foreground/80 mt-12 border border-white/5">
                <h4 className="font-semibold text-foreground mb-2">How to use</h4>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>Set the target word <strong>Length</strong>.</li>
                    <li>Type directly into a box to <strong>Lock</strong> a known letter in that position.</li>
                    <li>Click a locked letter to unlock it.</li>
                    <li>Enter all available letters in the <strong>Pool</strong>.</li>
                    <li>Press <strong>Shuffle</strong> to randomize the remaining letters into the empty slots.</li>
                </ul>
            </div>
        </div>
    )
}
