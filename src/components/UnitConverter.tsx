
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Unit conversion types
type ConversionCategory = 'length' | 'temperature' | 'weight' | 'time';

interface UnitConverterProps {
  className?: string;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ className }) => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

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
    }
  };

  // Update available units when category changes
  useEffect(() => {
    const units = Object.keys(conversionFactors[category]);
    setAvailableUnits(units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [category]);

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
            onValueChange={(value) => setCategory(value as ConversionCategory)}
          >
            <SelectTrigger className="w-full border-kawaii-pink-light focus:ring-kawaii-pink">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="length">Length</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* From Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">From</Label>
            <Select 
              value={fromUnit} 
              onValueChange={setFromUnit}
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
              onValueChange={setToUnit}
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
              onChange={(e) => setFromValue(e.target.value)}
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

        {/* Cute Decoration */}
        <div className="mt-4 text-center text-sm text-kawaii-purple">
          <span className="inline-block animate-bounce-small">≖ ‿ ≖</span>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
