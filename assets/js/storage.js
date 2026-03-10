const URU_STORAGE_KEY = "uru_strength_v4";

function getDefaultData() {
  return {
    profile: null,
    program: null,
    logs: [],
    scorecards: [],
    currentWorkout: { weekIndex: 0, dayIndex: 0 },
    ui: {
      archiveExpanded: false,
      gymMode: false,
      gymLiftIndex: 0,
      gymShowAccessories: true
    },
    setTracking: {}
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(URU_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : getDefaultData();

    if (!data.profile) data.profile = null;
    if (!data.program) data.program = null;
    if (!Array.isArray(data.logs)) data.logs = [];
    if (!Array.isArray(data.scorecards)) data.scorecards = [];
    if (!data.currentWorkout) data.currentWorkout = { weekIndex: 0, dayIndex: 0 };

    if (!data.ui) data.ui = getDefaultData().ui;
    if (typeof data.ui.archiveExpanded !== "boolean") data.ui.archiveExpanded = false;
    if (typeof data.ui.gymMode !== "boolean") data.ui.gymMode = false;
    if (typeof data.ui.gymLiftIndex !== "number") data.ui.gymLiftIndex = 0;
    if (typeof data.ui.gymShowAccessories !== "boolean") data.ui.gymShowAccessories = true;

    if (!data.setTracking || typeof data.setTracking !== "object") {
      data.setTracking = {};
    }

    return data;
  } catch (error) {
    console.error("Failed to load app data:", error);
    return getDefaultData();
  }
}

function saveAppData(data) {
  try {
    localStorage.setItem(URU_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save app data:", error);
  }
}
