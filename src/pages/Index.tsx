import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicCalculator from '@/components/BasicCalculator';
import ScientificCalculator from '@/components/ScientificCalculator';
import UnitConverter from '@/components/UnitConverter';
import HistoryPanel from '@/components/HistoryPanel';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import KawaiiCharacter from '@/components/KawaiiCharacter';
import { DecorativeBackground } from '@/components/DecorativeElements';
import { motion } from 'framer-motion';
import { initializeAudio, playModeChangeSound } from '@/utils/soundUtils';
interface HistoryItem {
  input: string;
  result: string;
  timestamp: number;
}
const Index = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'scientific' | 'converter'>('basic');
  const [previousMode, setPreviousMode] = useState<'basic' | 'scientific' | 'converter'>('basic');
  const [showHistory, setShowHistory] = useState(false);
  const [kawaiiMood, setKawaiiMood] = useState<'happy' | 'curious' | 'sleepy' | 'excited'>('happy');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [memory, setMemory] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };
  const handleModeChange = (mode: 'basic' | 'scientific' | 'converter') => {
    setPreviousMode(calculatorMode);
    setCalculatorMode(mode);
    if (isSoundEnabled && mode !== calculatorMode) {
      playModeChangeSound(isSoundEnabled);
    }
  };
  useEffect(() => {
    if (input.length > 8) {
      setKawaiiMood('curious');
    } else if (input.includes('sin') || input.includes('cos') || input.includes('log')) {
      setKawaiiMood('excited');
    } else if (input === '') {
      setKawaiiMood('sleepy');
    } else {
      setKawaiiMood('happy');
    }
  }, [input]);
  const addToHistory = (input: string, result: string) => {
    setHistory(prev => [{
      input,
      result,
      timestamp: Date.now()
    }, ...prev]);
  };
  const handleHistoryItemClick = (input: string) => {
    setInput(input);
  };
  const handleClearHistory = () => {
    setHistory([]);
  };
  const handleCalculatorPaste = (pastedText: string) => {
    if (pastedText) {
      setInput(prevInput => {
        if (cursorPosition !== null && cursorPosition <= prevInput.length) {
          const before = prevInput.substring(0, cursorPosition);
          const after = prevInput.substring(cursorPosition);
          setCursorPosition(cursorPosition + pastedText.length);
          return before + pastedText + after;
        } else {
          return prevInput + pastedText;
        }
      });
    }
  };
  const [inParenthesesMode, setInParenthesesMode] = useState(false);
  const lastFunctionRef = useRef<string>('');
  const checkForOpenParentheses = (text: string) => {
    const openCount = (text.match(/\(/g) || []).length;
    const closeCount = (text.match(/\)/g) || []).length;
    return openCount > closeCount;
  };
  useEffect(() => {
    setInParenthesesMode(checkForOpenParentheses(input));
  }, [input]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }
      const key = event.key;
      if (/^[0-9+\-*/().%^]$/.test(key)) {
        setInput(prev => prev + key);
        const buttonEl = document.querySelector(`button[data-value="${key}"]`);
        if (buttonEl) {
          buttonEl.classList.add('active');
          setTimeout(() => buttonEl.classList.remove('active'), 100);
        }
      }
      if (key === '=' || key === 'Enter') {
        event.preventDefault();
        const equalsButton = document.querySelector('button[value="="]');
        if (equalsButton) {
          equalsButton.dispatchEvent(new MouseEvent('click', {
            bubbles: true
          }));
        }
      }
      if (key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
        const backspaceButton = document.querySelector('button[value="⌫"]');
        if (backspaceButton) {
          backspaceButton.dispatchEvent(new MouseEvent('click', {
            bubbles: true
          }));
        }
      }
      if (key === 'Escape') {
        setInput('');
        setResult('');
        const clearButton = document.querySelector('button[value="C"]');
        if (clearButton) {
          clearButton.dispatchEvent(new MouseEvent('click', {
            bubbles: true
          }));
        }
      }
      if (event.altKey && key === '1') {
        handleModeChange('basic');
      } else if (event.altKey && key === '2') {
        handleModeChange('scientific');
      } else if (event.altKey && key === '3') {
        handleModeChange('converter');
      }
      if (event.ctrlKey && key === 'd') {
        event.preventDefault();
        toggleTheme();
      } else if (event.ctrlKey && key === 's') {
        event.preventDefault();
        toggleSound();
      }
      if (event.ctrlKey && key === 'v') {
        const displayElement = document.querySelector('.kawaii-display');
        if (displayElement) {
          const inputDisplay = displayElement.querySelector('div[contentEditable="false"]');
          if (inputDisplay) {
            (inputDisplay as HTMLElement).focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return <div className="min-h-screen pt-8 pb-16 px-4 flex flex-col items-center relative">
      <DecorativeBackground />
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="flex items-center">
          <KawaiiCharacter variant={kawaiiMood} className="mr-3" />
          <h1 className="text-3xl md:text-4xl font-display bg-gradient-to-r from-kawaii-pink-dark to-kawaii-purple-dark bg-clip-text text-transparent">Kawaii Calculator</h1>
        </div>
        <div className="flex items-center">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <SoundToggle isSoundEnabled={isSoundEnabled} toggleSound={toggleSound} />
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col md:flex-row gap-6">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="kawaii-container md:w-7/12">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="basic" className={`kawaii-tab w-1/3 ${calculatorMode === 'basic' ? 'active' : ''}`} onClick={() => handleModeChange('basic')}>
                🧮 Basic
              </TabsTrigger>
              <TabsTrigger value="scientific" className={`kawaii-tab w-1/3 ${calculatorMode === 'scientific' ? 'active' : ''}`} onClick={() => handleModeChange('scientific')}>
                🧪 Scientific
              </TabsTrigger>
              <TabsTrigger value="converter" className={`kawaii-tab w-1/3 ${calculatorMode === 'converter' ? 'active' : ''}`} onClick={() => handleModeChange('converter')}>
                📐 Converter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-0">
              <BasicCalculator input={input} setInput={setInput} result={result} setResult={setResult} addToHistory={addToHistory} memory={memory} setMemory={setMemory} isSoundEnabled={isSoundEnabled} cursorPosition={cursorPosition} setCursorPosition={setCursorPosition} />
            </TabsContent>
            
            <TabsContent value="scientific" className="mt-0">
              <ScientificCalculator input={input} setInput={setInput} result={result} setResult={setResult} addToHistory={addToHistory} memory={memory} setMemory={setMemory} isSoundEnabled={isSoundEnabled} />
            </TabsContent>
            
            <TabsContent value="converter" className="mt-0">
              <UnitConverter isSoundEnabled={isSoundEnabled} addToHistory={addToHistory} />
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="md:w-5/12">
          <HistoryPanel history={history} onHistoryItemClick={handleHistoryItemClick} onClearHistory={handleClearHistory} />
        </motion.div>
      </main>

      <div className="mt-4 text-xs text-center text-muted-foreground">
        <p>Keyboard shortcuts: Alt+1,2,3 (switch modes) | Ctrl+D (toggle theme) | Ctrl+S (toggle sound) | Shift+Enter (convert)</p>
      </div>

      <motion.footer initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 1,
      delay: 0.6
    }} className="mt-6 text-center text-sm text-muted-foreground">
        <p>Kawaii Math Lab • Made with ❤️</p>
        <p className="mt-1">Your cute math companion</p>
      </motion.footer>
    </div>;
};
export default Index;