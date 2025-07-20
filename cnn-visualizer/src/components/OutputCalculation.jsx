import React from "react";

export default function OutputCalculation({ input, filter, startRow, startCol, selectedCell }) {
  if (!input || !filter) return null;

  const kernelSize = filter.length;
  const inputRows = input.length;
  const inputCols = input[0].length;

  if (startRow + kernelSize > inputRows || startCol + kernelSize > inputCols) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Selected cell is out of bounds for the current kernel size.
      </div>
    );
  }

  let sum = 0;
  const steps = [];

  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      const r = startRow + i;
      const c = startCol + j;
      const inputVal = input[r][c];
      const filterVal = filter[i][j];
      const product = inputVal * filterVal;
      sum += product;
      steps.push({ r, c, inputVal, i, j, filterVal, product });
    }
  }

  // Determine if this output calculation should be highlighted (when selectedCell matches startRow, startCol)
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

          // Highlight individual step cell if it is part of the current selected convolution cell
          const isStepHighlighted = isHighlightedOutput;

          return (
            <div
              key={`${i}-${j}`}
              className={`border rounded-md w-24 min-h-[5.5rem] flex flex-col justify-center items-center text-xs font-mono font-semibold shadow-sm px-2 text-center
                ${bgColor}
                ${isStepHighlighted ? "ring-2 ring-blue-500" : ""}
              `}
              style={{
                lineHeight: "1.1",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              <div>{`Input[${r},${c}](${inputVal})`}</div>
              <div>×</div>
              <div>{`Kernel[${i},${j}](${filterVal})`}</div>
              <div>= {product}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
