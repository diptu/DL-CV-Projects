import React from "react";

const ConvolutionVisualizer = ({
  input,
  filter,
  padding = 0,
  stride = 1,
  selectedCell,
  setSelectedCell,
}) => {
  const kernelSize = filter.length;
  const inputRows = input.length;
  const inputCols = input[0].length;

  const paddedRows = inputRows + 2 * padding;
  const paddedCols = inputCols + 2 * padding;

  // Create zero-padded input matrix
  const paddedInput = Array.from({ length: paddedRows }, (_, r) =>
    Array.from({ length: paddedCols }, (_, c) => {
      const ir = r - padding;
      const ic = c - padding;
      if (ir >= 0 && ir < inputRows && ic >= 0 && ic < inputCols) {
        return input[ir][ic];
      }
      return 0;
    })
  );

  const outputRows = Math.floor((paddedRows - kernelSize) / stride) + 1;
  const outputCols = Math.floor((paddedCols - kernelSize) / stride) + 1;

  let min = Infinity;
  let max = -Infinity;
  const output = [];

  for (let i = 0; i < outputRows; i++) {
    const row = [];
    for (let j = 0; j < outputCols; j++) {
      let sum = 0;
      for (let ki = 0; ki < kernelSize; ki++) {
        for (let kj = 0; kj < kernelSize; kj++) {
          sum += paddedInput[i * stride + ki][j * stride + kj] * filter[ki][kj];
        }
      }
      row.push(sum);
      if (sum < min) min = sum;
      if (sum > max) max = sum;
    }
    output.push(row);
  }

  const getColor = (value) => {
    let scaledValue = 0;
    if (max !== min) {
      scaledValue = ((value - min) / (max - min)) * 255;
    }
    scaledValue = Math.min(255, Math.max(0, scaledValue));
    const colorVal = Math.round(scaledValue);
    const textColor = colorVal < 128 ? "white" : "black";
    return {
      backgroundColor: `rgb(${colorVal}, ${colorVal}, ${colorVal})`,
      color: textColor,
    };
  };

  // Tooltip text with formula and current params
  const tooltipText = `
    📐 Convolved Output Shape Formula:
    Output Height = floor((Input Height + 2 × Padding - Kernel Size) / Stride) + 1
    Output Width = floor((Input Width + 2 × Padding - Kernel Size) / Stride) + 1
    
    Input: ${inputRows}×${inputCols}, Kernel: ${kernelSize}×${kernelSize}, Padding: ${padding}, Stride: ${stride}
    Output: ${outputRows} × ${outputCols}
  `;

  return (
    <div
      className="flex flex-col items-center bg-gray-50 p-4 rounded shadow max-w-full overflow-auto"
      title={tooltipText}
      style={{ whiteSpace: "pre-line", cursor: "help" }}
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${outputCols}, 2.5rem)`,
        }}
      >
        {output.map((row, i) =>
          row.map((val, j) => {
            const style = getColor(val);
            if (selectedCell && selectedCell.row === i && selectedCell.col === j) {
              style.border = "3px solid #2563eb"; // Blue border for selected
            } else {
              style.border = "1px solid #ccc";
            }
            return (
              <div
                key={`${i}-${j}`}
                className="text-center w-10 h-10 p-0 m-0 flex items-center justify-center font-semibold select-none cursor-pointer"
                style={style}
                onClick={() => setSelectedCell({ row: i, col: j })}
                title={`Output cell [${i}, ${j}]`}
              >
                {val.toFixed(1)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConvolutionVisualizer;
