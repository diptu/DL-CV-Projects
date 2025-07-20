import React from "react";

const ColorPreview = ({ matrix }) => {
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
    let scaled = 255;
    if (max !== min) {
      scaled = ((numVal - min) / (max - min)) * 255;
    }
    scaled = Math.min(255, Math.max(0, scaled));
    const colorVal = Math.round(scaled);
    return `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
  };

  return (
    <div
      className="inline-grid rounded overflow-hidden shadow"
      style={{
        gridTemplateColumns: `repeat(${matrix[0].length}, 12px)`,
        gridAutoRows: "12px",
        gap: "0",
        width: matrix[0].length * 12,
        height: matrix.length * 12,
      }}
      aria-label="Color preview thumbnail"
      role="img"
    >
      {matrix.flat().map((val, idx) => (
        <div
          key={idx}
          style={{ backgroundColor: getColor(val), width: 12, height: 12 }}
        />
      ))}
    </div>
  );
};

export default ColorPreview;
