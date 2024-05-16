export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const extractNumbers = (text: string): string[] | null => {
  const numberRegex = /\d+\.\d{2}/g;
  return text.match(numberRegex);
};
