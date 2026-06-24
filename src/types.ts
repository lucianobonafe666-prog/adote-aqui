export type PetSpecies = 'Cachorro' | 'Gato';
export type PetGender = 'Macho' | 'Fêmea';
export type PetSize = 'Pequeno' | 'Médio' | 'Grande';

export type PetStatus = 
  | 'Disponível' 
  | 'Em análise' 
  | 'Reservado' 
  | 'Aguardando entrega' 
  | 'Adotado' 
  | 'Não disponível'
  | 'Aguardando aprovação';

export interface HistoryEvent {
  id: string;
  date: string;
  event: string;
  notes: string;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  gender: PetGender;
  ageApprox: string; // e.g., "Filhote (3 meses)", "Adulto (2 anos)"
  size: PetSize;
  color: string;
  story: string;
  temperament: string;
  castrated: boolean;
  castrationDate?: string;
  vaccinated: boolean;
  vaccineDates?: { [vaccineName: string]: string };
  dewormed: boolean;
  needsTreatment: boolean;
  treatmentNotes?: string;
  compatOtherAnimals: 'Sim' | 'Não' | 'Depende';
  compatChildren: 'Sim' | 'Não' | 'Depende';
  specialNeeds: string; // Empty string if none
  city: string;
  temporaryHomeId: string; // Foreign key to TemporaryHome, or "none"
  photos: string[]; // Base64 data URLs or standard illustration placeholds
  primaryPhotoIndex: number;
  status: PetStatus;
  tags: string[];
  historyEvents: HistoryEvent[];
  donorId?: string;
  donorInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface DonorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Storing password for simulated login
  createdAt: string;
  role?: 'Doador' | 'Pretendente' | 'Ambos';
  profilePhotoUrl?: string;
  customTags?: string[];
  // Pretendente profile details
  city?: string;
  neighborhood?: string;
  housingType?: HousingType;
  backyard?: 'Sim' | 'Não';
  tenure?: 'Própria' | 'Alugada';
  hadPets?: 'Sim' | 'Não';
  otherAnimalsCount?: number;
  otherAnimalsDetails?: string;
  motivation?: string;
  // House structural details
  housePhotos?: string[];
  isWalledOrFenced?: string; // "Sim, murada" | "Sim, cercada" | "Ambos" | "Não"
  hasKennel?: boolean;
  hasCatShelter?: boolean;
  otherInfrastructure?: string;
}

export type HousingType = 'Casa' | 'Apartamento';

export type CandidateStatus = 
  | 'Interesse recebido' 
  | 'Em análise' 
  | 'Contato realizado' 
  | 'Entrevista' 
  | 'Visita' 
  | 'Aprovado' 
  | 'Entrega agendada' 
  | 'Adotado' 
  | 'Acompanhamento';

export interface InternalNote {
  id: string;
  date: string;
  text: string;
  author: string;
}

export interface HistoryLog {
  id: string;
  date: string;
  action: string;
}

export interface Candidate {
  id: string;
  petId: string; // ID of the pet they want to adopt
  name: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  housingType: HousingType;
  backyard: 'Sim' | 'Não';
  tenure: 'Própria' | 'Alugada';
  experience: {
    hadPets: 'Sim' | 'Não';
    otherAnimalsCount: number;
    otherAnimalsDetails: string;
  };
  motivation: string;
  notes: string; // User notes in form
  status: CandidateStatus;
  tags: string[];
  createdAt: string;
  internalNotes: InternalNote[];
  historyLogs: HistoryLog[];
  hasChildren?: 'Sim' | 'Não';
  childrenAges?: string;
  childrenPetRelation?: string;
  agreedToVisits?: boolean;
  // House photos & verification info
  profilePhotoUrl?: string;
  housePhotos?: string[];
  isWalledOrFenced?: string;
  hasKennel?: boolean;
  hasCatShelter?: boolean;
  otherInfrastructure?: string;
}

export interface TemporaryHome {
  id: string;
  name: string;
  contact: string;
  vacancies: number;
  notes?: string;
  donorId?: string; // Linked to a DonorUser
}

export type FollowUpType = '7 dias' | '30 dias' | '90 dias' | '180 dias';

export interface FollowUp {
  id: string;
  petId: string;
  candidateId: string;
  type: FollowUpType;
  scheduledDate: string;
  status: 'Pendente' | 'Concluído';
  photosReceived: string[]; // Base64 or URLs
  tutorNotes: string;
  adminNotes: string;
  updatedAt: string;
}

export interface SystemState {
  pets: Pet[];
  candidates: Candidate[];
  temporaryHomes: TemporaryHome[];
  followUps: FollowUp[];
}
