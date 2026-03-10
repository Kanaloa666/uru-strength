function createScorecardEntry(values) {
  return {
    date: values.date,
    bodyweight: Number(values.bodyweight || 0),
    benchTop: Number(values.benchTop || 0),
    sgdlTop: Number(values.sgdlTop || 0),
    thrusterLoad: Number(values.thrusterLoad || 0),
    thrusterTime: values.thrusterTime || "",
    circuitRounds: Number(values.circuitRounds || 0),
    notes: values.notes || ""
  };
}
