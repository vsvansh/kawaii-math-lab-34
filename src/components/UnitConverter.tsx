
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { playButtonSound } from '@/utils/soundUtils';

// Unit conversion types
type ConversionCategory = 'length' | 'temperature' | 'weight' | 'time' | 'volume' | 'area' | 'speed' | 'data' | 'pressure' | 'energy';

interface UnitConverterProps {
  className?: string;
  isSoundEnabled?: boolean;
  addToHistory?: (input: string, result: string) => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ 
  className, 
  isSoundEnabled = false,
  addToHistory
}) => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [lastCategory, setLastCategory] = useState<ConversionCategory>('length');

  // Define conversion factors for each category
  const conversionFactors = {
    length: {
      'Meters': 1,
      'Kilometers': 0.001,
      'Centimeters': 100,
      'Millimeters': 1000,
      'Miles': 0.000621371,
      'Yards': 1.09361,
      'Feet': 3.28084,
      'Inches': 39.3701
    },
    temperature: {
      'Celsius': 'c',
      'Fahrenheit': 'f',
      'Kelvin': 'k'
    },
    weight: {
      'Kilograms': 1,
      'Grams': 1000,
      'Milligrams': 1000000,
      'Pounds': 2.20462,
      'Ounces': 35.274
    },
    time: {
      'Seconds': 1,
      'Minutes': 1/60,
      'Hours': 1/3600,
      'Days': 1/86400,
      'Weeks': 1/604800
    },
    volume: {
      'Liters': 1,
      'Milliliters': 1000,
      'Cubic Meters': 0.001,
      'Gallons (US)': 0.264172,
      'Quarts': 1.05669,
      'Pints': 2.11338,
      'Cups': 4.22675,
      'Fluid Ounces': 33.814
    },
    area: {
      'Square Meters': 1,
      'Square Kilometers': 0.000001,
      'Square Miles': 3.861e-7,
      'Square Feet': 10.7639,
      'Square Yards': 1.19599,
      'Acres': 0.000247105,
      'Hectares': 0.0001
    },
    speed: {
      'Meters/Second': 1,
      'Kilometers/Hour': 3.6,
      'Miles/Hour': 2.23694,
      'Knots': 1.94384,
      'Feet/Second': 3.28084
    },
    data: {
      'Bytes': 1,
      'Kilobytes': 0.001,
      'Megabytes': 0.000001,
      'Gigabytes': 1e-9,
      'Terabytes': 1e-12,
      'Bits': 8,
      'Kibibytes': 0.0009765625,
      'Mebibytes': 9.5367e-7
    },
    pressure: {
      'Pascal': 1,
      'Kilopascal': 0.001,
      'Bar': 0.00001,
      'PSI': 0.000145038,
      'Atmosphere': 9.86923e-6,
      'mmHg': 0.00750062
    },
    energy: {
      'Joule': 1,
      'Calorie': 0.239006,
      'Kilocalorie': 0.000239006,
      'Kilowatt-hour': 2.7778e-7,
      'Electron-volt': 6.242e+18,
      'BTU': 0.000947817
    }
  };

  // Update available units when category changes
  useEffect(() => {
    const units = Object.keys(conversionFactors[category]);
    setAvailableUnits(units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    
    // Play sound when category changes
    if (category !== lastCategory && isSoundEnabled) {
      playCategoryChangeSound();
      setLastCategory(category);
    }
  }, [category, isSoundEnabled, lastCategory]);

  // Play a different sound for category changes
  const playCategoryChangeSound = () => {
    if (!isSoundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Different sound for category change - a sweet melodic sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing category change sound:", error);
    }
  };

  // Handle unit change with sound
  const handleUnitChange = (unitType: 'from' | 'to', value: string) => {
    if (isSoundEnabled) {
      playButtonSound(isSoundEnabled);
    }
    
    if (unitType === 'from') {
      setFromUnit(value);
    } else {
      setToUnit(value);
    }
  };

  // Handle category change with sound
  const handleCategoryChange = (value: ConversionCategory) => {
    setCategory(value);
  };

  // Handle input change with realtime conversion
  const handleInputChange = (value: string) => {
    setFromValue(value);
  };

  // Add calculation to history
  const addConversionToHistory = () => {
    if (addToHistory && fromValue && toValue) {
      const input = `${fromValue} ${fromUnit} to ${toUnit}`;
      const result = `${toValue} ${toUnit}`;
      addToHistory(input, result);
    }
  };

  // Handle shortcut key (Shift + Enter)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.shiftKey) {
        if (fromValue && toValue) {
          addConversionToHistory();
          if (isSoundEnabled) {
            playButtonSound(isSoundEnabled);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fromValue, toValue, isSoundEnabled, addToHistory]);

  // Update conversion when values change
  useEffect(() => {
    if (!fromUnit || !toUnit || !fromValue) {
      setToValue('');
      return;
    }

    try {
      const numericValue = parseFloat(fromValue);
      if (isNaN(numericValue)) {
        setToValue('');
        return;
      }

      // Special handling for temperature
      if (category === 'temperature') {
        let result: number;
        
        // Convert from source temp to Celsius as intermediate
        let celsiusValue: number;
        if (fromUnit === 'Celsius') {
          celsiusValue = numericValue;
        } else if (fromUnit === 'Fahrenheit') {
          celsiusValue = (numericValue - 32) * 5/9;
        } else { // Kelvin
          celsiusValue = numericValue - 273.15;
        }
        
        // Convert from Celsius to target temp
        if (toUnit === 'Celsius') {
          result = celsiusValue;
        } else if (toUnit === 'Fahrenheit') {
          result = (celsiusValue * 9/5) + 32;
        } else { // Kelvin
          result = celsiusValue + 273.15;
        }
        
        setToValue(result.toFixed(2));
      } else {
        // For other units, use direct conversion factors
        const fromFactor = conversionFactors[category][fromUnit as keyof typeof conversionFactors[typeof category]];
        const toFactor = conversionFactors[category][toUnit as keyof typeof conversionFactors[typeof category]];
        
        // Base unit conversion
        const baseValue = numericValue / (fromFactor as number);
        const result = baseValue * (toFactor as number);
        
        setToValue(result.toFixed(4));
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setToValue('Error');
    }
  }, [category, fromUnit, toUnit, fromValue]);

  return (
    <div className={`kawaii-card p-6 ${className}`}>
      <h3 className="text-xl font-display mb-4 text-kawaii-purple-dark dark:text-kawaii-purple-light">
        Unit Converter
      </h3>
      
      <div className="space-y-5">
        {/* Category Selection */}
        <div>
          <Label className="mb-2 block">Category</Label>
          <Select 
            value={category} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full border-kawaii-pink-light focus:ring-kawaii-pink">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="length">Length</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="speed">Speed</SelectItem>
              <SelectItem value="data">Data Storage</SelectItem>
              <SelectItem value="pressure">Pressure</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* From Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">From</Label>
            <Select 
              value={fromUnit} 
              onValueChange={(value) => handleUnitChange('from', value)}
              disabled={!availableUnits.length}
            >
              <SelectTrigger className="w-full border-kawaii-blue-light focus:ring-kawaii-blue">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Unit */}
          <div>
            <Label className="mb-2 block">To</Label>
            <Select 
              value={toUnit} 
              onValueChange={(value) => handleUnitChange('to', value)}
              disabled={!availableUnits.length}
            >
              <SelectTrigger className="w-full border-kawaii-purple-light focus:ring-kawaii-purple">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Value Conversion */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Value</Label>
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full border-kawaii-pink-light focus:ring-kawaii-pink"
            />
          </div>
          <div>
            <Label className="mb-2 block">Result</Label>
            <Input
              type="text"
              value={toValue}
              readOnly
              className="w-full border-kawaii-blue-light bg-kawaii-blue-light/20 focus:ring-kawaii-blue"
            />
          </div>
        </div>

        {/* Shortcut hint */}
        <div className="mt-4 text-center text-xs text-kawaii-purple">
          <p>Press Shift + Enter to add to history</p>
          <span className="inline-block animate-bounce-small mt-2">≖ ‿ ≖</span>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
