import { badWords } from "@/constant/badWords";

const checkContainsBadwords = (text: string) => {
  const lowerCaseText = text.toLowerCase();
  for (const word of badWords) {
    if (lowerCaseText.includes(word)) {
      return true;
    }
  }
  return false;
};

export { checkContainsBadwords };