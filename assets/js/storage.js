const URU_STORAGE_KEY = "uru_strength_v2";

function getDefaultData() {
  return {
    profile: null,
    program: null,
    logs: [],
    scorecards: [],
    currentWorkout: {
      weekIndex: 0,
      dayIndex: 0
    }
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(URU_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

function saveAppData(data) {
  localStorage.setItem(URU_STORAGE_KEY, JSON.stringify(data));
}
