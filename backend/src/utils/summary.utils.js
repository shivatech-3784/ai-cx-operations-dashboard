const generateAiSummary = (title, description, severity) => {
  return `Severity: ${severity.toUpperCase()} | Issue: ${title}. ${description}`;
};

export { generateAiSummary };
