import React, { useState, useEffect } from "react";
import InputMatrix from "./components/InputMatrix";
import KernelMatrix from "./components/KernelMatrix";
import ConvolutionVisualizer from "./components/ConvolutionVisualizer";
import ColorPreview from "./components/ColorPreview";
import OutputCalculation from "./components/OutputCalculation";

const createMatrix = (rows, cols, fillValue = 0) =>
  Array.from({ length: rows }, () => Array(cols).fill(fillValue));

const computeOutputMatrix = (input, kernel, padding, stride) => {
  const kernelSize = kernel.length;
  if (kernelSize === 0) return [[]];

  const inputRows = input.length;
  const inputCols = input[0]?.length || 0;

  // Padded input dimensions
  const paddedRows = inputRows + 2 * padding;
  const paddedCols = inputCols + 2 * padding;

  // Output matrix dimensions
  const outputRows = Math.floor((paddedRows - kernelSize) / stride) + 1;
  const outputCols = Math.floor((paddedCols - kernelSize) / stride) + 1;
  if (outputRows <= 0 || outputCols <= 0) return [[]];

  // Create zero-padded input
  const paddedInput = createMatrix(paddedRows, paddedCols, 0);
  for (let r = 0; r < inputRows; r++) {
    for (let c = 0; c < inputCols; c++) {
      paddedInput[r + padding][c + padding] = input[r][c];
    }
  }

  // Compute convolution output
  const output = [];
  for (let i = 0; i < outputRows; i++) {
    const row = [];
    for (let j = 0; j < outputCols; j++) {
      let sum = 0;
      for (let ki = 0; ki < kernelSize; ki++) {
        for (let kj = 0; kj < kernelSize; kj++) {
          sum += paddedInput[i * stride + ki][j * stride + kj] * kernel[ki][kj];
        }
      }
      row.push(sum);
    }
    output.push(row);
  }
  return output;
};

// Predefined common kernels
const commonKernels = {
  Custom: null,
  "Sobel X": [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ],
  "Sobel Y": [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ],
  "Prewitt X": [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ],
  "Prewitt Y": [
    [1, 1, 1],
    [0, 0, 0],
    [-1, -1, -1],
  ],
  Sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  "Edge Detect": [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1],
  ],
  "Box Blur": [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
};

