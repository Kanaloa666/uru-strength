(() => {
  const STORAGE_KEY = "uru_strength_forge_v3";

  const defaultData = {
    profile: {
      name: "",
      cycleName: "Cycle 01 // Base Build",
      benchMax: 225,
      squatMax: 315,
      deadliftMax: 285,
      profileNotes: ""
    },
    dailyNotes: "",
    logs: [],
    archiveOpen: false
  };

  function getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultData);

      const parsed = JSON.parse(raw);

      return {
        ...structuredClone(defaultData),
        ...parsed,
        profile: {
          ...structuredClone(defaultData).profile,
          ...(parsed.profile || {})
        },
        logs: Array.isArray(parsed.logs) ? parsed.logs : []
      };
    } catch (error) {
      console.error("Failed to load URU storage:", error);
      return structuredClone(defaultData);
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save URU storage:", error);
    }
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return structuredClone(defaultData);
  }

  window.UruStorage = {
    getData,
    saveData,
    resetData,
    defaultData: structuredClone(defaultData)
  };
})();
