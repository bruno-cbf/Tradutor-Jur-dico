export interface SimplifiedResult {
  summary: string;
  meaning: string;
  outcome?: string;
  nextSteps: string[];
  hasActionRequired: boolean;
  deadlineInfo: string;
  needsLawyer?: string;
  glossary?: Array<{
    term: string;
    definition: string;
  }>;
  formattedText: string;
}

export interface SimplificationHistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  docType: string;
  result: SimplifiedResult;
  userRating?: 'up' | 'down' | null;
  ratingFeedback?: string;
}

export type AccessibilityTextSize = 'sm' | 'md' | 'lg' | 'xl';