export default function App() {
  const [inputRows, setInputRows] = useState(6);
  const [inputCols, setInputCols] = useState(6);
  const [kernelSize, setKernelSize] = useState(3);
  const [padding, setPadding] = useState(0);
  const [stride, setStride] = useState(1);

  const initialInput = [
    [10, 10, 10, 0, 0, 0],
    [10, 10, 10, 0, 0, 0],
    [10, 10, 10, 0, 0, 0],
    [10, 10, 10, 0, 0, 0],
    [10, 10, 10, 0, 0, 0],
    [10, 10, 10, 0, 0, 0],
  ];

  // Start with Prewitt X by default
  const [selectedKernelName, setSelectedKernelName] = useState("Prewitt X");
  const [inputMatrix, setInputMatrix] = useState(initialInput);
  const [kernelMatrix, setKernelMatrix] = useState(commonKernels[selectedKernelName]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate max kernel size so output matrix doesn't become empty
  const maxKernelSize = Math.min(
    inputRows + 2 * padding,
    inputCols + 2 * padding
  );

  // When kernel size, input dims, or padding changes, restrict kernel size
  useEffect(() => {
    if (kernelSize > maxKernelSize) {
      setKernelSize(maxKernelSize);
      setSelectedKernelName("Custom");
    }
  }, [inputRows, inputCols, padding, maxKernelSize]);

  // When input rows or cols change, resize input matrix preserving data
  useEffect(() => {
    setInputMatrix((oldMatrix) => {
      const newMatrix = createMatrix(inputRows, inputCols, 0);
      for (let r = 0; r < Math.min(oldMatrix.length, inputRows); r++) {
        for (let c = 0; c < Math.min(oldMatrix[0].length, inputCols); c++) {
          newMatrix[r][c] = oldMatrix[r][c];
        }
      }
      return newMatrix;
    });
  }, [inputRows, inputCols]);

  // When kernel size changes manually, resize kernel matrix preserving data
  useEffect(() => {
    setKernelMatrix((oldKernel) => {
      if (!oldKernel) return createMatrix(kernelSize, kernelSize, 0);
      const newKernel = createMatrix(kernelSize, kernelSize, 0);
      for (let r = 0; r < Math.min(oldKernel.length, kernelSize); r++) {
        for (let c = 0; c < Math.min(oldKernel[0].length, kernelSize); c++) {
          newKernel[r][c] = oldKernel[r][c];
        }
      }
      return newKernel;
    });
  }, [kernelSize]);

  // When user selects a predefined kernel filter
  const onKernelSelect = (name) => {
    setSelectedKernelName(name);
    if (name === "Custom") {
      return;
    }
    const kernel = commonKernels[name];
    setKernelMatrix(kernel);
    setKernelSize(kernel.length);
  };

  const outputMatrix = computeOutputMatrix(inputMatrix, kernelMatrix, padding, stride);
  const outputRows = outputMatrix.length;
  const outputCols = outputMatrix[0]?.length || 0;

  // Animation function to iterate over all output cells
  const startAnimation = async () => {
    setIsAnimating(true);
    for (let i = 0; i < outputRows; i++) {
      for (let j = 0; j < outputCols; j++) {
        setSelectedCell({ row: i, col: j });
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center gap-4 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-xl overflow-auto">
        {/* Input Rows */}
        <div>
          <label className="block font-semibold mb-1">Input Rows</label>
          <input
            type="number"
            min={1}
            value={inputRows}
            onChange={(e) => setInputRows(Math.max(1, Math.floor(Number(e.target.value))))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* Input Columns */}
        <div>
          <label className="block font-semibold mb-1">Input Columns</label>
          <input
            type="number"
            min={1}
            value={inputCols}
            onChange={(e) => setInputCols(Math.max(1, Math.floor(Number(e.target.value))))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* Kernel Size */}
        <div>
          <label className="block font-semibold mb-1">Kernel Size</label>
          <input
            type="number"
            min={1}
            max={maxKernelSize}
            value={kernelSize}
            onChange={(e) => {
              let val = Math.floor(Number(e.target.value));
              if (isNaN(val) || val < 1) val = 1;
              if (val > maxKernelSize) val = maxKernelSize;
              setKernelSize(val);
              setSelectedKernelName("Custom");
            }}
            className="border rounded px-2 py-1 w-20"
          />
          <small className="text-xs text-gray-500">Max: {maxKernelSize}</small>
        </div>

        {/* Padding */}
        <div>
          <label className="block font-semibold mb-1">Padding</label>
          <input
            type="number"
            min={0}
            max={10}
            value={padding}
            onChange={(e) => setPadding(Math.max(0, Math.floor(Number(e.target.value))))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* Stride */}
        <div>
          <label className="block font-semibold mb-1">Stride</label>
          <input
            type="number"
            min={1}
            max={10}
            value={stride}
            onChange={(e) => setStride(Math.max(1, Math.floor(Number(e.target.value))))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* Kernel Filter Selection */}
        <div>
          <label className="block font-semibold mb-1">Select Kernel Filter</label>
          <select
            value={selectedKernelName}
            onChange={(e) => onKernelSelect(e.target.value)}
            className="border rounded px-2 py-1 w-40"
          >
            {Object.keys(commonKernels).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Animate Button */}
      <button
        onClick={startAnimation}
        disabled={isAnimating}
        className={`px-4 py-2 rounded text-white font-semibold transition
          ${isAnimating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isAnimating ? "Animating..." : "Animate Output Calculation"}
      </button>

      {/* Matrices: Input & Kernel */}
      <div className="flex flex-wrap justify-center gap-4 w-full overflow-auto">
        <div className="flex flex-col items-center gap-1">
          <InputMatrix
            matrix={inputMatrix}
            setMatrix={setInputMatrix}
            selectedCell={selectedCell}
            kernelSize={kernelMatrix?.length || kernelSize}
            kernelMatrix={kernelMatrix}
            padding={padding}
            stride={stride}
          />
          <ColorPreview matrix={inputMatrix} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <KernelMatrix
            matrix={kernelMatrix}
            setMatrix={setKernelMatrix}
            selectedCell={selectedCell}
            kernelSize={kernelMatrix?.length || kernelSize}
          />
          <ColorPreview matrix={kernelMatrix} />
        </div>
      </div>

      {/* Output & Calculation */}
      <div className="flex flex-wrap justify-center gap-4 w-full overflow-auto">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-semibold mb-2">📤 Convolved Output</h2>
          <ConvolutionVisualizer
            input={inputMatrix}
            filter={kernelMatrix}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            padding={padding}
            stride={stride}
          />
          <ColorPreview matrix={outputMatrix} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-semibold mb-2">🧮 Output Calculation</h2>
          {selectedCell && (
            <OutputCalculation
              input={inputMatrix}
              filter={kernelMatrix}
              startRow={selectedCell.row}
              startCol={selectedCell.col}
              highlightCells={true}
              padding={padding}
              stride={stride}
            />
          )}
        </div>
      </div>
    </div>
  );
}
