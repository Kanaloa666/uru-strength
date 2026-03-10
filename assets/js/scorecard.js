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

function applyNewMaxesFromScorecard(state, card) {
  if (!state.profile || !state.profile.maxes) return;

  if (card.benchTop > 0) {
    state.profile.maxes.bench = card.benchTop;
  }

  if (card.sgdlTop > 0) {
    state.profile.maxes.sgdl = card.sgdlTop;
    state.profile.maxes.deadlift = card.sgdlTop;
  }
}
