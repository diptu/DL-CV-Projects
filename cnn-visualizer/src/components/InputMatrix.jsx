import React from "react";

const InputMatrix = ({
  matrix,
  setMatrix,
  selectedCell,
  kernelSize,
  kernelMatrix,
  padding = 0,
}) => {
  const totalRows = matrix.length + 2 * padding;
  const totalCols = (matrix[0]?.length || 0) + 2 * padding;

  const getMinMax = (matrix) => {
    let min = Infinity,
      max = -Infinity;
    matrix.forEach((row) =>
      row.forEach((val) => {
        const numVal = val === "" ? 0 : Number(val);
        if (numVal < min) min = numVal;
        if (numVal > max) max = numVal;
      })
    );
    return { min, max };
  };

  const { min, max } = getMinMax(matrix);

  const getBaseColor = (value) => {
    let numVal = value === "" ? 0 : Number(value);
    let scaled = 255;
    if (max !== min) {
      scaled = ((numVal - min) / (max - min)) * 255;
    }
    scaled = Math.min(255, Math.max(0, scaled));
    const colorVal = Math.round(scaled);
    const textColor = colorVal < 128 ? "white" : "black";

    return {
      backgroundColor: `rgb(${colorVal}, ${colorVal}, ${colorVal})`,
      color: textColor,
      position: "relative",
      zIndex: 1,
    };
  };

  const isHighlighted = (rowIdx, colIdx) => {
    if (!selectedCell || !kernelSize) return false;
    const { row, col } = selectedCell;
    return (
      rowIdx >= row + padding &&
      rowIdx < row + padding + kernelSize &&
      colIdx >= col + padding &&
      colIdx < col + padding + kernelSize
    );
  };

  const getKernelValue = (rowIdx, colIdx) => {
    if (!isHighlighted(rowIdx, colIdx)) return null;
    const ki = rowIdx - (selectedCell.row + padding);
    const kj = colIdx - (selectedCell.col + padding);
    return kernelMatrix?.[ki]?.[kj];
  };

  const onChange = (rowIdx, colIdx, val) => {
    if (
      rowIdx < padding ||
      rowIdx >= matrix.length + padding ||
      colIdx < padding ||
      colIdx >= (matrix[0]?.length || 0) + padding
    ) {
      return;
    }

    const realRow = rowIdx - padding;
    const realCol = colIdx - padding;

    if (val === "") {
      const newMatrix = matrix.map((row, i) =>
        i === realRow ? row.map((v, j) => (j === realCol ? val : v)) : row
      );
      setMatrix(newMatrix);
      return;
    }
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const newMatrix = matrix.map((row, i) =>
      i === realRow ? row.map((v, j) => (j === realCol ? numVal : v)) : row
    );
    setMatrix(newMatrix);
  };

  return (
    <div className="text-center relative">
      <h2 className="text-lg font-semibold mb-1">📥 Input Matrix</h2>
      <div
        className="grid gap-0 relative"
        style={{ gridTemplateColumns: `repeat(${totalCols}, 3rem)` }}
      >
        {Array.from({ length: totalRows }).map((_, rowIdx) =>
          Array.from({ length: totalCols }).map((_, colIdx) => {
            const inPadding =
              rowIdx < padding ||
              rowIdx >= matrix.length + padding ||
              colIdx < padding ||
              colIdx >= (matrix[0]?.length || 0) + padding;

            if (inPadding) {
              return (
                <input
                  key={`${rowIdx}-${colIdx}`}
                  type="number"
                  value={0}
                  disabled
                  readOnly
                  className="border rounded-md w-12 h-12 p-0 m-0 text-center font-semibold cursor-not-allowed bg-gray-200 text-gray-400"
                  style={{ width: "3rem", height: "3rem" }}
                  tabIndex={-1}
                />
              );
            } else {
              const val = matrix[rowIdx - padding][colIdx - padding];
              const style = getBaseColor(val);
              const kernelVal = getKernelValue(rowIdx, colIdx);
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className="relative"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => onChange(rowIdx, colIdx, e.target.value)}
                    className="border rounded-md shadow-sm w-full h-full p-0 m-0 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md cursor-text transition-shadow duration-200 relative z-10"
                    style={style}
                  />
                  {kernelVal !== null && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          backgroundColor: "rgba(59, 130, 246, 0.4)",
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          padding: "1px 4px",
                          borderRadius: "4px",
                          pointerEvents: "none",
                          userSelect: "none",
                          zIndex: 20,
                          whiteSpace: "nowrap",
                        }}
                        title={`Kernel: ${kernelVal}`}
                      >
                        {kernelVal}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(59, 130, 246, 0.25)",
                          pointerEvents: "none",
                          borderRadius: "0.375rem",
                          zIndex: 5,
                        }}
                      />
                    </>
                  )}
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
};

export default InputMatrix;
