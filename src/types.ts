export interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientLocation: string;
  propertyType: string;
  rooms: number;
  floors: number;
  needsCameras: boolean;
  cameraCount: number;
  cameraLocation: string[];
  needsAlarms: boolean;
  alarmSpecs: string[];
  needsElectricity: boolean;
  electricitySpecs: string[];
  priority: 'quality' | 'budget' | 'balanced';
  status: 'pending' | 'contacted' | 'scheduled' | 'completed';
  estimatedPrice: number;
  notes: string;
  createdAt: string;
  aiRecommendation?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface CameraProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  type: 'analog' | 'ip' | 'ptz' | 'dome' | 'bullet';
  resolution: string;
}

export interface AlarmProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  type: 'motion' | 'door_window' | 'smoke_fire' | 'siren' | 'keypad';
}

export interface ElectricalTask {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  unit: string;
}
