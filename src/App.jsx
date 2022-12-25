import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css';
import Button from './Button';

const INITIAL_STATE = {
  operations: [],
  equation: [],
  currentSlotIndex: 0,
};

const ALLOWED_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

const ALLOWED_EQUATIONS = ['+', '*', '/', '-'];

function reducer(state, action) {
  switch (action.type) {
    case 'SET_OPERATION':
      return {
        ...state,
        operations: [...state.operations, action.payload],
        currentSlotIndex: state.currentSlotIndex + 1,
      };
    case 'SET_EQUATION':
      return {
        ...state,
        equation: action.payload,
      };

    case 'CALC': {
      return {
        ...INITIAL_STATE,
        equation: action.payload,
      };
    }
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

function App() {
  const [key, setKey] = useState(null);
  const [state, dispatch] = useReducer(
    (state, action) => reducer(state, action),
    INITIAL_STATE
  );

  const ref = useRef();

  const { operations, equation, currentSlotIndex } = state;

  const updateEquation = (number) => {
    const eq = [...equation];

    if (eq[currentSlotIndex]) {
      eq[currentSlotIndex] += number;
    } else {
      eq[currentSlotIndex] = number;
    }

    dispatch({ type: 'SET_EQUATION', payload: eq });
  };

  const updateOperations = (op) => {
    dispatch({ type: 'SET_OPERATION', payload: op });
  };

  const reset = () => dispatch({ type: 'RESET' });

  const shouldMinifyFont = () => {
    return equation.join('').length + operations.join('').length > 7;
  };

  const hasDecimal = (num) => !!(num % 1);

  const calculateResults = () => {
    let result = [];
    for (let [index, item] of equation.entries()) {
      result.push(item);
      if (operations[index]) {
        result.push(operations[index]);
      }
    }

    const finalResult = eval(result.join(''));

    dispatch({
      type: 'CALC',
      payload: [
        (hasDecimal(finalResult)
          ? finalResult.toFixed(1)
          : finalResult
        ).toString(),
      ],
    });
  };

  const handleKeyDown = (e) => {
    if (ALLOWED_NUMBERS.includes(e.key)) {
      updateEquation(e.key);
      setKey(e.key);
    }

    if (ALLOWED_EQUATIONS.includes(e.key)) {
      updateOperations(e.key);
      setKey(e.key);
    }

    if (e.key === 'Enter') {
      setKey(e.key);
      calculateResults();
    }

    if (e.key === 'c' || e.key === 'C') {
      setKey(e.key);
      reset();
    }
  };

  const handleKeyUp = () => {
    setKey(null);
  };

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <div
      className="container"
      ref={ref}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="calc-container">
        <div className={`result ${shouldMinifyFont() ? 'result-mini' : ''}`}>
          <p>
            {equation.map((item, index) => (
              <span key={index.toString()}>
                {item}
                {operations[index]}
              </span>
            ))}
          </p>
        </div>
        <div className="buttons-container">
          <div className="numbers-container">
            <Button active={key === '7'} onClick={() => updateEquation('7')}>
              7
            </Button>
            <Button active={key === '8'} onClick={() => updateEquation('8')}>
              8
            </Button>
            <Button active={key === '9'} onClick={() => updateEquation('9')}>
              9
            </Button>
            <Button active={key === '/'} onClick={() => updateOperations('/')}>
              /
            </Button>
            <Button active={key === '4'} onClick={() => updateEquation('4')}>
              4
            </Button>
            <Button active={key === '5'} onClick={() => updateEquation('5')}>
              5
            </Button>
            <Button active={key === '6'} onClick={() => updateEquation('6')}>
              6
            </Button>
            <Button active={key === '*'} onClick={() => updateOperations('*')}>
              &times;
            </Button>
            <Button active={key === '1'} onClick={() => updateEquation('1')}>
              1
            </Button>
            <Button active={key === '2'} onClick={() => updateEquation('2')}>
              2
            </Button>
            <Button active={key === '3'} onClick={() => updateEquation('3')}>
              3
            </Button>
            <Button active={key === '-'} onClick={() => updateOperations('-')}>
              -
            </Button>
            <Button active={key === '0'} onClick={() => updateEquation('0')}>
              0
            </Button>
            <Button active={key === '.'} onClick={() => updateEquation('0')}>
              .
            </Button>
            <Button active={key === 'c' || key === 'C'} onClick={reset}>
              C
            </Button>
            <Button active={key === '+'} onClick={() => updateOperations('+')}>
              +
            </Button>
            <Button
              active={key === 'Enter'}
              onClick={calculateResults}
              fullWidth
            >
              =
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
