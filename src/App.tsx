import React, { useState, useEffect, useMemo } from "react";
import { 
  Flame, 
  Star, 
  Volume2, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Info, 
  SlidersHorizontal, 
  Compass, 
  Cpu, 
  Play, 
  X, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { curatedSentences, CATEGORIES, DIFFICULTY_LEVELS, Sentence } from "./data/curatedSentences";

interface BlockItem {
  id: string;
  text: string;
  originalIndex: number;
}

export default function App() {
  // Navigation & General state
  const [activeTab, setActiveTab] = useState<"play" | "guide" | "notebook">("play");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Principiante");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // User Stats (Persisted in LocalStorage)
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [completedList, setCompletedList] = useState<string[]>([]);
  const [recentReviews, setRecentReviews] = useState<Sentence[]>([]);

  // Active Challenge State
  const [activeSentence, setActiveSentence] = useState<Sentence | null>(null);
  const [scrambledBlocks, setScrambledBlocks] = useState<BlockItem[]>([]);
  const [assembledBlocks, setAssembledBlocks] = useState<BlockItem[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showRomanization, setShowRomanization] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<"normal" | "slow">("normal");
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [hoveredBlock, setHoveredBlock] = useState<BlockItem | null>(null);

  // Curated index tracking
  const [curatedIndex, setCuratedIndex] = useState<number>(0);

  // Initialize stats from local storage
  useEffect(() => {
    try {
      const storedXP = localStorage.getItem("korean_builder_xp");
      if (storedXP) setScore(parseInt(storedXP, 10));

      const storedStreak = localStorage.getItem("korean_builder_streak");
      if (storedStreak) setStreak(parseInt(storedStreak, 10));

      const storedCompleted = localStorage.getItem("korean_builder_completed");
      if (storedCompleted) setCompletedList(JSON.parse(storedCompleted));

      const storedReviews = localStorage.getItem("korean_builder_reviews");
      if (storedReviews) setRecentReviews(JSON.parse(storedReviews));
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
  }, []);

  // Filter curated sentences based on sidebar filters
  const filteredCurated = useMemo(() => {
    return curatedSentences.filter(sentence => {
      const matchesDiff = selectedDifficulty === "All" || sentence.difficulty === selectedDifficulty;
      const matchesCat = selectedCategory === "All" || sentence.category === selectedCategory;
      return matchesDiff && matchesCat;
    });
  }, [selectedDifficulty, selectedCategory]);

  // Load appropriate sentence when filters or index change
  useEffect(() => {
    if (filteredCurated.length > 0) {
      const safeIndex = curatedIndex % filteredCurated.length;
      initSentenceChallenge(filteredCurated[safeIndex]);
    } else {
      setActiveSentence(null);
      setScrambledBlocks([]);
      setAssembledBlocks([]);
    }
  }, [filteredCurated, curatedIndex]);

  // Setup the puzzle state for a sentence
  const initSentenceChallenge = (sentence: Sentence) => {
    const blocksWithIds = sentence.blocks.map((text, idx) => ({
      id: `${sentence.id}-block-${idx}`,
      text: text,
      originalIndex: idx
    }));

    // Perform robust shuffle
    let scrambled = [...blocksWithIds];
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }

    // Ensure it's not solved initially
    if (scrambled.length > 1 && scrambled.every((item, idx) => item.originalIndex === idx)) {
      [scrambled[0], scrambled[1]] = [scrambled[1], scrambled[0]];
    }

    setActiveSentence(sentence);
    setScrambledBlocks(scrambled);
    setAssembledBlocks([]);
    setIsChecked(false);
    setIsCorrect(false);
    setActiveHintIndex(-1);
    setHoveredBlock(null);
    setShowRomanization(false);
  };

  // Click-to-move word blocks
  const handleBlockSelect = (block: BlockItem) => {
    if (isChecked && isCorrect) return; // Prevent edits on solved items
    
    // Reset check state on modification
    setIsChecked(false);
    
    // Add to assembled and remove from pool
    setAssembledBlocks([...assembledBlocks, block]);
    setScrambledBlocks(scrambledBlocks.filter(b => b.id !== block.id));
  };

  const handleBlockDeselect = (block: BlockItem) => {
    if (isChecked && isCorrect) return; // Prevent edits on solved items

    // Reset check state on modification
    setIsChecked(false);

    // Return to pool and remove from assembled
    setScrambledBlocks([...scrambledBlocks, block]);
    setAssembledBlocks(assembledBlocks.filter(b => b.id !== block.id));
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, block: BlockItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(block));
  };

  const handleDropToAssembly = (e: React.DragEvent) => {
    e.preventDefault();
    if (isChecked && isCorrect) return;
    
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const block = JSON.parse(dataStr) as BlockItem;
      
      // If block is currently in scrambled pool, move it
      if (scrambledBlocks.some(b => b.id === block.id)) {
        handleBlockSelect(block);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDropToPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (isChecked && isCorrect) return;

    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const block = JSON.parse(dataStr) as BlockItem;

      // If block is currently in assembly, return it
      if (assembledBlocks.some(b => b.id === block.id)) {
        handleBlockDeselect(block);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verification
  const checkAssembly = () => {
    if (!activeSentence) return;
    setIsChecked(true);

    const isMatched = assembledBlocks.length === activeSentence.blocks.length &&
                      assembledBlocks.every((b, idx) => b.text === activeSentence.blocks[idx]);

    if (isMatched) {
      setIsCorrect(true);
      setShowRomanization(true);
      speakSentence(activeSentence.korean, speechSpeed === "slow");

      // Score + Streak Logic
      const newScore = score + 15;
      setScore(newScore);
      localStorage.setItem("korean_builder_xp", String(newScore));

      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("korean_builder_streak", String(newStreak));

      // Mark Completed
      if (!completedList.includes(activeSentence.id)) {
        const newList = [...completedList, activeSentence.id];
        setCompletedList(newList);
        localStorage.setItem("korean_builder_completed", JSON.stringify(newList));
      }

      // Add to Review History
      if (!recentReviews.some(item => item.id === activeSentence.id)) {
        const updated = [activeSentence, ...recentReviews].slice(0, 15);
        setRecentReviews(updated);
        localStorage.setItem("korean_builder_reviews", JSON.stringify(updated));
      }
    } else {
      setIsCorrect(false);
      // Streak breaks on incorrect check to keep the stakes interesting!
      setStreak(0);
      localStorage.setItem("korean_builder_streak", "0");
    }
  };

  // Provide Next Word as Hint
  const triggerHint = () => {
    if (!activeSentence || (isChecked && isCorrect)) return;

    // Next correct block index is assembledBlocks.length
    const nextCorrectIndex = assembledBlocks.length;
    if (nextCorrectIndex >= activeSentence.blocks.length) return;

    const targetText = activeSentence.blocks[nextCorrectIndex];
    // Find this block in the scrambled pool
    const hintBlock = scrambledBlocks.find(b => b.text === targetText);

    if (hintBlock) {
      // Move it automatically
      handleBlockSelect(hintBlock);
      setActiveHintIndex(nextCorrectIndex);
      setTimeout(() => setActiveHintIndex(-1), 1200); // Visual flash
    }
  };

  // Clear current choices
  const resetAssembly = () => {
    if (!activeSentence || (isChecked && isCorrect)) return;
    initSentenceChallenge(activeSentence);
  };

  // Next level / Skip
  const goToNextSentence = () => {
    setCuratedIndex((prev) => prev + 1);
  };

  // Korean Speech Synthesis Playback
  const speakSentence = (text: string, isSlow: boolean = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop playing previous sound
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = isSlow ? 0.6 : 0.85;

      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(
        (voice) => voice.lang.startsWith("ko") || voice.lang.includes("KR")
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La sintesi vocale non è supportata su questo browser.");
    }
  };

  // Analyze individual blocks to identify grammar particles and add color accents
  const getBlockTypeClasses = (text: string) => {
    const clean = text.trim();
    // Common Korean Grammar Particles
    if (clean.endsWith("는") || clean.endsWith("은")) {
      return "word-block rounded-2xl border-purple-500 text-purple-600 bg-white hover:bg-purple-50"; // Topic marker
    }
    if (clean.endsWith("가") || clean.endsWith("이")) {
      return "word-block rounded-2xl border-blue-500 text-blue-600 bg-white hover:bg-blue-50"; // Subject marker
    }
    if (clean.endsWith("를") || clean.endsWith("을")) {
      return "word-block rounded-2xl border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50"; // Object marker
    }
    if (clean.endsWith("에") || clean.endsWith("에서") || clean.endsWith("로") || clean.endsWith("으로")) {
      return "word-block rounded-2xl border-orange-500 text-orange-600 bg-white hover:bg-orange-50"; // Location/direction marker
    }
    if (clean.endsWith("입니다") || clean.endsWith("해요") || clean.endsWith("어요") || clean.endsWith("아요") || clean.endsWith("습니까?")) {
      return "word-block rounded-2xl border-pink-500 text-pink-600 bg-white hover:bg-pink-50"; // Verbal ending
    }
    return "word-block rounded-2xl border-slate-400 text-slate-700 bg-white hover:bg-slate-50"; // Standard noun/adverb
  };

  const getBlockTypeLabel = (text: string) => {
    const clean = text.trim();
    if (clean.endsWith("는") || clean.endsWith("은")) return "Tema (Topic)";
    if (clean.endsWith("가") || clean.endsWith("이")) return "Soggetto";
    if (clean.endsWith("를") || clean.endsWith("을")) return "Oggetto Diretto";
    if (clean.endsWith("에") || clean.endsWith("에서")) return "Luogo/Stato";
    if (clean.endsWith("로") || clean.endsWith("으로")) return "Direzione/Mezzo";
    if (clean.endsWith("입니다") || clean.endsWith("해요") || clean.endsWith("어요") || clean.endsWith("아요")) return "Verbo/Coniugazione";
    return "Sostantivo/Vocabolo";
  };

  // Achievements Milestones
  const achievements = [
    { id: "ach-1", title: "Primo Passo", desc: "Completa la tua prima frase", cond: completedList.length >= 1 },
    { id: "ach-2", title: "Studioso", desc: "Accumula almeno 100 XP", cond: score >= 100 },
    { id: "ach-3", title: "Inarrestabile", desc: "Raggiungi una striscia di 5 risposte corrette", cond: streak >= 5 },
    { id: "ach-4", title: "Creatore di Frasi", desc: "Completa 10 frasi differenti", cond: completedList.length >= 10 },
    { id: "ach-5", title: "Super Ripasso", desc: "Salva almeno 3 frasi nel tuo quaderno", cond: recentReviews.length >= 3 }
  ];

  return (
    <div id="applet-root" className="min-h-screen bg-[#FFF9E6] text-slate-800 font-sans flex flex-col antialiased">
      {/* HEADER BAR */}
      <header id="applet-header" className="sticky top-0 z-40 bg-white border-b-4 border-orange-100 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md border-b-4 border-orange-600 transition-transform hover:scale-105 active:scale-95">
              🇰🇷
            </div>
            <div>
              <h1 className="title-font text-2xl font-bold text-slate-800 leading-none">
                Costruttore di Frasi
              </h1>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1 hidden sm:block">
                {`Studio Coreano • ${selectedDifficulty}`}
              </p>
            </div>
          </div>

          {/* DASHBOARD STATS */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Progress indicator */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progresso</span>
              <div className="w-40 h-3 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200 shadow-inner">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500" 
                  style={{ width: `${curatedSentences.length > 0 ? Math.min(100, (completedList.length / curatedSentences.length) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Streak Badge */}
              <div 
                title="La tua striscia giornaliera"
                className="w-11 h-11 bg-yellow-400 rounded-full border-b-4 border-yellow-600 flex flex-col items-center justify-center text-white font-bold text-sm shadow-md transition-transform hover:scale-105"
              >
                <span className="text-[10px] leading-none">⚡</span>
                <span className="leading-none">{streak}</span>
              </div>

              {/* XP Badge */}
              <div 
                title="Punti XP accumulati"
                className="w-11 h-11 bg-pink-400 rounded-full border-b-4 border-pink-600 flex flex-col items-center justify-center text-white font-bold text-sm shadow-md transition-transform hover:scale-105"
              >
                <span className="text-[10px] leading-none">🏆</span>
                <span className="leading-none">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE TAB NAVIGATION (ONLY SHOWS ON SMALL SCREENS) */}
      <div className="md:hidden bg-white border-b border-slate-200 grid grid-cols-3 text-center text-sm font-medium text-slate-500">
        <button
          onClick={() => setActiveTab("play")}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === "play" ? "border-emerald-600 text-emerald-600 font-bold" : "border-transparent"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Gioco</span>
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === "guide" ? "border-emerald-600 text-emerald-600 font-bold" : "border-transparent"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Guida</span>
        </button>
        <button
          onClick={() => setActiveTab("notebook")}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === "notebook" ? "border-emerald-600 text-emerald-600 font-bold" : "border-transparent"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Quaderno</span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: GAMEPLAY ENGINE & INTERACTIVE AREA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PLAY STATE / GAME TAB */}
            {activeTab === "play" && (
              <div className="space-y-6">
                
                {/* NAVIGATION CONTROL PANEL */}
                <div className="bg-white rounded-[24px] border-4 border-orange-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-orange-400" />
                    <span className="font-extrabold text-slate-800 title-font text-lg">Percorso Curato</span>
                  </div>

                  {/* CURATED NAVIGATION INDICATOR */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
                    <span className="text-slate-500 font-bold">
                      Frase <span className="font-black text-orange-500">{filteredCurated.length > 0 ? (curatedIndex % filteredCurated.length) + 1 : 0}</span> di <span className="font-black text-slate-800">{filteredCurated.length}</span>
                    </span>
                    <button
                      onClick={goToNextSentence}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center gap-1 border-b-2 border-slate-300"
                    >
                      Salta / Prossima
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* MAIN PUZZLE COMPONENT */}
                {!activeSentence ? (
                  <div className="bg-white rounded-3xl border-4 border-orange-100 shadow-md p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-4">
                      <HelpCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Nessuna frase disponibile</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                      Prova a modificare i filtri nella barra laterale per sbloccare più frasi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* ACTIVE CHALLENGE CARD */}
                    <div className="bg-white rounded-[32px] border-4 border-orange-100 shadow-xl overflow-hidden">
                      
                      {/* CARD TOP BAR */}
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                            activeSentence.difficulty === "Principiante" 
                              ? "bg-green-100 text-green-700" 
                              : activeSentence.difficulty === "Intermedio" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-purple-100 text-purple-700"
                          }`}>
                            {activeSentence.difficulty}
                          </span>
                          <span className="text-xs font-medium text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                            {activeSentence.category}
                          </span>
                        </div>

                        {/* Speech Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSpeechSpeed(speechSpeed === "normal" ? "slow" : "normal")}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                              speechSpeed === "slow" 
                                ? "bg-amber-100 border-amber-300 text-amber-700" 
                                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Tartaruga 🐢 {speechSpeed === "slow" ? "ON" : "OFF"}
                          </button>
                        </div>
                      </div>

                      {/* TRANSLATION & PROMPT AREA */}
                      <div className="p-6 text-center space-y-4">
                        <h2 className="title-font text-2xl sm:text-3xl font-black text-slate-700">
                          Traduci questa frase:
                        </h2>
                        <div className="inline-block px-8 py-4 bg-white rounded-2xl border-4 border-slate-200 shadow-sm">
                          <span className="text-xl sm:text-2xl font-bold text-slate-600 italic">
                            "{activeSentence.translation}"
                          </span>
                        </div>

                        {/* Pronunciation Playback Button */}
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => speakSentence(activeSentence.korean, speechSpeed === "slow")}
                            className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm border border-emerald-100 transition active:scale-95"
                          >
                            <Volume2 className="w-4 h-4" />
                            Ascolta Pronuncia
                          </button>
                          
                          <button
                            onClick={() => setShowRomanization(!showRomanization)}
                            className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-3 py-2 animate-pulse"
                          >
                            {showRomanization ? "Nascondi Trascrizione" : "Mostra Trascrizione"}
                          </button>
                        </div>

                        {showRomanization && (
                          <div className="inline-block bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 text-xs sm:text-sm font-mono text-slate-500 italic">
                            {activeSentence.romanization}
                          </div>
                        )}
                      </div>

                      {/* WORK ASSEMBLY ZONE (DROP TARGET) */}
                      <div className="p-6 bg-white/40 border-t-4 border-orange-100 space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider px-1">
                          <span className="title-font">Frase assemblata</span>
                          <span>Trascina i blocchi o premi per ordinarli</span>
                        </div>

                        {/* Drop Zone Box */}
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDropToAssembly}
                          className={`min-h-[100px] p-4 rounded-3xl border-4 border-dashed flex flex-wrap items-center justify-center gap-3 transition-all ${
                            isChecked 
                              ? isCorrect 
                                ? "bg-emerald-50/70 border-emerald-400" 
                                : "bg-rose-50/70 border-rose-400" 
                              : "bg-white/50 border-slate-300 focus-within:border-orange-400"
                          }`}
                        >
                          <AnimatePresence mode="popLayout">
                            {assembledBlocks.length === 0 ? (
                              <motion.span 
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-slate-400 text-sm italic py-2"
                              >
                                Trascina qui le parole o toccale in basso
                              </motion.span>
                            ) : (
                              assembledBlocks.map((block, index) => (
                                <motion.div
                                  key={block.id}
                                  layoutId={`block-${block.id}`}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, block)}
                                  onClick={() => handleBlockDeselect(block)}
                                  onMouseEnter={() => setHoveredBlock(block)}
                                  onMouseLeave={() => setHoveredBlock(null)}
                                  className={`px-6 py-3 text-lg font-black cursor-pointer select-none ${getBlockTypeClasses(block.text)} ${
                                    activeHintIndex === index ? "ring-4 ring-amber-400 ring-offset-2" : ""
                                  }`}
                                >
                                  {block.text}
                                </motion.div>
                              ))
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* SCRAMBLED WORDS POOL (DRAG ORIGIN) */}
                      <div className="p-6 border-t-4 border-orange-100 space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-wider px-1">
                          <span className="title-font">Blocchi di parole disponibili</span>
                          {hoveredBlock && (
                            <span className="text-emerald-700 animate-pulse font-bold normal-case">
                              ⭐ Hover: {getBlockTypeLabel(hoveredBlock.text)}
                            </span>
                          )}
                        </div>

                        {/* Words Pool Container */}
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDropToPool}
                          className="min-h-[100px] flex flex-wrap justify-center items-center gap-4 p-8 bg-white/30 rounded-3xl border-4 border-slate-200/50 shadow-inner"
                        >
                          <AnimatePresence mode="popLayout">
                            {scrambledBlocks.length === 0 && assembledBlocks.length === activeSentence.blocks.length ? (
                              <motion.div 
                                key="done-placeholder"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-slate-500 text-sm font-semibold flex items-center gap-2 py-2"
                              >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Tutte le parole inserite! Premi "Controlla"
                              </motion.div>
                            ) : (
                              scrambledBlocks.map((block) => (
                                <motion.button
                                  key={block.id}
                                  layoutId={`block-${block.id}`}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, block)}
                                  onClick={() => handleBlockSelect(block)}
                                  onMouseEnter={() => setHoveredBlock(block)}
                                  onMouseLeave={() => setHoveredBlock(null)}
                                  className={`px-6 py-3 text-lg font-black select-none transition ${getBlockTypeClasses(block.text)}`}
                                >
                                  {block.text}
                                </motion.button>
                              ))
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Dynamic Tooltip on Block Hover */}
                        {hoveredBlock && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5 text-xs">
                            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 font-mono text-sm">{hoveredBlock.text}</span>
                              <span className="mx-2 text-slate-300">|</span>
                              <span className="font-semibold text-emerald-700">Particella/Rolo: {getBlockTypeLabel(hoveredBlock.text)}</span>
                              <p className="text-slate-500 mt-1">
                                {hoveredBlock.text.trim().endsWith("는") || hoveredBlock.text.trim().endsWith("은") 
                                  ? "Particella del tema. Definisce l'argomento principale della conversazione o introduce un contrasto." 
                                  : hoveredBlock.text.trim().endsWith("가") || hoveredBlock.text.trim().endsWith("이") 
                                    ? "Particella del soggetto. Specifica chi compie l'azione espressa dal verbo." 
                                    : hoveredBlock.text.trim().endsWith("를") || hoveredBlock.text.trim().endsWith("을") 
                                      ? "Particella dell'oggetto diretto. Specifica su cosa si riflette l'azione del verbo." 
                                      : hoveredBlock.text.trim().endsWith("에") || hoveredBlock.text.trim().endsWith("에서") 
                                        ? "Particella di luogo/stato. Identifica dove si trova un oggetto o dove si compie un'azione." 
                                        : hoveredBlock.text.trim().endsWith("입니다") || hoveredBlock.text.trim().endsWith("해요")
                                          ? "Coda verbale. Tutti i verbi in coreano si collocano rigorosamente alla fine della frase."
                                          : "Parola o parte nominale fondamentale della frase."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* GAME CONTROL ACTIONS AND CHECK FEEDBACK */}
                      <div className="p-6 bg-slate-50 border-t-4 border-orange-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                        
                        {/* Clear/Reset & Hint Buttons */}
                        <div className="flex items-center justify-start gap-3">
                          <button
                            onClick={resetAssembly}
                            disabled={assembledBlocks.length === 0 || (isChecked && isCorrect)}
                            className="px-6 py-3 bg-white hover:bg-slate-50 disabled:opacity-50 border-2 border-slate-300 text-slate-600 font-bold rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Resetta
                          </button>
                          
                          <button
                            onClick={triggerHint}
                            disabled={isChecked && isCorrect}
                            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 border-b-4 border-amber-600 text-white font-black rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4" />
                            Aiuto
                          </button>
                        </div>

                        {/* Big Submit/Continue button */}
                        <div>
                          {isChecked && isCorrect ? (
                            <button
                              onClick={goToNextSentence}
                              className="w-full sm:w-auto px-12 py-4 bg-emerald-500 text-white text-lg font-black rounded-2xl border-b-4 border-emerald-700 shadow-lg transform active:scale-95 flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              Fantastico! Prossimo Livello
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={checkAssembly}
                              disabled={assembledBlocks.length === 0}
                              className="w-full sm:w-auto px-12 py-4 bg-orange-500 text-white text-lg font-black rounded-2xl border-b-4 border-orange-700 shadow-lg transform active:scale-95 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                            >
                              Verifica la Frase
                            </button>
                          )}
                        </div>
                      </div>

                      {/* FEEDBACK BANNER */}
                      <AnimatePresence>
                        {isChecked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`px-6 py-4 flex items-center gap-3 border-t font-semibold ${
                              isCorrect 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                : "bg-rose-50 border-rose-200 text-rose-800"
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <Check className="w-5 h-5 bg-emerald-600 text-white p-0.5 rounded-full" />
                                <div>
                                  <span className="block font-bold">Ottimo lavoro! (+15 XP)</span>
                                  <span className="text-xs font-medium text-emerald-600 block">Hai ordinato le parole in modo impeccabile. Ascolta l'audio per padroneggiare l'intonazione!</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5 bg-rose-600 text-white p-0.5 rounded-full" />
                                <div>
                                  <span className="block font-bold">Ordine scorretto. Riprova!</span>
                                  <span className="text-xs font-medium text-rose-600 block">Ricorda che in coreano il verbo principale deve stare sempre alla fine della frase. Puoi premere "Aiuto" se hai dubbi!</span>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* DYNAMIC GRAMMAR EXPLANATION (SHOWS WHEN CORRECT OR ACCESSED) */}
                    {isChecked && isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4"
                      >
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <Sparkles className="w-5 h-5" />
                          <h3 className="font-display text-lg">Spiegazione Grammaticale (Insegnante IA)</h3>
                        </div>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {activeSentence.explanation}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GRAMMAR & CHEATSHEET TAB */}
            {(activeTab === "guide" || (!activeTab && false)) && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 rounded-2xl border border-purple-100 text-purple-700">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight font-display text-slate-900">
                      Guida Rapida alla Struttura Coreana
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Padroneggia l'ordine delle parole e le particelle in 2 minuti
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* CARD 1: SENTENCE STRUCTURE */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      1. Struttura della Frase SOV
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      A differenza dell'italiano (Soggetto-Verbo-Oggetto), il coreano segue rigorosamente l'ordine <strong>Soggetto - Oggetto - Verbo (SOV)</strong>.
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                      <div className="text-slate-400">Italiano: Io [S] mangio [V] una mela [O]</div>
                      <div className="text-slate-800 font-bold">Coreano: 저 (Io) [S] + 사과 (Mela) [O] + 먹습니다 (Mangio) [V]</div>
                    </div>
                  </div>

                  {/* CARD 2: PARTICLES */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      2. Le Particelle (Etichette)
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      In coreano, le parole non si posizionano casualmente, ma sono marcate da <strong>particelle</strong> che indicano il loro ruolo grammaticale.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100 text-purple-800">
                        <strong className="block">은 / 는</strong> Tema principale
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-blue-800">
                        <strong className="block">이 / 가</strong> Soggetto specifico
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 text-emerald-800">
                        <strong className="block">을 / 를</strong> Oggetto diretto
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 text-amber-800">
                        <strong className="block">에 / 에서</strong> Luogo/Stato
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADVANCED TIP */}
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 flex gap-4">
                  <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="text-sm text-emerald-800 leading-relaxed">
                    <strong className="block mb-1">💡 Suggerimento dell'Insegnante:</strong>
                    I coreani amano l'efficienza! Nelle conversazioni informali quotidiane, il soggetto ("io", "tu") e le particelle ovvie vengono spesso omessi completamente. Ad esempio, anziché "acqua ha bisogno", dicono semplicemente "acqua necessaria" (물이 필요해요).
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS & NOTEBOOK TAB */}
            {(activeTab === "notebook" || (!activeTab && false)) && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight font-display text-slate-900">
                        Il mio Quaderno di Ripasso
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Riascolta e rivedi le frasi che hai completato correttamente
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Vuoi cancellare la cronologia del quaderno?")) {
                        setRecentReviews([]);
                        localStorage.removeItem("korean_builder_reviews");
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold transition"
                  >
                    Svuota
                  </button>
                </div>

                {recentReviews.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                    <p className="text-sm italic">Ancora nessuna frase nel tuo quaderno.</p>
                    <p className="text-xs mt-1">Completa le sfide del gioco per aggiungerle automaticamente qui!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReviews.map((item, idx) => (
                      <div key={`review-${item.id}-${idx}`} className="bg-slate-50/60 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 font-mono">#{idx + 1}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">{item.difficulty}</span>
                            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{item.category}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg font-display">{item.korean}</h4>
                          <p className="text-sm text-slate-600 italic">{item.translation}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.romanization}</p>
                        </div>

                        <div className="flex sm:flex-col items-stretch sm:items-end gap-2">
                          <button
                            onClick={() => speakSentence(item.korean)}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition shadow-sm"
                          >
                            <Volume2 className="w-4 h-4 text-slate-500" />
                            Ascolta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: NAVIGATION FILTERS, STATS, & ACHIEVEMENTS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* GAME FILTER PANEL (FOR CURATED MODE) */}
            <div className="bg-white rounded-[24px] border-4 border-orange-100 shadow-md p-6 space-y-5 hidden md:block">
              <div className="flex items-center gap-2.5 text-slate-800 font-bold border-b-2 border-orange-50 pb-3">
                <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                <h3 className="title-font text-base">Filtri di Studio</h3>
              </div>

              {/* Difficulty filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Difficoltà</label>
                <div className="flex flex-col gap-1.5">
                  {["All", ...DIFFICULTY_LEVELS].map((diff) => (
                    <button
                      key={`diff-btn-${diff}`}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        setCuratedIndex(0);
                      }}
                      className={`text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex justify-between items-center ${
                        selectedDifficulty === diff
                          ? "bg-orange-400 border-b-2 border-orange-600 text-white shadow-sm font-bold"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-b-2 border-slate-200"
                      }`}
                    >
                      <span>{diff === "All" ? "Tutte le Difficoltà" : diff}</span>
                      {selectedDifficulty === diff && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Argomento</label>
                <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {["All", ...CATEGORIES].map((cat) => (
                    <button
                      key={`cat-btn-${cat}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCuratedIndex(0);
                      }}
                      className={`text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex justify-between items-center ${
                        selectedCategory === cat
                          ? "bg-orange-400 border-b-2 border-orange-600 text-white shadow-sm font-bold"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-b-2 border-slate-200"
                      }`}
                    >
                      <span className="truncate">{cat === "All" ? "Tutti gli Argomenti" : cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP DESCRIPTIVE CARD (ONLY FOR DESKTOP) */}
            <div className="bg-white rounded-[24px] border-4 border-orange-100 shadow-md p-6 space-y-4 hidden md:block">
              <div className="flex items-center gap-2 text-purple-700 font-bold border-b-2 border-orange-50 pb-3">
                <Award className="w-5 h-5" />
                <h3 className="title-font text-base">La Grammatica a Colori</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ogni blocco ha un bordo e sfondo colorato per aiutarti a memorizzare il suo ruolo:
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 border border-purple-200 bg-purple-50 text-purple-800 px-2.5 py-1.5 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                  <span><strong>은 / 는</strong> : Tema (Topic)</span>
                </div>
                <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-800 px-2.5 py-1.5 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span><strong>이 / 가</strong> : Soggetto</span>
                </div>
                <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span><strong>을 / 를</strong> : Oggetto Diretto</span>
                </div>
                <div className="flex items-center gap-2 border border-rose-200 bg-rose-50 text-rose-800 px-2.5 py-1.5 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span><strong>Coniugazione</strong> : Fine Frase</span>
                </div>
              </div>
            </div>

            {/* ACHIEVEMENTS BLOCK */}
            <div className="bg-white rounded-[24px] border-4 border-orange-100 shadow-md p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-amber-600 font-bold border-b-2 border-orange-50 pb-3">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="title-font text-base">Traguardi e Badge</h3>
              </div>

              <div className="flex flex-col gap-3">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition ${
                      ach.cond 
                        ? "bg-amber-50/50 border-amber-200 text-amber-950" 
                        : "bg-slate-50 border-slate-150 text-slate-400 opacity-60"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      ach.cond 
                        ? "bg-amber-500 text-white shadow-md shadow-amber-200" 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold font-display">{ach.title}</span>
                      <span className="block text-[11px] text-slate-500 font-medium leading-normal">{ach.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-4 border-orange-100 py-8 mt-12 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-7xl mx-auto px-4">
          <p className="title-font text-sm text-slate-600 mb-1">Costruttore di Frasi Coreane</p>
          <p>© 2026 Korean Builder. Creato con passione per un apprendimento colorato e intuitivo.</p>
        </div>
      </footer>
    </div>
  );
}
