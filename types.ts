export interface ListingInputData {
  title: string;
  description: string;
  address: string;
  price: number;
  sqft: number;
  medianPrice?: number;
  photoBase64?: string;
  photoMimeType?: string;
  ownerName?: string;
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
}

export interface RiskAnalysisResult {
  riskScore: number;
  verdict: string;
  verdictColor: 'RED' | 'YELLOW' | 'GREEN';
  summary: string;
  geoLog: {
    status: 'PASS' | 'FAIL' | 'UNKNOWN';
    details: string;
  };
  priceLog: {
    status: 'HIGH_RISK' | 'MODERATE_RISK' | 'LOW_RISK';
    details: string;
  };
  textLog: {
    status: 'DETECTED' | 'CLEAR';
    details: string;
    keywordsFound: string[];
  };
  photoLog: {
    integrityScore: number; // 1-10
    details: string;
  };
  ownershipLog: {
    status: 'PLAUSIBLE' | 'SUSPICIOUS' | 'UNKNOWN';
    details: string;
  };
  actionableSteps: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}