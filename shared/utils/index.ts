export const genId = (): string => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const now = (): string => {
  return new Date().toISOString();
};

export const formatJoinedDate = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
};
