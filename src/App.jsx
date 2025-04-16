import { useState, useEffect } from 'react';
import './Calculator.css';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [lastValue, setLastValue] = useState(0);
  const [degrees, setDegrees] = useState(true);
  const [shift, setShift] = useState(false);
  const [rgbSeed, setRgbSeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRgbSeed(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getRgbColor = (i, j) => {
    const r = Math.sin(0.3 * i + 0.01 * rgbSeed) * 127 + 128;
    const g = Math.sin(0.3 * j + 0.02 * rgbSeed + 2) * 127 + 128;
    const b = Math.sin(0.3 * (i + j) + 0.03 * rgbSeed + 4) * 127 + 128;
    return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`;
  };

  const clearAll = () => {
    setDisplay('0');
    setWaitingForOperand(false);
    setPendingOperator(null);
    setLastValue(0);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (operator) => {
    const value = parseFloat(display);

    if (pendingOperator === null) {
      setLastValue(value);
    } else {
      const newValue = calculate(lastValue, value, pendingOperator);
      setLastValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setPendingOperator(operator);
  };

  const calculate = (a, b, operator) => {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const calculateResult = () => {
    const value = parseFloat(display);
    
    if (pendingOperator) {
      const result = calculate(lastValue, value, pendingOperator);
      setDisplay(String(result));
      setLastValue(result);
      setPendingOperator(null);
      setWaitingForOperand(true);
    }
  };

  const applyFunction = (func) => {
    const value = parseFloat(display);
    let result;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'sin':
        result = degrees ? Math.sin(value * Math.PI / 180) : Math.sin(value);
        break;
      case 'cos':
        result = degrees ? Math.cos(value * Math.PI / 180) : Math.cos(value);
        break;
      case 'tan':
        result = degrees ? Math.tan(value * Math.PI / 180) : Math.tan(value);
        break;
      case 'asin':
        result = degrees ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
        break;
      case 'acos':
        result = degrees ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
        break;
      case 'atan':
        result = degrees ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'fact':
        result = factorial(value);
        break;
      case 'exp':
        result = Math.exp(value);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
    setWaitingForOperand(true);
  };

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
      setWaitingForOperand(true);
    }
  };

  const memoryClear = () => {
    setMemory(null);
    setWaitingForOperand(true);
  };

  const memoryAdd = () => {
    if (memory !== null) {
      setMemory(memory + parseFloat(display));
    } else {
      setMemory(parseFloat(display));
    }
    setWaitingForOperand(true);
  };

  const memorySubtract = () => {
    if (memory !== null) {
      setMemory(memory - parseFloat(display));
    } else {
      setMemory(-parseFloat(display));
    }
    setWaitingForOperand(true);
  };

  const toggleDegRad = () => {
    setDegrees(!degrees);
  };

  const toggleShift = () => {
    setShift(!shift);
  };

  const buttonLayout = [
    [
      { text: shift ? 'RAD' : 'DEG', onClick: toggleDegRad, customClass: 'mode-btn' },
      { text: 'MC', onClick: memoryClear, customClass: 'memory-btn' },
      { text: 'MR', onClick: memoryRecall, customClass: 'memory-btn' },
      { text: 'M+', onClick: memoryAdd, customClass: 'memory-btn' },
      { text: 'M-', onClick: memorySubtract, customClass: 'memory-btn' },
      { text: 'MS', onClick: memoryStore, customClass: 'memory-btn' },
    ],
    [
      { text: shift ? '2nd' : 'SHIFT', onClick: toggleShift, customClass: shift ? 'function-btn active' : 'function-btn' },
      { text: shift ? 'asin' : 'sin', onClick: () => applyFunction(shift ? 'asin' : 'sin'), customClass: 'function-btn' },
      { text: shift ? 'acos' : 'cos', onClick: () => applyFunction(shift ? 'acos' : 'cos'), customClass: 'function-btn' },
      { text: shift ? 'atan' : 'tan', onClick: () => applyFunction(shift ? 'atan' : 'tan'), customClass: 'function-btn' },
      { text: 'C', onClick: clearAll, customClass: 'clear-btn' },
      { text: 'CE', onClick: clearEntry, customClass: 'clear-btn' },
    ],
    [
      { text: shift ? 'e' : 'π', onClick: () => applyFunction(shift ? 'e' : 'pi'), customClass: 'function-btn' },
      { text: shift ? 'ln' : 'log', onClick: () => applyFunction(shift ? 'ln' : 'log'), customClass: 'function-btn' },
      { text: shift ? 'x²' : '√', onClick: () => applyFunction(shift ? 'square' : 'sqrt'), customClass: 'function-btn' },
      { text: shift ? '1/x' : 'x!', onClick: () => applyFunction(shift ? '1/x' : 'fact'), customClass: 'function-btn' },
      { text: 'e^x', onClick: () => applyFunction('exp'), customClass: 'function-btn' },
      { text: '^', onClick: () => performOperation('^'), customClass: 'operator-btn' },
    ],
    [
      { text: '7', onClick: () => inputDigit('7'), customClass: 'digit-btn' },
      { text: '8', onClick: () => inputDigit('8'), customClass: 'digit-btn' },
      { text: '9', onClick: () => inputDigit('9'), customClass: 'digit-btn' },
      { text: '÷', onClick: () => performOperation('÷'), customClass: 'operator-btn' },
      { text: '%', onClick: inputPercent, customClass: 'operator-btn' },
      { text: '×', onClick: () => performOperation('×'), customClass: 'operator-btn' },
    ],
    [
      { text: '4', onClick: () => inputDigit('4'), customClass: 'digit-btn' },
      { text: '5', onClick: () => inputDigit('5'), customClass: 'digit-btn' },
      { text: '6', onClick: () => inputDigit('6'), customClass: 'digit-btn' },
      { text: '±', onClick: toggleSign, customClass: 'operator-btn' },
      { text: '-', onClick: () => performOperation('-'), customClass: 'operator-btn' },
      { text: '+', onClick: () => performOperation('+'), customClass: 'operator-btn' },
    ],
    [
      { text: '1', onClick: () => inputDigit('1'), customClass: 'digit-btn' },
      { text: '2', onClick: () => inputDigit('2'), customClass: 'digit-btn' },
      { text: '3', onClick: () => inputDigit('3'), customClass: 'digit-btn' },
      { text: '0', onClick: () => inputDigit('0'), customClass: 'digit-btn'},
      { text: '.', onClick: inputDecimal, customClass: 'digit-btn' },
      { text: '=', onClick: calculateResult, customClass: 'equals-btn'},
    ],
  ];

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="display-status">
            {pendingOperator && `${lastValue} ${pendingOperator}`}
            {memory !== null && <span className="memory-indicator">M</span>}
            <span className="mode-indicator">{degrees ? 'DEG' : 'RAD'}</span>
          </div>
          <div className="display-value">{display}</div>
        </div>
        
        <div className="button-grid">
          {buttonLayout.map((row, rowIndex) => (
            row.map((button, colIndex) => {
              const buttonStyle = {
                backgroundColor: getRgbColor(rowIndex, colIndex),
                gridColumn: button.colSpan ? `span ${button.colSpan}` : undefined,
                gridRow: button.rowSpan ? `span ${button.rowSpan}` : undefined,
              };
              
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={button.onClick}
                  className={button.customClass}
                  style={buttonStyle}
                >
                  {button.text}
                </button>
              );
            })
          ))}
        </div>
        
        <div className="footer">
          Scientific Calculator
        </div>
      </div>
    </div>
  );
}