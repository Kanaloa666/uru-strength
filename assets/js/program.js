function roundTo5(num) {
  return Math.round(num / 5) * 5;
}

function pct(max, percent) {
  return roundTo5(max * percent);
}

function generateProgram(maxes) {
  return {
    cycleName: "URU Forge Cycle",
    currentWeek: 1,
    weeks: [
      {
        name: "Foundation",
        focus: "Technique + work capacity"
      },
      {
        name: "Strength",
        focus: "Heavy loading"
      },
      {
        name: "Power",
        focus: "Explosive intent + heavy exposure"
      },
      {
        name: "Deload",
        focus: "Recovery + movement quality"
      }
    ],
    preview: {
      bench70: pct(maxes.bench, 0.7),
      squat70: pct(maxes.squat, 0.7),
      sgdl65: pct(maxes.sgdl, 0.65)
    }
  };
}
