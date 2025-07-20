import React from "react";

export default function OutputCalculation({
  input,
  filter,
  startRow,
  startCol,
  padding = 0,
  stride = 1,
  selectedCell,
}) {
  if (!input || !filter) return null;

  const kernelSize = filter.length;
  const inputRows = input.length;
  const inputCols = input[0].length;

  // Dimensions of padded input
  const paddedRows = inputRows + 2 * padding;
  const paddedCols = inputCols + 2 * padding;

  // Calculate starting position in padded input based on stride
  const paddedStartRow = startRow * stride;
  const paddedStartCol = startCol * stride;

  // Check if the kernel fits in padded input window starting here
  if (
    paddedStartRow < 0 ||
    paddedStartCol < 0 ||
    paddedStartRow + kernelSize > paddedRows ||
    paddedStartCol + kernelSize > paddedCols
  ) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Selected cell is out of bounds for the current kernel, padding, or stride.
      </div>
    );
  }

  // Build zero-padded input matrix
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

  let sum = 0;
  const steps = [];

  // Compute convolution step for this output cell
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      const r = paddedStartRow + i;
      const c = paddedStartCol + j;
      const inputVal = paddedInput[r][c];
      const filterVal = filter[i][j];
      const product = inputVal * filterVal;
      sum += product;
      steps.push({ r, c, inputVal, i, j, filterVal, product });
    }
  }

  // Highlight output cell if selected
  const isHighlightedOutput =
    selectedCell && selectedCell.row === startRow && selectedCell.col === startCol;

  return (
    <div
      className={`text-center space-y-4 transition-shadow duration-300 ${
        isHighlightedOutput ? "ring-2 ring-blue-400 rounded-md" : ""
      }`}
    >
      <div
        className="grid gap-2 justify-center"
        style={{ gridTemplateColumns: `repeat(${kernelSize}, 6rem)` }}
      >
        {steps.map(({ r, c, inputVal, i, j, filterVal, product }) => {
          const bgColor =
            (i + j) % 3 === 0
              ? "bg-white text-black"
              : (i + j) % 3 === 1
              ? "bg-gray-400 text-black"
              : "bg-black text-white";

          return (
            <div
              key={`${i}-${j}`}
              className={`border rounded-md w-24 min-h-[5.5rem] flex flex-col justify-center items-center text-xs font-mono font-semibold shadow-sm px-2 text-center
                ${bgColor}
                ${isHighlightedOutput ? "ring-2 ring-blue-500" : ""}
              `}
              style={{
                lineHeight: "1.1",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
              title={`Padded Input[${r},${c}](${inputVal}) × Kernel[${i},${j}](${filterVal}) = ${product}`}
            >
              <div>{`Input[${r},${c}](${inputVal})`}</div>
              <div>×</div>
              <div>{`Kernel[${i},${j}](${filterVal})`}</div>
              <div>= {product}</div>
            </div>
          );
        })}
      </div>
      <div className="font-semibold text-lg">Sum = {sum}</div>
    </div>
  );
}
