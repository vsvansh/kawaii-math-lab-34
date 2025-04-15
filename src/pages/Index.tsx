
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicCalculator from '@/components/BasicCalculator';
import ScientificCalculator from '@/components/ScientificCalculator';
import UnitConverter from '@/components/UnitConverter';
import HistoryPanel from '@/components/HistoryPanel';
import ThemeToggle from '@/components/ThemeToggle';
import KawaiiCharacter from '@/components/KawaiiCharacter';
import { DecorativeBackground } from '@/components/DecorativeElements';
import { motion } from 'framer-motion';

interface HistoryItem {
  input: string;
  result: string;
  timestamp: number;
}

const Index = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'scientific' | 'converter'>('basic');
  const [showHistory, setShowHistory] = useState(false);
  const [kawaiiMood, setKawaiiMood] = useState<'happy' | 'curious' | 'sleepy' | 'excited'>('happy');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [memory, setMemory] = useState<string | null>(null);

  // Initialize theme from user preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme
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

  // Update kawaii character based on calculator activity
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

  // Add item to history
  const addToHistory = (input: string, result: string) => {
    setHistory(prev => [
      {
        input,
        result,
        timestamp: Date.now()
      },
      ...prev
    ]);
  };

  // Use history item
  const handleHistoryItemClick = (input: string) => {
    setInput(input);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Handle numbers and operators
      if (/^[0-9+\-*/().%]$/.test(key)) {
        setInput(prev => prev + key);
      }
      
      // Handle equals and enter
      if (key === '=' || key === 'Enter') {
        event.preventDefault(); // Prevent form submission if in a form
        document.querySelector('button[value="="]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }
      
      // Handle backspace
      if (key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
      }
      
      // Handle escape (clear)
      if (key === 'Escape') {
        setInput('');
        setResult('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 flex flex-col items-center relative">
      <DecorativeBackground />
      {/* Header & Theme Toggle */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="flex items-center">
          <KawaiiCharacter variant={kawaiiMood} className="mr-3" />
          <h1 className="text-3xl md:text-4xl font-display bg-gradient-to-r from-kawaii-pink-dark to-kawaii-purple-dark bg-clip-text text-transparent">
            Kawaii Math Lab
          </h1>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl flex flex-col md:flex-row gap-6">
        {/* Calculator Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="kawaii-container md:w-7/12"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger 
                value="basic" 
                className={`kawaii-tab w-1/3 ${calculatorMode === 'basic' ? 'active' : ''}`}
                onClick={() => setCalculatorMode('basic')}
              >
                🧮 Basic
              </TabsTrigger>
              <TabsTrigger 
                value="scientific" 
                className={`kawaii-tab w-1/3 ${calculatorMode === 'scientific' ? 'active' : ''}`}
                onClick={() => setCalculatorMode('scientific')}
              >
                🧪 Scientific
              </TabsTrigger>
              <TabsTrigger 
                value="converter" 
                className={`kawaii-tab w-1/3 ${calculatorMode === 'converter' ? 'active' : ''}`}
                onClick={() => setCalculatorMode('converter')}
              >
                📐 Converter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-0">
              <BasicCalculator 
                input={input}
                setInput={setInput}
                result={result}
                setResult={setResult}
                addToHistory={addToHistory}
                memory={memory}
                setMemory={setMemory}
              />
            </TabsContent>
            
            <TabsContent value="scientific" className="mt-0">
              <ScientificCalculator 
                input={input}
                setInput={setInput}
                result={result}
                setResult={setResult}
                addToHistory={addToHistory}
                memory={memory}
                setMemory={setMemory}
              />
            </TabsContent>
            
            <TabsContent value="converter" className="mt-0">
              <UnitConverter />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* History Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-5/12"
        >
          <HistoryPanel 
            history={history}
            onHistoryItemClick={handleHistoryItemClick}
            onClearHistory={handleClearHistory}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-12 text-center text-sm text-muted-foreground"
      >
        <p>Kawaii Math Lab • Made with ❤️</p>
        <p className="mt-1">Your cute math companion</p>
      </motion.footer>
    </div>
  );
};

export default Index;
