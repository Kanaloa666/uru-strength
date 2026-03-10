const URU_STORAGE_KEY = "uru_strength_v4";

function getDefaultData() {
  return {
    profile: null,
    program: null,
    logs: [],
    scorecards: [],
    currentWorkout: { weekIndex: 0, dayIndex: 0 },

    // NEW: UI prefs
    ui: {
      archiveExpanded: false,
      gymMode: false,
      gymLiftIndex: 0,
      gymShowAccessories: true
    },

    // set tracking for checkboxes + notes
    setTracking: {}
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(URU_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : getDefaultData();

    // Backfill new fields safely
    if (!data.ui) data.ui = getDefaultData().ui;
    if (typeof data.ui.archiveExpanded !== "boolean") data.ui.archiveExpanded = false;
    if (typeof data.ui.gymMode !== "boolean") data.ui.gymMode = false;
    if (typeof data.ui.gymLiftIndex !== "number") data.ui.gymLiftIndex = 0;
    if (typeof data.ui.gymShowAccessories !== "boolean") data.ui.gymShowAccessories = true;

    if (!data.setTracking) data.setTracking = {};
    if (!data.currentWorkout) data.currentWorkout = { weekIndex: 0, dayIndex: 0 };

    return data;
  } catch {
    return getDefaultData();
  }
}

function saveAppData(data) {
  localStorage.setItem(URU_STORAGE_KEY, JSON.stringify(data));
}
