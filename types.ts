
export enum CampaignType {
  AWARENESS = 'Awareness',
  LEAD_GEN = 'Lead Generation',
  PROMOTIONAL = 'Promotional/Sales',
  STORYTELLING = 'Brand Storytelling'
}

export enum Platform {
  LINKEDIN = 'LinkedIn',
  TIKTOK = 'TikTok',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  YOUTUBE = 'YouTube'
}

export interface ToneSettings {
  formality: number; // 0 (Casual) to 100 (Formal)
  enthusiasm: number; // 0 (Professional) to 100 (Bold/Excited)
  humour: number; // 0 (Serious) to 100 (Witty)
}

export interface BrandDNA {
  identity: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: string;
    tone: string;
    toneSettings: ToneSettings;
  };
  visualStyle: {
    imageStyle: string;
    consistencyRules: string;
  };
  messaging: {
    valueProp: string;
    ctas: string[];
    contact: {
      website: string;
      email: string;
      phone: string;
    };
  };
  keywords: string[];
}

export interface MarketingAsset {
  id: string;
  platform: Platform;
  headline: string;
  body: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  ratio: '1:1' | '16:9' | '9:16' | '4:5';
  scheduledAt?: string;
}

export interface Campaign {
  id: string;
  theme: string;
  type: CampaignType;
  assets: MarketingAsset[];
}
