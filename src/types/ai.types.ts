export type AiSuggestion = {
  title: string;
};

export type AiSuggestResult = {
  success: boolean;
  message?: string;
  data?: AiSuggestion[];
};
