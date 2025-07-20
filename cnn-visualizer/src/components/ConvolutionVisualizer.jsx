import React from "react";

const ConvolutionVisualizer = ({ input, filter }) => {
  const convolve = (input, kernel) => {
    const kernelSize = kernel.length;
    const outputRows = input.length - kernelSize + 1;
    const outputCols = input[0].length - kernelSize + 1;
    const output = [];

    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < outputRows; i++) {
      const row = [];
      for (let j = 0; j < outputCols; j++) {
        let sum = 0;
        for (let ki = 0; ki < kernelSize; ki++) {
          for (let kj = 0; kj < kernelSize; kj++) {
            sum += input[i + ki][j + kj] * kernel[ki][kj];
          }
        }
        row.push(sum);
        min = Math.min(min, sum);
        max = Math.max(max, sum);
      }
      output.push(row);
    }

    return { output, min, max };
  };

  const { output, min, max } = convolve(input, filter);

  const getColor = (value) => {
    // Clamp values to 0-255 range for coloring
    let scaledValue = 0;
    if (max !== min) {
      // Scale value linearly between 0 and 255
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

  return (
    <div className="flex flex-col items-center bg-gray-50 p-4 rounded shadow">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${output[0].length}, 2.5rem)`,
        }}
      >
        {output.flat().map((val, idx) => {
          const style = getColor(val);
          return (
            <div
              key={idx}
              className="border text-center w-10 h-10 p-0 m-0 flex items-center justify-center font-semibold"
              style={style}
            >
              {val.toFixed(1)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConvolutionVisualizer;
