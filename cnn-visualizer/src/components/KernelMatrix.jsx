import React from "react";

const KernelMatrix = ({ matrix, setMatrix }) => {
  // Find min and max values in the matrix (treat empty as 0)
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

  const getColor = (value) => {
    let numVal = value === "" ? 0 : Number(value);

    // Handle case min === max to avoid division by zero
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
    };
  };

  const onChange = (rowIdx, colIdx, val) => {
    if (val === "") {
      const newMatrix = matrix.map((row, i) =>
        i === rowIdx ? row.map((v, j) => (j === colIdx ? val : v)) : row
      );
      setMatrix(newMatrix);
      return;
    }
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const newMatrix = matrix.map((row, i) =>
      i === rowIdx ? row.map((v, j) => (j === colIdx ? numVal : v)) : row
    );
    setMatrix(newMatrix);
  };

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-2">🎛️ Kernel / Filter</h2>
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 3rem)` }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((val, colIdx) => {
            const style = getColor(val);
            return (
              <input
                key={`${rowIdx}-${colIdx}`}
                type="number"
                value={val}
                onChange={(e) => onChange(rowIdx, colIdx, e.target.value)}
                className="border rounded-md shadow-sm w-12 h-12 p-0 m-0 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 hover:shadow-md cursor-text transition-shadow duration-200"
                style={style}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default KernelMatrix;
