export enum ToolType {
  MENU_CREATOR = 'MENU_CREATOR',
  APPOINTMENT_ASSISTANT = 'APPOINTMENT_ASSISTANT',
  EVENT_PROMOTER = 'EVENT_PROMOTER',
}

export interface MenuRequest {
  ingredients: string;
  dishType: string;
  cuisine?: string;
  notes?: string;
  language?: string;
}

export interface MenuResponse {
  menuDescription: string;
  socialMediaCaption: string;
  imageSuggestion: string;
  nutritionalInfo: string;
  promotionalOffer: string;
}

export interface SeasonalDishSuggestion {
  dishName: string;
  ingredients: string;
  description: string;
}

export interface AppointmentRequest {
  businessType: string;
  service: string;
  time: string;
  language: string;
  customerMessage?: string;
}

export interface AppointmentResponse {
  bookingResponse: string;
  reminderMessage: string;
  reschedulingOption: string;
  upsellSuggestion: string;
  sentimentAnalysis: string;
}

export interface EventRequest {
  eventName: string;
  eventType: string;
  dateTime: string;
  location: string;
  highlights?: string;
  targetAudience?: string;
}

export interface EventResponse {
  socialMediaCaption: string;
  bannerText: string;
  imageSuggestion: string;
  hashtags: string[];
  engagementQuestions: string[];
  videoScriptConcept: string;
}