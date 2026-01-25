// src/utils/severity.util.js

const detectSeverity = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("down") ||
    text.includes("outage") ||
    text.includes("crash")
  ) {
    return "high";
  }

  if (
    text.includes("slow") ||
    text.includes("delay") ||
    text.includes("performance")
  ) {
    return "medium";
  }

  return "low";
};

export { detectSeverity };
