import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Dog, 
  Users, 
  Home, 
  Calendar, 
  BarChart3, 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle, 
  Share2, 
  Check, 
  Paperclip, 
  Activity, 
  Heart, 
  ArrowRight,
  AlertCircle,
  TrendingUp,
  FileText,
  Upload,
  Download,
  User,
  Shield
} from 'lucide-react';
import { 
  Pet, 
  Candidate, 
  TemporaryHome, 
  FollowUp, 
  PetStatus, 
  CandidateStatus, 
  PetSpecies, 
  PetSize, 
  PetGender,
  DonorUser
} from '../types';

interface AdminAreaProps {
  pets: Pet[];
  candidates: Candidate[];
  temporaryHomes: TemporaryHome[];
  followUps: FollowUp[];
  users?: DonorUser[];
  onUpdatePets: (pets: Pet[]) => void;
  onUpdateCandidates: (candidates: Candidate[]) => void;
  onUpdateTemporaryHomes: (homes: TemporaryHome[]) => void;
  onUpdateFollowUps: (fups: FollowUp[]) => void;
  onUpdateUsers?: (users: DonorUser[]) => void;
  onZoomImage?: (imgUrl: string) => void;
}

export default function AdminArea({
  pets,
  candidates,
  temporaryHomes,
  followUps,
  users = [],
  onUpdatePets,
  onUpdateCandidates,
  onUpdateTemporaryHomes,
  onUpdateFollowUps,
  onUpdateUsers,
  onZoomImage
}: AdminAreaProps) {
  // Treat all users who make a pet available for adoption (p.donorId matches user.id) as temporary homes too!
  const usersWithPets = (users || []).filter(u => pets.some(p => p.donorId === u.id));
  const userTemporaryHomes: TemporaryHome[] = usersWithPets.map(u => {
    const userPets = pets.filter(p => p.donorId === u.id);
    return {
      id: u.id,
      name: `Lar de ${u.name}`,
      contact: u.phone || u.email,
      vacancies: Math.max(2, userPets.length),
      notes: `Lar temporário do doador ${u.name}, gerado automaticamente devido aos pets cadastrados (${userPets.map(p => p.name).join(', ')}).`,
      donorId: u.id
    };
  });
  const allTemporaryHomes = [...temporaryHomes, ...userTemporaryHomes];
  const allUserTags = Array.from(
    new Set((users || []).flatMap(u => u.customTags || []))
  );

  // Tabs: 'dashboard' | 'pets' | 'candidates' | 'lts' | 'followups' | 'reports' | 'backup'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Search/Filters within Admin
  const [petSearch, setPetSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [followUpFilter, setFollowUpFilter] = useState<'all' | 'Pendente' | 'Concluído'>('Pendente');
  const [userSearch, setUserSearch] = useState('');
  const [userTagInput, setUserTagInput] = useState<{[userId: string]: string}>({});
  const [selectedUserTagFilter, setSelectedUserTagFilter] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userAdminDescInput, setUserAdminDescInput] = useState('');
  const [userAttentionInput, setUserAttentionInput] = useState(false);

  // Selection / Detail States
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingLT, setEditingLT] = useState<TemporaryHome | null>(null);
  const [isAddingLT, setIsAddingLT] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeFollowUpEdit, setActiveFollowUpEdit] = useState<FollowUp | null>(null);
  const [selectedPetDetail, setSelectedPetDetail] = useState<Pet | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<DonorUser | null>(null);

  // Private Note Text Input State
  const [newPrivateNote, setNewPrivateNote] = useState('');

  /* --- PETS MANAGEMENT FORM STATES --- */
  const [petFormName, setPetFormName] = useState('');
  const [petFormSpecies, setPetFormSpecies] = useState<PetSpecies>('Cachorro');
  const [petFormGender, setPetFormGender] = useState<PetGender>('Macho');
  const [petFormAge, setPetFormAge] = useState('');
  const [petFormSize, setPetFormSize] = useState<PetSize>('Médio');
  const [petFormColor, setPetFormColor] = useState('');
  const [petFormStory, setPetFormStory] = useState('');
  const [petFormTemperament, setPetFormTemperament] = useState('');
  const [petFormCastrated, setPetFormCastrated] = useState(false);
  const [petFormCastrationDate, setPetFormCastrationDate] = useState('');
  const [petFormVaccinated, setPetFormVaccinated] = useState(false);
  const [petFormVaccinesText, setPetFormVaccinesText] = useState(''); // comma separated key:value dates
  const [petFormDewormed, setPetFormDewormed] = useState(false);
  const [petFormNeedsTreatment, setPetFormNeedsTreatment] = useState(false);
  const [petFormTreatmentNotes, setPetFormTreatmentNotes] = useState('');
  const [petFormCompatAnimals, setPetFormCompatAnimals] = useState<'Sim' | 'Não' | 'Depende'>('Sim');
  const [petFormCompatChildren, setPetFormCompatChildren] = useState<'Sim' | 'Não' | 'Depende'>('Sim');
  const [petFormSpecialNeeds, setPetFormSpecialNeeds] = useState('');
  const [petFormCity, setPetFormCity] = useState('');
  const [petFormLT, setPetFormLT] = useState('none');
  const [petFormPhotosText, setPetFormPhotosText] = useState(''); // Comma separated URLs
  const [petFormStatus, setPetFormStatus] = useState<PetStatus>('Disponível');
  const [petFormTagsText, setPetFormTagsText] = useState('');

  /* --- LT FORM STATES --- */
  const [ltName, setLtName] = useState('');
  const [ltContact, setLtContact] = useState('');
  const [ltVacancies, setLtVacancies] = useState<number>(3);
  const [ltNotes, setLtNotes] = useState('');

  /* --- FOLLOWUP FORM STATES --- */
  const [fupTutorNotes, setFupTutorNotes] = useState('');
  const [fupAdminNotes, setFupAdminNotes] = useState('');
  const [fupPhotosText, setFupPhotosText] = useState('');

  // Direct Upload Dragging States & Helper
  const [isDraggingAdminPetPhoto, setIsDraggingAdminPetPhoto] = useState(false);
  const [isDraggingFupPhoto, setIsDraggingFupPhoto] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_width = 400;
          const max_height = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_width) {
              height = Math.round(height * (max_width / width));
              width = max_width;
            }
          } else {
            if (height > max_height) {
              width = Math.round(width * (max_height / height));
              height = max_height;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            resolve(dataUrl);
          } else {
            resolve(reader.result as string);
          }
        };
        img.onerror = () => {
          resolve(reader.result as string);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Open Pet Form Helpers
  const openAddPet = () => {
    setEditingPet(null);
    setPetFormName('');
    setPetFormSpecies('Cachorro');
    setPetFormGender('Macho');
    setPetFormAge('');
    setPetFormSize('Médio');
    setPetFormColor('');
    setPetFormStory('');
    setPetFormTemperament('');
    setPetFormCastrated(false);
    setPetFormCastrationDate('');
    setPetFormVaccinated(false);
    setPetFormVaccinesText('');
    setPetFormDewormed(false);
    setPetFormNeedsTreatment(false);
    setPetFormTreatmentNotes('');
    setPetFormCompatAnimals('Sim');
    setPetFormCompatChildren('Sim');
    setPetFormSpecialNeeds('');
    setPetFormCity('Campinas');
    setPetFormLT('none');
    setPetFormPhotosText('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600');
    setPetFormStatus('Disponível');
    setPetFormTagsText('Brincalhão, Resgatado');
    setIsAddingPet(true);
  };

  const openEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetFormName(pet.name);
    setPetFormSpecies(pet.species);
    setPetFormGender(pet.gender);
    setPetFormAge(pet.ageApprox);
    setPetFormSize(pet.size);
    setPetFormColor(pet.color);
    setPetFormStory(pet.story);
    setPetFormTemperament(pet.temperament);
    setPetFormCastrated(pet.castrated);
    setPetFormCastrationDate(pet.castrationDate || '');
    setPetFormVaccinated(pet.vaccinated);
    
    // Format vaccine list to simple text: "vac1:2026-04-15, vac2:2026-05-15"
    const vacText = pet.vaccineDates 
      ? Object.entries(pet.vaccineDates).map(([name, date]) => `${name}:${date}`).join(', ')
      : '';
    setPetFormVaccinesText(vacText);
    
    setPetFormDewormed(pet.dewormed);
    setPetFormNeedsTreatment(pet.needsTreatment);
    setPetFormTreatmentNotes(pet.treatmentNotes || '');
    setPetFormCompatAnimals(pet.compatOtherAnimals);
    setPetFormCompatChildren(pet.compatChildren);
    setPetFormSpecialNeeds(pet.specialNeeds);
    setPetFormCity(pet.city);
    setPetFormLT(pet.temporaryHomeId);
    setPetFormPhotosText(pet.photos.join(', '));
    setPetFormStatus(pet.status);
    setPetFormTagsText(pet.tags.join(', '));
    setIsAddingPet(true);
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse Vaccines
    const vaccineDates: { [name: string]: string } = {};
    if (petFormVaccinesText) {
      petFormVaccinesText.split(',').forEach(v => {
        const parts = v.split(':');
        if (parts.length >= 2) {
          vaccineDates[parts[0].trim()] = parts[1].trim();
        }
      });
    }

    // Parse photos list
    const photos = petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean);
    if (photos.length === 0) {
      photos.push(petFormSpecies === 'Cachorro' 
        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'
      );
    }

    // Parse tags
    const tags = petFormTagsText.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPet) {
      // Update
      const updated = pets.map(p => {
        if (p.id === editingPet.id) {
          // Detect changes for status
          const statusChanged = p.status !== petFormStatus;
          const updatedEvents = [...p.historyEvents];
          if (statusChanged) {
            updatedEvents.push({
              id: 'hevt-' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              event: 'Alteração de Status',
              notes: `Status atualizado de "${p.status}" para "${petFormStatus}" no painel administrativo.`
            });
          }

          return {
            ...p,
            name: petFormName,
            species: petFormSpecies,
            gender: petFormGender,
            ageApprox: petFormAge,
            size: petFormSize,
            color: petFormColor,
            story: petFormStory,
            temperament: petFormTemperament,
            castrated: petFormCastrated,
            castrationDate: petFormCastrationDate || undefined,
            vaccinated: petFormVaccinated,
            vaccineDates: Object.keys(vaccineDates).length > 0 ? vaccineDates : undefined,
            dewormed: petFormDewormed,
            needsTreatment: petFormNeedsTreatment,
            treatmentNotes: petFormTreatmentNotes || undefined,
            compatOtherAnimals: petFormCompatAnimals,
            compatChildren: petFormCompatChildren,
            specialNeeds: petFormSpecialNeeds,
            city: petFormCity,
            temporaryHomeId: petFormLT,
            photos,
            status: petFormStatus,
            tags,
            historyEvents: updatedEvents
          };
        }
        return p;
      });
      onUpdatePets(updated);
    } else {
      // Create
      const newPet: Pet = {
        id: 'pet-' + Date.now(),
        name: petFormName,
        species: petFormSpecies,
        gender: petFormGender,
        ageApprox: petFormAge,
        size: petFormSize,
        color: petFormColor,
        story: petFormStory,
        temperament: petFormTemperament,
        castrated: petFormCastrated,
        castrationDate: petFormCastrationDate || undefined,
        vaccinated: petFormVaccinated,
        vaccineDates: Object.keys(vaccineDates).length > 0 ? vaccineDates : undefined,
        dewormed: petFormDewormed,
        needsTreatment: petFormNeedsTreatment,
        treatmentNotes: petFormTreatmentNotes || undefined,
        compatOtherAnimals: petFormCompatAnimals,
        compatChildren: petFormCompatChildren,
        specialNeeds: petFormSpecialNeeds,
        city: petFormCity,
        temporaryHomeId: petFormLT,
        photos,
        primaryPhotoIndex: 0,
        status: petFormStatus,
        tags,
        historyEvents: [
          {
            id: 'hevt-init',
            date: new Date().toISOString().split('T')[0],
            event: 'Cadastro do Pet',
            notes: 'Animal registrado no sistema de gestão de adoções.'
          }
        ]
      };
      onUpdatePets([...pets, newPet]);
    }

    setIsAddingPet(false);
    setEditingPet(null);
  };

  const handleDeletePet = (id: string) => {
    if (confirm('Tem certeza de que deseja remover este pet definitivamente do sistema?')) {
      onUpdatePets(pets.filter(p => p.id !== id));
    }
  };

  const handleApprovePet = (petId: string) => {
    const updated = pets.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          status: 'Disponível' as const,
          historyEvents: [
            ...(p.historyEvents || []),
            {
              id: 'hevt-approve-' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              event: 'Aprovação Administrativa',
              notes: 'Cadastro aprovado e publicado na galeria pública pelo APP adote aqui.'
            }
          ]
        };
      }
      return p;
    });
    onUpdatePets(updated);
  };

  const handleRejectPet = (petId: string) => {
    if (confirm('Tem certeza de que deseja recusar e excluir permanentemente este pet do sistema?')) {
      const updated = pets.filter(p => p.id !== petId);
      onUpdatePets(updated);
    }
  };

  /* --- LT FORM HELPER --- */
  const openAddLT = () => {
    setEditingLT(null);
    setLtName('');
    setLtContact('');
    setLtVacancies(3);
    setLtNotes('');
    setIsAddingLT(true);
  };

  const openEditLT = (home: TemporaryHome) => {
    setEditingLT(home);
    setLtName(home.name);
    setLtContact(home.contact);
    setLtVacancies(home.vacancies);
    setLtNotes(home.notes || '');
    setIsAddingLT(true);
  };

  const handleSaveLT = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLT) {
      const updated = temporaryHomes.map(h => {
        if (h.id === editingLT.id) {
          return { ...h, name: ltName, contact: ltContact, vacancies: ltVacancies, notes: ltNotes };
        }
        return h;
      });
      onUpdateTemporaryHomes(updated);
    } else {
      const newHome: TemporaryHome = {
        id: 'lt-' + Date.now(),
        name: ltName,
        contact: ltContact,
        vacancies: ltVacancies,
        notes: ltNotes
      };
      onUpdateTemporaryHomes([...temporaryHomes, newHome]);
    }
    setIsAddingLT(false);
    setEditingLT(null);
  };

  const handleDeleteLT = (id: string) => {
    if (confirm('Deseja deletar este Lar Temporário? Os animais vinculados a ele continuarão no sistema.')) {
      onUpdateTemporaryHomes(temporaryHomes.filter(h => h.id !== id));
    }
  };

  const handleAddUserTag = (userId: string, tag: string) => {
    if (!tag.trim() || !onUpdateUsers) return;
    const cleanTag = tag.trim();
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const tags = u.customTags || [];
        if (!tags.includes(cleanTag)) {
          return { ...u, customTags: [...tags, cleanTag] };
        }
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    // Clear input
    setUserTagInput(prev => ({ ...prev, [userId]: '' }));
  };

  const handleRemoveUserTag = (userId: string, tagToRemove: string) => {
    if (!onUpdateUsers) return;
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const tags = u.customTags || [];
        return { ...u, customTags: tags.filter(t => t !== tagToRemove) };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
  };

  const toggleExpandUser = (user: DonorUser) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(user.id);
      setUserAdminDescInput(user.adminDescription || '');
      setUserAttentionInput(!!user.flaggedAttention);
    }
  };

  const handleSaveAdminUserFields = (userId: string) => {
    if (!onUpdateUsers) return;
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          adminDescription: userAdminDescInput.substring(0, 500),
          flaggedAttention: userAttentionInput
        };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
    setExpandedUserId(null);
  };

  /* --- CADIDATE STATUS ACTIONS & PRIVATE NOTES --- */
  const handleUpdateCandidateStatus = (candidateId: string, newStatus: CandidateStatus) => {
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        const oldStatus = c.status;
        const logDate = new Date().toISOString().split('T')[0];
        
        // Build updated logs
        const newLogs = [...c.historyLogs, {
          id: 'log-' + Date.now(),
          date: logDate,
          action: `Status do candidato alterado de "${oldStatus}" para "${newStatus}"`
        }];

        // If status changed to 'Adotado', update the Pet status to 'Adotado' and auto-generate follow-ups!
        if (newStatus === 'Adotado') {
          // Update pet state in App
          const updatedPets = pets.map(p => {
            if (p.id === c.petId) {
              return { ...p, status: 'Adotado' as PetStatus };
            }
            return p;
          });
          onUpdatePets(updatedPets);

          // Generate post-adoption reminders: 7, 30, 90, 180 days from now
          const baseDate = new Date();
          const intervals = [
            { label: '7 dias' as const, days: 7 },
            { label: '30 dias' as const, days: 30 },
            { label: '90 dias' as const, days: 90 },
            { label: '180 dias' as const, days: 180 }
          ];

          const generatedFups: FollowUp[] = intervals.map((interval, index) => {
            const schedDate = new Date(baseDate);
            schedDate.setDate(baseDate.getDate() + interval.days);
            
            return {
              id: `fup-auto-${Date.now()}-${index}`,
              petId: c.petId,
              candidateId: c.id,
              type: interval.label,
              scheduledDate: schedDate.toISOString().split('T')[0],
              status: 'Pendente' as const,
              photosReceived: [],
              tutorNotes: '',
              adminNotes: '',
              updatedAt: new Date().toISOString()
            };
          });

          onUpdateFollowUps([...followUps, ...generatedFups]);
        }

        const candidateUpdated = { ...c, status: newStatus, historyLogs: newLogs };
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(candidateUpdated);
        }
        return candidateUpdated;
      }
      return c;
    });

    onUpdateCandidates(updated);
  };

  const handleAddPrivateNote = (candidateId: string) => {
    if (!newPrivateNote.trim()) return;

    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        const noteDate = new Date().toISOString().split('T')[0];
        const newNotes = [...c.internalNotes, {
          id: 'note-' + Date.now(),
          date: noteDate,
          text: newPrivateNote,
          author: 'APP adote aqui'
        }];

        const candidateUpdated = { ...c, internalNotes: newNotes };
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(candidateUpdated);
        }
        return candidateUpdated;
      }
      return c;
    });

    onUpdateCandidates(updated);
    setNewPrivateNote('');
  };

  const handleAddCandidateTag = (candidateId: string, tag: string) => {
    if (!tag.trim()) return;
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        if (c.tags.includes(tag)) return c;
        const candidateUpdated = { ...c, tags: [...c.tags, tag] };
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(candidateUpdated);
        }
        return candidateUpdated;
      }
      return c;
    });
    onUpdateCandidates(updated);
  };

  const handleRemoveCandidateTag = (candidateId: string, tag: string) => {
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        const candidateUpdated = { ...c, tags: c.tags.filter(t => t !== tag) };
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(candidateUpdated);
        }
        return candidateUpdated;
      }
      return c;
    });
    onUpdateCandidates(updated);
  };

  /* --- FOLLOWUP RECORD ACTIONS --- */
  const openEditFollowUp = (fup: FollowUp) => {
    setActiveFollowUpEdit(fup);
    setFupTutorNotes(fup.tutorNotes);
    setFupAdminNotes(fup.adminNotes);
    setFupPhotosText(fup.photosReceived.join(', '));
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFollowUpEdit) return;

    const photos = fupPhotosText.split(',').map(u => u.trim()).filter(Boolean);

    const updated = followUps.map(f => {
      if (f.id === activeFollowUpEdit.id) {
        return {
          ...f,
          tutorNotes: fupTutorNotes,
          adminNotes: fupAdminNotes,
          photosReceived: photos,
          status: 'Concluído' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return f;
    });

    onUpdateFollowUps(updated);
    setActiveFollowUpEdit(null);
  };

  /* --- BACKUP EXPORT/IMPORT --- */
  const handleExportData = () => {
    const state = {
      pets,
      candidates,
      temporaryHomes,
      followUps
    };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestao_adocao_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.pets && data.candidates && data.temporaryHomes && data.followUps) {
          onUpdatePets(data.pets);
          onUpdateCandidates(data.candidates);
          onUpdateTemporaryHomes(data.temporaryHomes);
          onUpdateFollowUps(data.followUps);
          alert('Banco de dados restaurado com sucesso!');
        } else {
          alert('Formato de arquivo inválido. Verifique se o JSON é um backup compatível.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo. Certifique-se de que é um JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  // Pre-calculated stats for layout
  const availablePetsCount = pets.filter(p => p.status === 'Disponível').length;
  const reservedPetsCount = pets.filter(p => p.status === 'Reservado').length;
  const adoptedPetsCount = pets.filter(p => p.status === 'Adotado').length;
  const pendingApprovalPetsCount = pets.filter(p => p.status === 'Aguardando aprovação').length;
  
  const pendingCandidatesCount = candidates.filter(c => c.status === 'Interesse recebido' || c.status === 'Em análise').length;
  const activeProcessesCount = candidates.filter(c => c.status !== 'Adotado' && c.status !== 'Interesse recebido' && c.status !== 'Em análise').length;
  const pendingFollowupsCount = followUps.filter(f => f.status === 'Pendente').length;

  // Render WhatsApp customized templates
  const getWhatsAppLink = (cand: Candidate, pet: Pet, template: 'intro' | 'interview' | 'approved') => {
    let msg = '';
    if (template === 'intro') {
      msg = `Olá ${cand.name}! Aqui é do APP adote aqui, responsável pelos resgates e adoções de animais. Recebi seu cadastro de interesse no(a) ${pet.name}. Você teria um tempinho para conversarmos sobre a adoção?`;
    } else if (template === 'interview') {
      msg = `Oi ${cand.name}! Gostaria de agendar nossa entrevista sobre a adoção do(a) ${pet.name}. Qual dia e horário ficam melhores para você realizarmos uma chamada de vídeo de uns 15 minutinhos?`;
    } else if (template === 'approved') {
      msg = `Notícia maravilhosa, ${cand.name}! Sua adoção do(a) ${pet.name} foi APROVADA! 😍 Vamos agendar a entrega do seu novo melhor amigo e assinar o termo de adoção?`;
    }
    return `https://wa.me/55${cand.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div id="admin-area-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#F5F2E1] text-[#7C6E5D] flex flex-col border-r border-[#E0DBC1]">
        <div className="p-6 border-b border-[#E0DBC1] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5A6340] text-white flex items-center justify-center font-bold">A</div>
          <div>
            <h1 className="text-sm font-bold text-[#5A6340] tracking-wide leading-none">Painel Administrativo</h1>
            <span className="text-[10px] text-[#7C6E5D] font-medium">Logado como APP adote aqui</span>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Painel Geral (Dashboard)
          </button>

          <button
            onClick={() => setActiveTab('pets')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'pets' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <Dog className="w-4 h-4" /> Gestão de Pets ({pets.length})
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'approvals' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <span className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" /> Aprovações Pendentes
            </span>
            {pendingApprovalPetsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D48166] text-white">
                {pendingApprovalPetsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'candidates' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <Users className="w-4 h-4" /> Funil de Candidatos ({candidates.length})
          </button>

          <button
            onClick={() => setActiveTab('lts')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'lts' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <Home className="w-4 h-4" /> Lares Temporários ({temporaryHomes.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'users' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <User className="w-4 h-4" /> Gestão de Usuários ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('followups')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'followups' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <Calendar className="w-4 h-4" /> Pós-Adoção ({pendingFollowupsCount})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'reports' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Relatórios e Métricas
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'backup' ? 'bg-[#5A6340] text-white font-bold shadow-sm' : 'hover:bg-[#EAE5CD] hover:text-[#5A6340]'
            }`}
          >
            <Database className="w-4 h-4" /> Backup de Segurança
          </button>
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <main id="admin-workspace" className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* --- 1. DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Painel Executivo</h2>
                <p className="text-xs text-slate-500">Métricas consolidadas e próximos passos para suas adoções.</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-200/60 font-mono text-slate-600 rounded-lg">
                Atualizado agora
              </span>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pets Disponíveis</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{availablePetsCount}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ Divulgando</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pets Reservados</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{reservedPetsCount}</p>
                <span className="text-[10px] text-indigo-600 font-semibold block mt-1">● Aguardando lar</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pets Adotados</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{adoptedPetsCount}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">❤ Finais Felizes</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Novos Candidatos</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{pendingCandidatesCount}</p>
                <span className="text-[10px] text-amber-600 font-semibold block mt-1">⚡ Avaliar interesse</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Em Processo</span>
                <p className="text-2xl font-black text-slate-800 mt-1">{activeProcessesCount}</p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">Interações ativas</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pós-Adoção Ativos</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{pendingFollowupsCount}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">🛎 Lembretes</span>
              </div>
            </div>

            {/* Quick Actions & Reminders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1 & 2: Recent Pending Interests & Followups */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Pending candidate applications */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" /> Candidatos Recentes Aguardando Análise
                  </h3>

                  <div className="space-y-3">
                    {candidates.filter(c => c.status === 'Interesse recebido' || c.status === 'Em análise').slice(0, 4).map(c => {
                      const pet = pets.find(p => p.id === c.petId);
                      return (
                        <div key={c.id} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                              <span>Interesse em <strong>{pet?.name || 'Animal Removido'}</strong></span>
                              <span>•</span>
                              <span>{c.city} ({c.housingType})</span>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCandidate(c);
                              setActiveTab('candidates');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            Analisar <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}

                    {candidates.filter(c => c.status === 'Interesse recebido' || c.status === 'Em análise').length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Tudo limpo! Não há novos candidatos para analisar.
                      </div>
                    )}
                  </div>
                </div>

                {/* Post-Adoption Follow-ups list */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" /> Lembretes de Acompanhamento Próximos
                  </h3>

                  <div className="space-y-3">
                    {followUps.filter(f => f.status === 'Pendente').slice(0, 4).map(f => {
                      const pet = pets.find(p => p.id === f.petId);
                      const adopter = candidates.find(c => c.id === f.candidateId);
                      return (
                        <div key={f.id} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">{f.type}</span>
                              <h4 className="text-xs font-bold text-slate-800">Acompanhar {pet?.name || 'Pet'}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Tutor: <strong>{adopter?.name || 'Tutor desconhecido'}</strong> • Agendado para: <strong className="text-slate-700">{f.scheduledDate}</strong>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('followups');
                              openEditFollowUp(f);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg transition-colors"
                          >
                            Registrar
                          </button>
                        </div>
                      );
                    })}

                    {followUps.filter(f => f.status === 'Pendente').length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Não há acompanhamentos pendentes.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Column 3: Stats of Temporary Homes & Help Box */}
              <div className="space-y-6">
                
                {/* Temporary Homes mini-status */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-teal-600" /> Ocupação de Lares Temporários
                  </h3>

                  <div className="space-y-3">
                    {allTemporaryHomes.map(lt => {
                      const occupiedCount = pets.filter(p => p.temporaryHomeId === lt.id && p.status !== 'Adotado').length;
                      const pct = Math.min(100, (occupiedCount / lt.vacancies) * 100);
                      return (
                        <div key={lt.id} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-slate-700 font-semibold">
                            <span>{lt.name}</span>
                            <span>{occupiedCount} / {lt.vacancies} vagas</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                pct >= 100 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Quick-Tip Area */}
                <div className="p-5 bg-[#EAE5CD] text-[#5A6340] rounded-2xl shadow-sm relative overflow-hidden border border-[#E0DBC1]">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <Dog className="w-32 h-32 transform translate-x-6 translate-y-6 text-[#5A6340]" />
                  </div>
                  <h4 className="font-bold mb-2 flex items-center gap-1.5 text-sm text-[#5A6340]">
                    <Activity className="w-4 h-4 text-[#D48166]" /> Como usar o CRM?
                  </h4>
                  <p className="text-xs text-[#7C6E5D] leading-relaxed">
                    Mova seus candidatos pelas fases de análise até "Adotado" na aba <strong>Funil de Candidatos</strong>. 
                    Quando mover para "Adotado", o pet será automaticamente atualizado e o cronograma de lembretes (7, 30, 90, 180 dias) será gerado!
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* --- 2. PETS MANAGEMENT TAB --- */}
        {activeTab === 'pets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Animais</h2>
                <p className="text-xs text-slate-500">Cadastre, edite, controle histórico médico e mude os status dos pets resgatados.</p>
              </div>
              <button
                onClick={openAddPet}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors self-start shadow-sm"
              >
                <Plus className="w-4 h-4" /> Cadastrar Novo Pet
              </button>
            </div>

            {/* Pets inventory form toggle popup */}
            {isAddingPet && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-display">
                        {editingPet ? `Editar Pet: ${editingPet.name}` : 'Cadastrar Novo Animal'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Preencha os detalhes técnicos, fotos e status para publicação imediata.</p>
                    </div>
                    <button 
                      onClick={() => { setIsAddingPet(false); setEditingPet(null); }}
                      className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-6 flex-1">
                    <form onSubmit={handleSavePet} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Basic info section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dados Básicos</h4>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Animal *</label>
                        <input 
                          type="text" required value={petFormName} onChange={e => setPetFormName(e.target.value)}
                          placeholder="Ex: Caramelo"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Espécie *</label>
                          <select 
                            value={petFormSpecies} onChange={e => setPetFormSpecies(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          >
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Sexo *</label>
                          <select 
                            value={petFormGender} onChange={e => setPetFormGender(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          >
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Idade Aproximada *</label>
                          <input 
                            type="text" required value={petFormAge} onChange={e => setPetFormAge(e.target.value)}
                            placeholder="Ex: Filhote (3 meses)"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Porte *</label>
                          <select 
                            value={petFormSize} onChange={e => setPetFormSize(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          >
                            <option value="Pequeno">Pequeno</option>
                            <option value="Médio">Médio</option>
                            <option value="Grande">Grande</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cor da Pelagem *</label>
                          <input 
                            type="text" required value={petFormColor} onChange={e => setPetFormColor(e.target.value)}
                            placeholder="Ex: Preto e Branco"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status de Adoção *</label>
                          <select 
                            value={petFormStatus} onChange={e => setPetFormStatus(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          >
                            <option value="Disponível">Disponível</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Aguardando entrega">Aguardando entrega</option>
                            <option value="Adotado">Adotado</option>
                            <option value="Não disponível">Não disponível</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Health & Location section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saúde e Detalhes</h4>

                      <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-150">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={petFormCastrated} onChange={e => setPetFormCastrated(e.target.checked)} />
                          Castrado
                        </label>
                        {petFormCastrated && (
                          <input 
                            type="date" value={petFormCastrationDate} onChange={e => setPetFormCastrationDate(e.target.value)}
                            className="mt-1 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                          />
                        )}

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer mt-2">
                          <input type="checkbox" checked={petFormVaccinated} onChange={e => setPetFormVaccinated(e.target.checked)} />
                          Vacinado
                        </label>
                        {petFormVaccinated && (
                          <input 
                            type="text" value={petFormVaccinesText} onChange={e => setPetFormVaccinesText(e.target.value)}
                            placeholder="Ex: V10-1a dose:2026-04-10, Anti-rábica:2026-05-15"
                            className="mt-1 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                          />
                        )}

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer mt-2">
                          <input type="checkbox" checked={petFormDewormed} onChange={e => setPetFormDewormed(e.target.checked)} />
                          Vermifugado
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer mt-2">
                          <input type="checkbox" checked={petFormNeedsTreatment} onChange={e => setPetFormNeedsTreatment(e.target.checked)} />
                          Necessita Tratamento Médico
                        </label>
                        {petFormNeedsTreatment && (
                          <textarea 
                            value={petFormTreatmentNotes} onChange={e => setPetFormTreatmentNotes(e.target.value)}
                            placeholder="Anote detalhes dos remédios e tratamentos necessários..."
                            rows={2}
                            className="mt-1 p-2 border border-slate-200 rounded-lg text-xs w-full"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Compatível com Cães/Gatos</label>
                          <select value={petFormCompatAnimals} onChange={e => setPetFormCompatAnimals(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs">
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                            <option value="Depende">Depende</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Compatível com Crianças</label>
                          <select value={petFormCompatChildren} onChange={e => setPetFormCompatChildren(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs">
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                            <option value="Depende">Depende</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Necessidades Especiais (Se houver)</label>
                        <input type="text" value={petFormSpecialNeeds} onChange={e => setPetFormSpecialNeeds(e.target.value)} placeholder="Ex: Leve claudicação pata traseira" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                      </div>
                    </div>

                    {/* Location, Story and Photos section */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logística e Mídia</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cidade do Pet *</label>
                          <input type="text" required value={petFormCity} onChange={e => setPetFormCity(e.target.value)} placeholder="Ex: Campinas" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Lar Temporário *</label>
                          <select value={petFormLT} onChange={e => setPetFormLT(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs">
                            <option value="none">Sem Lar Temporário (Nenhum)</option>
                            {allTemporaryHomes.map(h => (
                              <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Fotos do Pet (Fazer Upload ou URL)</label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingAdminPetPhoto(true);
                          }}
                          onDragLeave={() => setIsDraggingAdminPetPhoto(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDraggingAdminPetPhoto(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const files = Array.from(e.dataTransfer.files) as File[];
                              const newBase64s: string[] = [];
                              for (const file of files) {
                                if (file.type.startsWith('image/')) {
                                  try {
                                    const base64 = await fileToBase64(file);
                                    newBase64s.push(base64);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }
                              if (newBase64s.length > 0) {
                                const currentPhotos = petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean);
                                setPetFormPhotosText([...currentPhotos, ...newBase64s].join(', '));
                              }
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingAdminPetPhoto
                              ? 'border-[#5A6340] bg-[#5A6340]/5'
                              : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                          }`}
                          onClick={() => document.getElementById('admin-pet-photos-file-input')?.click()}
                        >
                          <input
                            id="admin-pet-photos-file-input"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const files = Array.from(e.target.files) as File[];
                                const newBase64s: string[] = [];
                                for (const file of files) {
                                  try {
                                    const base64 = await fileToBase64(file);
                                    newBase64s.push(base64);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                                if (newBase64s.length > 0) {
                                  const currentPhotos = petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean);
                                  setPetFormPhotosText([...currentPhotos, ...newBase64s].join(', '));
                                }
                              }
                            }}
                          />
                          <Upload className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Arraste fotos do pet aqui ou clique para fazer upload</p>
                            <p className="text-[10px] text-slate-400">Você pode fazer upload de várias fotos juntas</p>
                          </div>
                        </div>

                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={petFormPhotosText}
                            onChange={(e) => setPetFormPhotosText(e.target.value)}
                            placeholder="Insira URLs de fotos separadas por vírgula se preferir"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                          />
                        </div>

                        {petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean).length > 0 && (
                          <div className="mt-3">
                            <p className="text-[11px] font-bold text-slate-500 mb-1">Fotos do Pet ({petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean).length}):</p>
                            <div className="flex gap-2 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-100">
                              {petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean).map((photo, i) => (
                                <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                                  <img src={photo} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = petFormPhotosText.split(',').map(u => u.trim()).filter(Boolean).filter((_, idx) => idx !== i);
                                      setPetFormPhotosText(filtered.join(', '));
                                    }}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Separadas por vírgula)</label>
                        <input type="text" value={petFormTagsText} onChange={e => setPetFormTagsText(e.target.value)} placeholder="Especial, Brincalhão, LT" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">História / Temperamento / Resgate *</label>
                        <textarea required value={petFormStory} onChange={e => setPetFormStory(e.target.value)} placeholder="Descreva brevemente a história de resgate e temperamento do animal..." rows={3} className="w-full p-3 border border-slate-200 rounded-xl text-xs" />
                      </div>
                    </div>

                  </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                        <button 
                          type="button" onClick={() => { setIsAddingPet(false); setEditingPet(null); }}
                          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                        >
                          Salvar Dados do Animal
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Filter and Search Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={petSearch}
                  onChange={e => setPetSearch(e.target.value)}
                  placeholder="Pesquisar por nome do pet, cidade, porte..."
                  className="bg-transparent text-xs w-full focus:outline-none"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-4">Pet</th>
                      <th className="p-4">Espécie / Sexo</th>
                      <th className="p-4">Saúde básica</th>
                      <th className="p-4">Local / LT</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pets.filter(p => {
                      return p.name.toLowerCase().includes(petSearch.toLowerCase()) ||
                             p.city.toLowerCase().includes(petSearch.toLowerCase()) ||
                             p.size.toLowerCase().includes(petSearch.toLowerCase());
                    }).map(pet => {
                      const lt = allTemporaryHomes.find(h => h.id === pet.temporaryHomeId);
                      return (
                        <tr key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={pet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100'} 
                                alt="" 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                onClick={() => setSelectedPetDetail(pet)}
                              />
                              <div>
                                <h4 
                                  className="font-bold text-slate-950 text-sm leading-none mb-1 cursor-pointer hover:text-[#5A6340] hover:underline"
                                  onClick={() => setSelectedPetDetail(pet)}
                                >
                                  {pet.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono">{pet.ageApprox} • Porte {pet.size}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-700 block">{pet.species}</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              pet.gender === 'Fêmea' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {pet.gender}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="flex flex-wrap gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${pet.castrated ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                                {pet.castrated ? 'Castrado' : 'Não castrado'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${pet.vaccinated ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                                {pet.vaccinated ? 'Vacinado' : 'Não vacinado'}
                              </span>
                              {pet.needsTreatment && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
                                  Tratamento ativo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">
                            <span className="block font-semibold text-slate-800">{pet.city}</span>
                            <span className="text-[10px] text-slate-500">{lt ? lt.name : 'Sem LT (Particular)'}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              pet.status === 'Disponível' ? 'bg-emerald-100 text-emerald-800' :
                              pet.status === 'Em análise' ? 'bg-amber-100 text-amber-800' :
                              pet.status === 'Reservado' ? 'bg-indigo-100 text-indigo-800' :
                              pet.status === 'Adotado' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {pet.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button 
                                onClick={() => openEditPet(pet)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors" 
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeletePet(pet.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors" 
                                title="Deletar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {/* --- APPROVALS TAB (DONOR SUBMISSIONS REVIEW) --- */}
        {activeTab === 'approvals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#5A6340]" /> Animais Aguardando Aprovação
              </h2>
              <p className="text-xs text-slate-500">Revise os cadastros enviados por doadores e protetores independentes e publique-os na galeria.</p>
            </div>

            {pets.filter(p => p.status === 'Aguardando aprovação').length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-[#5A6340] mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900">Tudo em ordem!</h3>
                <p className="text-xs text-slate-500 mt-1">Nenhum pet está pendente de aprovação no momento. Os pets cadastrados por usuários aparecerão aqui para sua triagem.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pets.filter(p => p.status === 'Aguardando aprovação').map(pet => (
                  <div key={pet.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6">
                    {/* Pet Image Thumbnail */}
                    <div className="w-full md:w-56 h-48 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                      <img
                        src={pet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'}
                        alt={pet.name}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setSelectedPetDetail(pet)}
                      />
                    </div>

                    {/* Pet & Donor Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 
                            className="text-xl font-bold text-slate-900 cursor-pointer hover:text-[#5A6340] hover:underline"
                            onClick={() => setSelectedPetDetail(pet)}
                          >
                            {pet.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Aguardando Aprovação
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {pet.species} &bull; {pet.gender} &bull; {pet.size} &bull; Resgatado em {pet.city}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Pet Features */}
                        <div className="bg-[#FDFCF0] border border-[#E0DBC1]/60 p-3 rounded-xl space-y-1 text-xs text-slate-700">
                          <span className="font-bold text-[#5A6340] block mb-1">Informações do Animal:</span>
                          <p><strong>Idade aproximada:</strong> {pet.ageApprox}</p>
                          <p><strong>Cor da pelagem:</strong> {pet.color}</p>
                          <p><strong>Temperamento:</strong> {pet.temperament || 'Não especificado'}</p>
                          <p><strong>Saúde:</strong> {[
                            pet.castrated ? 'Castrado' : null,
                            pet.vaccinated ? 'Vacinado' : null,
                            pet.dewormed ? 'Vermifugado' : null,
                            pet.needsTreatment ? 'Necessita Tratamento' : null
                          ].filter(Boolean).join(', ') || 'Nenhum registro médico'}</p>
                          {pet.specialNeeds && <p className="text-amber-700 font-medium"><strong>Necessidades especiais:</strong> {pet.specialNeeds}</p>}
                        </div>

                        {/* Donor Information */}
                        <div className="bg-[#F5F2E1] border border-[#E0DBC1]/80 p-3 rounded-xl space-y-1 text-xs text-slate-700">
                          <span className="font-bold text-[#5A6340] block mb-1">Informações do Doador / Protetor:</span>
                          {pet.donorInfo ? (
                            <>
                              <p><strong>Nome:</strong> {pet.donorInfo.name}</p>
                              <p><strong>E-mail:</strong> {pet.donorInfo.email}</p>
                              <p><strong>WhatsApp:</strong> {pet.donorInfo.phone}</p>
                              <a
                                href={`https://wa.me/55${pet.donorInfo.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> Chamar no WhatsApp
                              </a>
                            </>
                          ) : (
                            <p className="italic text-slate-500">Nenhuma informação de doador vinculada.</p>
                          )}
                        </div>
                      </div>

                      {/* Pet Story */}
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">História do Resgate:</span>
                        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{pet.story}"
                        </p>
                      </div>

                      {/* Approval Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleRejectPet(pet.id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Recusar e Excluir
                        </button>
                        <button
                          onClick={() => handleApprovePet(pet.id)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Aprovar e Publicar na Galeria
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* --- 3. CANDIDATES KANBAN CRM PIPELINE TAB --- */}
        {activeTab === 'candidates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Funil de Adoção (CRM)</h2>
              <p className="text-xs text-slate-500">Acompanhe as propostas de interesse por fases. Clique em cada candidato para abrir o histórico de entrevistas, Whatsapp e observações privadas.</p>
            </div>

            {/* Pipeline column scroll map */}
            <div className="flex gap-4 overflow-x-auto pb-4 max-w-full items-start">
              
              {([
                'Interesse recebido', 
                'Em análise', 
                'Contato realizado', 
                'Entrevista', 
                'Visita', 
                'Aprovado', 
                'Entrega agendada', 
                'Adotado', 
                'Acompanhamento'
              ] as CandidateStatus[]).map((col) => {
                const colCandidates = candidates.filter(c => c.status === col);
                return (
                  <div key={col} className="w-72 flex-shrink-0 bg-slate-100/90 rounded-2xl border border-slate-200 p-4 flex flex-col max-h-[80vh]">
                    
                    {/* Header column title */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 tracking-tight capitalize block max-w-[80%] truncate">
                        {col}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-mono text-[10px] font-bold">
                        {colCandidates.length}
                      </span>
                    </div>

                    {/* Candidate Cards list */}
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                      {colCandidates.map(c => {
                        const pet = pets.find(p => p.id === c.petId);
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedCandidate(c)}
                            className="p-4 bg-white rounded-xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md cursor-pointer transition-all space-y-3"
                          >
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs tracking-tight">{c.name}</h4>
                              <span className="text-[9px] text-slate-400 block font-mono mt-0.5">Visualizar perfil &rarr;</span>
                            </div>

                            {pet && (
                              <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                <img src={pet.photos[0]} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-md object-cover border border-slate-200" />
                                <span className="text-[10px] font-bold text-slate-700 truncate">Quer adotar: {pet.name}</span>
                              </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {c.tags.slice(0, 2).map((t, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-600 font-semibold">{t}</span>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                              <span>{c.city}</span>
                              <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        );
                      })}

                      {colCandidates.length === 0 && (
                        <div className="text-center py-8 text-slate-400 font-mono text-[10px] bg-white/40 rounded-xl border border-dashed border-slate-200">
                          Nenhum candidato nesta fase
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Candidate Details Slide-Over / Modal Panel */}
            <AnimatePresence>
              {selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm p-4">
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-2xl bg-white h-full shadow-2xl rounded-l-2xl overflow-hidden flex flex-col p-6"
                  >
                    
                    {/* Header inside side-over */}
                    <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Perfil do Candidato</span>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mt-1">{selectedCandidate.name}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedCandidate(null)}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Scrollable details panel */}
                    <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
                      
                      {/* Interactive Stage Pipeline Changer */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <label className="block text-xs font-bold text-slate-700">Mudar Fase no Funil (Pipeline)</label>
                        <div className="flex gap-2">
                          <select
                            value={selectedCandidate.status}
                            onChange={(e) => handleUpdateCandidateStatus(selectedCandidate.id, e.target.value as CandidateStatus)}
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none flex-1"
                          >
                            <option value="Interesse recebido">Interesse recebido</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Contato realizado">Contato realizado</option>
                            <option value="Entrevista">Entrevista</option>
                            <option value="Visita">Visita</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Entrega agendada">Entrega agendada</option>
                            <option value="Adotado">Adotado</option>
                            <option value="Acompanhamento">Acompanhamento</option>
                          </select>
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fase Atual
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Quick Templates Actions */}
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                        <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                          <MessageCircle className="w-4.5 h-4.5 text-emerald-600" /> WhatsApp Direct (Disparador de Mensagem)
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          Abra o WhatsApp diretamente com o candidato do pet de interesse 
                          (<strong>{pets.find(p => p.id === selectedCandidate.petId)?.name || 'Animal'}</strong>) com modelos prontos:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                          <a
                            href={getWhatsAppLink(selectedCandidate, pets.find(p => p.id === selectedCandidate.petId)!, 'intro')}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold block shadow-sm transition-colors"
                          >
                            1. Primeiro Contato
                          </a>
                          <a
                            href={getWhatsAppLink(selectedCandidate, pets.find(p => p.id === selectedCandidate.petId)!, 'interview')}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold block shadow-sm transition-colors"
                          >
                            2. Agendar Entrevista
                          </a>
                          <a
                            href={getWhatsAppLink(selectedCandidate, pets.find(p => p.id === selectedCandidate.petId)!, 'approved')}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold block shadow-sm transition-colors"
                          >
                            3. Aprovar Adoção!
                          </a>
                        </div>
                      </div>

                      {/* Tag system */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags do Candidato</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCandidate.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 flex items-center gap-1">
                              {t}
                              <button 
                                onClick={() => handleRemoveCandidateTag(selectedCandidate.id, t)}
                                className="text-slate-400 hover:text-red-600 text-[10px] font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => {
                              const tg = prompt('Adicionar tag personalizada:');
                              if (tg) handleAddCandidateTag(selectedCandidate.id, tg);
                            }}
                            className="px-2 py-0.5 rounded-full text-xs border border-dashed border-slate-300 text-slate-500 hover:border-slate-800"
                          >
                            + Nova tag
                          </button>
                        </div>
                      </div>

                      {/* Full Form Responses */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respostas do Formulário</h4>
                        
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">WhatsApp</span>
                            <span className="font-bold text-slate-800">{selectedCandidate.whatsapp}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Localização</span>
                            <span className="font-bold text-slate-800">{selectedCandidate.city} / {selectedCandidate.neighborhood}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Estrutura de Lar</span>
                            <span className="font-bold text-slate-800">{selectedCandidate.housingType} (Possui Quintal: {selectedCandidate.backyard})</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Situação do imóvel</span>
                            <span className="font-bold text-slate-800">Propriedade {selectedCandidate.tenure}</span>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-slate-100">
                            <span className="text-slate-400 block font-medium">Histórico com Pets</span>
                            <span className="font-bold text-slate-800">
                              Já teve pets: {selectedCandidate.experience.hadPets}. Outros animais atuais: {selectedCandidate.experience.otherAnimalsCount} 
                              {selectedCandidate.experience.otherAnimalsCount > 0 && ` (${selectedCandidate.experience.otherAnimalsDetails})`}
                            </span>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-slate-100">
                            <span className="text-slate-400 block font-medium">Crianças na Residência</span>
                            <span className="font-bold text-slate-800">
                              {selectedCandidate.hasChildren === 'Sim' ? (
                                <span>
                                  Sim (Idades: {selectedCandidate.childrenAges || 'Não informada'} | Relacionamento com pets: {selectedCandidate.childrenPetRelation || 'Não informado'})
                                </span>
                              ) : (
                                'Não moram ou frequentam crianças'
                              )}
                            </span>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-amber-100 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/60">
                            <span className="text-amber-800 block font-semibold flex items-center gap-1 text-[10px] uppercase tracking-wider mb-0.5">
                              <Shield className="w-3.5 h-3.5 text-amber-600" /> Termo de Visita de Averiguação e Adaptação
                            </span>
                            <span className="font-bold text-slate-800 text-[11px] block">
                              {selectedCandidate.agreedToVisits ? (
                                <span className="text-emerald-700 flex items-center gap-1">✓ Consentimento Autorizado pelo Candidato</span>
                              ) : (
                                <span className="text-red-700">✗ Não assinado / Não aceito</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-2">
                          <div>
                            <span className="text-slate-500 block font-bold mb-1">Motivação para Adoção:</span>
                            <p className="text-slate-700 leading-relaxed font-sans">{selectedCandidate.motivation}</p>
                          </div>
                          {selectedCandidate.notes && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="text-slate-500 block font-bold mb-1">Notas adicionais de cadastro:</span>
                              <p className="text-slate-700 leading-relaxed font-sans">{selectedCandidate.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Internal notes annotated logs */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-slate-500" /> Anotações Privadas Internas
                        </h4>
                        
                        <div className="space-y-2">
                          {selectedCandidate.internalNotes.map(note => (
                            <div key={note.id} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                              <div className="flex justify-between font-bold text-indigo-950 mb-1">
                                <span>Por {note.author}</span>
                                <span className="font-mono text-[10px] text-slate-400">{note.date}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed font-sans">{note.text}</p>
                            </div>
                          ))}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newPrivateNote}
                              onChange={e => setNewPrivateNote(e.target.value)}
                              placeholder="Adicione um comentário interno sobre a entrevista, visita..."
                              className="px-3 py-2 border border-slate-200 rounded-xl text-xs flex-1 focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddPrivateNote(selectedCandidate.id)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Chronological History logs */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histórico de Alterações</h4>
                        <div className="relative border-l border-slate-200 pl-4 space-y-4 ml-2">
                          {selectedCandidate.historyLogs.map(log => (
                            <div key={log.id} className="relative text-xs">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                              <span className="font-mono text-[10px] text-slate-400 block">{log.date}</span>
                              <span className="text-slate-700 mt-0.5 block">{log.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* --- 4. LARES TEMPORÁRIOS MANAGEMENT TAB --- */}
        {activeTab === 'lts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lares Temporários (LT)</h2>
                <p className="text-xs text-slate-500">Cadastre lares parceiros, veja a quantidade de vagas e quais animais estão em cada lar.</p>
              </div>
              <button
                onClick={openAddLT}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Cadastrar Novo LT
              </button>
            </div>

            {/* Add LT popup modal */}
            {isAddingLT && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-lg w-full relative"
                >
                  <button 
                    onClick={() => { setIsAddingLT(false); setEditingLT(null); }}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-950 mb-4 font-display">
                    {editingLT ? 'Editar Lar Temporário' : 'Novo Lar Temporário'}
                  </h3>
                  <form onSubmit={handleSaveLT} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Responsável *</label>
                      <input type="text" required value={ltName} onChange={e => setLtName(e.target.value)} placeholder="Ex: Lar da Márcia" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contato / Telefone *</label>
                      <input type="text" required value={ltContact} onChange={e => setLtContact(e.target.value)} placeholder="Ex: (19) 99876-5432" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vagas Totais de Capacidade *</label>
                      <input type="number" required min="1" value={ltVacancies} onChange={e => setLtVacancies(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Anotações Internas (Preferências, restrições)</label>
                      <textarea value={ltNotes} onChange={e => setLtNotes(e.target.value)} placeholder="Aceita apenas cães filhotes, possui quintal fechado..." rows={3} className="w-full p-3 border border-slate-200 rounded-xl text-xs" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => { setIsAddingLT(false); setEditingLT(null); }} className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer">Cancelar</button>
                      <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">Salvar LT</button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* List of LTs with occupation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTemporaryHomes.map(lt => {
                const ltPets = pets.filter(p => p.temporaryHomeId === lt.id && p.status !== 'Adotado');
                const filledVacancies = ltPets.length;
                const remaining = Math.max(0, lt.vacancies - filledVacancies);
                const isDynamicLT = !temporaryHomes.some(h => h.id === lt.id);
                return (
                  <div key={lt.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-md leading-tight">{lt.name}</h4>
                          {isDynamicLT && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold">
                              Gerado via Usuário Doador
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!isDynamicLT ? (
                            <>
                              <button onClick={() => openEditLT(lt)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteLT(lt.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Automático</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1.5">Telefone: {lt.contact}</span>

                      {/* Notes block */}
                      {lt.notes && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-3 italic">
                          "{lt.notes}"
                        </p>
                      )}

                      {/* Occupied Pets list */}
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Animais Hospedados Atualmente ({filledVacancies}):</span>
                        <div className="space-y-1.5">
                          {ltPets.map(p => (
                            <div key={p.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50">
                              <span className="font-bold text-slate-700">{p.name} ({p.species})</span>
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md uppercase font-bold">{p.status}</span>
                            </div>
                          ))}
                          {ltPets.length === 0 && (
                            <span className="text-xs text-slate-400 italic block py-1">Nenhum animal hospedado</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-150 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Ocupação:</span>
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        remaining === 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {remaining} vagas livres de {lt.vacancies}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* --- 4.1. USER MANAGEMENT TAB (TAGS) --- */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h2>
                <p className="text-xs text-slate-500">
                  Gerencie doadores, pretendentes e adicione tags personalizadas para controle de perfil.
                </p>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar usuário por nome, email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Tag filtering row */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-wrap gap-2.5 items-center bg-slate-50/50 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                Filtrar por Tag:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedUserTagFilter(null)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    selectedUserTagFilter === null
                      ? 'bg-[#5A6340] text-white border border-[#5A6340] shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Todas ({users.length})
                </button>
                {allUserTags.map(tag => {
                  const count = users.filter(u => u.customTags && u.customTags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedUserTagFilter(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedUserTagFilter === tag
                          ? 'bg-[#5A6340] text-white border border-[#5A6340] shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-4">Usuário</th>
                      <th className="p-4">Papel</th>
                      <th className="p-4">Lar Temporário</th>
                      <th className="p-4">Tags Personalizadas</th>
                      <th className="p-4">Ações</th>
                      <th className="p-4 text-right">Adicionar Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(users || [])
                      .filter(u => {
                        const s = userSearch.toLowerCase();
                        const matchesSearch = (
                          u.name.toLowerCase().includes(s) ||
                          u.email.toLowerCase().includes(s) ||
                          (u.phone && u.phone.includes(s)) ||
                          (u.customTags && u.customTags.some(t => t.toLowerCase().includes(s)))
                        );
                        const matchesTag = selectedUserTagFilter
                          ? (u.customTags && u.customTags.includes(selectedUserTagFilter))
                          : true;
                        return matchesSearch && matchesTag;
                      })
                      .map(u => {
                        const hasSubmittedPet = pets.some(p => p.donorId === u.id);
                        const userTags = u.customTags || [];
                        return (
                          <React.Fragment key={u.id}>
                            <tr className={`hover:bg-slate-50/50 transition-colors ${expandedUserId === u.id ? 'bg-slate-50' : ''}`}>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  {u.profilePhotoUrl ? (
                                    <img 
                                      src={u.profilePhotoUrl} 
                                      alt="" 
                                      referrerPolicy="no-referrer"
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 cursor-pointer hover:scale-105 transition-transform duration-200"
                                      onClick={() => setSelectedUserDetail(u)}
                                    />
                                  ) : (
                                    <div 
                                      className="w-9 h-9 rounded-xl bg-[#5A6340]/10 text-[#5A6340] font-bold flex items-center justify-center text-sm cursor-pointer hover:bg-[#5A6340]/20 transition-colors"
                                      onClick={() => setSelectedUserDetail(u)}
                                    >
                                      {u.name.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span 
                                        className="font-bold text-slate-900 cursor-pointer hover:text-[#5A6340] hover:underline"
                                        onClick={() => setSelectedUserDetail(u)}
                                      >
                                        {u.name}
                                      </span>
                                      {u.flaggedAttention && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
                                          <AlertCircle className="w-2.5 h-2.5" /> Atenção
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-slate-400 text-[10px] block font-mono">{u.email}</span>
                                    {u.phone && <span className="text-slate-500 text-[10px] block font-mono">{u.phone}</span>}
                                    {u.adminDescription && (
                                      <span className="text-indigo-600 font-medium text-[10px] block mt-0.5 truncate max-w-xs" title={u.adminDescription}>
                                        📝 {u.adminDescription}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.role === 'Ambos'
                                    ? 'bg-purple-100 text-purple-800'
                                    : u.role === 'Doador'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-teal-100 text-teal-800'
                                }`}>
                                  {u.role || 'Doador'}
                                </span>
                              </td>
                              <td className="p-4">
                                {hasSubmittedPet ? (
                                  <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold">
                                      Sim (Doador Ativo)
                                    </span>
                                    <span className="text-[10px] text-slate-400 block italic">
                                      Tratado como LT automático
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">Não ativo</span>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1.5 max-w-xs">
                                  {userTags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 bg-[#5A6340]/10 text-[#5A6340] px-2 py-0.5 rounded-md font-medium text-[10px]">
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveUserTag(u.id, tag)}
                                        className="hover:bg-red-100 hover:text-red-600 rounded px-1 text-[11px] leading-none transition-colors cursor-pointer"
                                        title="Remover Tag"
                                      >
                                        &times;
                                      </button>
                                    </span>
                                  ))}
                                  {userTags.length === 0 && (
                                    <span className="text-slate-400 italic text-[11px]">Nenhuma tag</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <button
                                  type="button"
                                  onClick={() => toggleExpandUser(u)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  {expandedUserId === u.id ? 'Fechar' : 'Admin Painel'}
                                  <Edit2 className="w-3 h-3 text-slate-500" />
                                </button>
                              </td>
                              <td className="p-4 text-right">
                                <form
                                  onSubmit={e => {
                                    e.preventDefault();
                                    const text = userTagInput[u.id] || '';
                                    handleAddUserTag(u.id, text);
                                  }}
                                  className="flex items-center justify-end gap-1.5"
                                >
                                  <input
                                    type="text"
                                    placeholder="Nova tag..."
                                    value={userTagInput[u.id] || ''}
                                    onChange={e => setUserTagInput(prev => ({ ...prev, [u.id]: e.target.value }))}
                                    className="px-2 py-1 border border-slate-200 rounded-lg text-xs w-24 focus:outline-none focus:ring-1 focus:ring-[#5A6340]"
                                  />
                                  <button
                                    type="submit"
                                    className="p-1 bg-[#5A6340] hover:bg-[#4E5637] text-white rounded-lg transition-colors cursor-pointer"
                                    title="Adicionar Tag"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </form>
                              </td>
                            </tr>

                            {/* Private admin section row expansion */}
                            {expandedUserId === u.id && (
                              <tr className="bg-slate-50/80">
                                <td colSpan={6} className="p-4 border-t border-b border-slate-200">
                                  <div className="space-y-4 max-w-2xl bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-xs font-bold text-[#5A6340] uppercase tracking-wider flex items-center gap-1.5">
                                      <Shield className="w-4 h-4 text-[#5A6340]" /> Painel Interno do Usuário (Apenas Administração)
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-600">
                                          Descrição Personalizada (Max 500 caracteres)
                                        </label>
                                        <textarea
                                          maxLength={500}
                                          rows={4}
                                          value={userAdminDescInput}
                                          onChange={e => setUserAdminDescInput(e.target.value)}
                                          placeholder="Escreva observações particulares, observações de visitas ou histórico deste usuário..."
                                          className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#5A6340] font-sans"
                                        />
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                          <span>Apenas visível pela administração</span>
                                          <span>{userAdminDescInput.length}/500</span>
                                        </div>
                                      </div>

                                      <div className="space-y-3 flex flex-col justify-between">
                                        <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 flex items-start gap-2.5">
                                          <input
                                            type="checkbox"
                                            id={`attention-${u.id}`}
                                            checked={userAttentionInput}
                                            onChange={e => setUserAttentionInput(e.target.checked)}
                                            className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 mt-0.5 cursor-pointer"
                                          />
                                          <label htmlFor={`attention-${u.id}`} className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                                            <span className="block font-bold text-red-900 mb-0.5 flex items-center gap-1">
                                              <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Marcar como "Atenção"
                                            </span>
                                            Sinaliza que este usuário necessita de cuidado especial ou observação na avaliação de adoções futuras.
                                          </label>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                          <button
                                            type="button"
                                            onClick={() => setExpandedUserId(null)}
                                            className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                                          >
                                            Cancelar
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleSaveAdminUserFields(u.id)}
                                            className="px-4 py-1.5 bg-[#5A6340] hover:bg-[#4E5637] text-white rounded-lg text-xs font-bold cursor-pointer"
                                          >
                                            Salvar Alterações
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    {(users || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Nenhum usuário cadastrado no sistema.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 5. POST-ADOPTION CHRONOLOGY REMINDERS TAB --- */}
        {activeTab === 'followups' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Acompanhamento Pós-Adoção</h2>
              <p className="text-xs text-slate-500">Mantenha contato regular com os tutores e verifique se as adoções continuam bem-sucedidas.</p>
            </div>

            {/* Filter and overview row */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-wrap gap-2 items-center justify-between bg-slate-50/50">
              <div className="flex gap-2">
                {(['all', 'Pendente', 'Concluído'] as const).map(fl => (
                  <button
                    key={fl}
                    onClick={() => setFollowUpFilter(fl as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      followUpFilter === fl ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {fl === 'all' ? 'Ver Todos' : fl}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-500">
                Total filtrado: {followUps.filter(f => followUpFilter === 'all' || f.status === followUpFilter).length} lembretes
              </span>
            </div>

            {/* Edit FollowUp inline dialog */}
            {activeFollowUpEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-xl w-full relative max-h-[90vh] overflow-y-auto space-y-4 animate-in duration-200"
                >
                  <button 
                    onClick={() => setActiveFollowUpEdit(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-950 font-display">Registrar Retorno de Acompanhamento ({activeFollowUpEdit.type})</h3>
                  <form onSubmit={handleSaveFollowUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Atualizações e Comentários do Tutor *</label>
                    <textarea 
                      required value={fupTutorNotes} onChange={e => setFupTutorNotes(e.target.value)}
                      placeholder="Relate o que o adotante disse sobre o comportamento e rotina do pet..." 
                      rows={3} className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Observações da Protetora (Interno)</label>
                    <textarea 
                      value={fupAdminNotes} onChange={e => setFupAdminNotes(e.target.value)}
                      placeholder="Anote se o animal parece saudável, seguro, se houve intercorrência..." 
                      rows={2} className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Imagens Recebidas (Fazer Upload ou URL)</label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFupPhoto(true);
                      }}
                      onDragLeave={() => setIsDraggingFupPhoto(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDraggingFupPhoto(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const files = Array.from(e.dataTransfer.files) as File[];
                          const newBase64s: string[] = [];
                          for (const file of files) {
                            if (file.type.startsWith('image/')) {
                              try {
                                const base64 = await fileToBase64(file);
                                newBase64s.push(base64);
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }
                          if (newBase64s.length > 0) {
                            const currentPhotos = fupPhotosText.split(',').map(u => u.trim()).filter(Boolean);
                            setFupPhotosText([...currentPhotos, ...newBase64s].join(', '));
                          }
                        }
                      }}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isDraggingFupPhoto
                          ? 'border-[#5A6340] bg-[#5A6340]/5'
                          : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                      }`}
                      onClick={() => document.getElementById('admin-fup-photos-file-input')?.click()}
                    >
                      <input
                        id="admin-fup-photos-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const files = Array.from(e.target.files) as File[];
                            const newBase64s: string[] = [];
                            for (const file of files) {
                              try {
                                const base64 = await fileToBase64(file);
                                newBase64s.push(base64);
                              } catch (err) {
                                console.error(err);
                              }
                            }
                            if (newBase64s.length > 0) {
                              const currentPhotos = fupPhotosText.split(',').map(u => u.trim()).filter(Boolean);
                              setFupPhotosText([...currentPhotos, ...newBase64s].join(', '));
                            }
                          }
                        }}
                      />
                      <Upload className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Arraste fotos do pet recebidas aqui ou clique para fazer upload</p>
                        <p className="text-[10px] text-slate-400">Você pode fazer upload de várias fotos juntas</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <input
                        type="text"
                        value={fupPhotosText}
                        onChange={(e) => setFupPhotosText(e.target.value)}
                        placeholder="Ou cole os links das fotos recebidas no whatsapp separados por vírgula"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    {fupPhotosText.split(',').map(u => u.trim()).filter(Boolean).length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-bold text-slate-500 mb-1">Fotos Recebidas ({fupPhotosText.split(',').map(u => u.trim()).filter(Boolean).length}):</p>
                        <div className="flex gap-2 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {fupPhotosText.split(',').map(u => u.trim()).filter(Boolean).map((photo, i) => (
                            <div key={i} className="relative w-12 h-12 rounded overflow-hidden border border-slate-200 group">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = fupPhotosText.split(',').map(u => u.trim()).filter(Boolean).filter((_, idx) => idx !== i);
                                  setFupPhotosText(filtered.join(', '));
                                }}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] font-bold cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white py-2 border-t border-slate-100">
                    <button type="button" onClick={() => setActiveFollowUpEdit(null)} className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">Concluir Lembrete</button>
                  </div>
                </form>
                </motion.div>
              </div>
            )}

            {/* FollowUps timeline grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {followUps.filter(f => {
                if (followUpFilter === 'all') return true;
                return f.status === followUpFilter;
              }).map(f => {
                const pet = pets.find(p => p.id === f.petId);
                const adopter = candidates.find(c => c.id === f.candidateId);
                return (
                  <div key={f.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {f.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase">{f.type}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Agendado para: {f.scheduledDate}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        {pet && (
                          <img src={pet.photos[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-none">Pet: {pet?.name || 'Pet Removido'}</h4>
                          <span className="text-[10px] text-slate-500 mt-1 block">Tutor: {adopter?.name || 'Não cadastrado'}</span>
                        </div>
                      </div>

                      {/* Photo Gallery inside FollowUp */}
                      {f.photosReceived.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {f.photosReceived.map((ph, i) => (
                            <img
                              key={i}
                              src={ph}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-16 rounded-lg object-cover border border-slate-200 cursor-pointer hover:scale-[1.03] hover:border-slate-300 transition-all duration-200"
                              onClick={() => onZoomImage?.(ph)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Notes displayed if completed */}
                      {f.status === 'Concluído' ? (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-600 space-y-1 font-sans">
                          <p><strong>Comentários do tutor:</strong> "{f.tutorNotes}"</p>
                          {f.adminNotes && <p><strong>Nota interna:</strong> "{f.adminNotes}"</p>}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-3 flex items-center gap-1.5 bg-amber-50/50 p-2 rounded-lg border border-amber-500/10 text-amber-800">
                          <AlertCircle className="w-3.5 h-3.5" /> Entre em contato com o adotante via WhatsApp {adopter?.whatsapp} para colher fotos e atualizações de bem-estar.
                        </p>
                      )}
                    </div>

                    {f.status === 'Pendente' && (
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        {adopter && pet && (
                          <a
                            href={`https://wa.me/55${adopter.whatsapp}?text=${encodeURIComponent(
                              `Olá ${adopter.name}! Aqui é do APP adote aqui, tudo bem? Vim acompanhar como está a adaptação do(a) ${pet.name} nessa fase de pós-adoção de ${f.type}. Se puder, me mande umas fotos dele(a) no lar!`
                            )}`}
                            target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Cobrar no WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => openEditFollowUp(f)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors ml-auto"
                        >
                          Registrar Fotos e Retorno
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* --- 6. REPORTS TAB --- */}
        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios de Desempenho</h2>
              <p className="text-xs text-slate-500">Métricas analíticas simplificadas sobre resgates, adorações concluídas e funil de interesse.</p>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pet species status */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Espécies Resgatadas</h4>
                
                <div className="space-y-3">
                  {['Cachorro', 'Gato'].map(sp => {
                    const count = pets.filter(p => p.species === sp).length;
                    const countAdopted = pets.filter(p => p.species === sp && p.status === 'Adotado').length;
                    const pct = count > 0 ? (countAdopted / count) * 100 : 0;
                    return (
                      <div key={sp} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>{sp}s ({count} cadastrados)</span>
                          <span>{countAdopted} adotados ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic adoption report */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adoções por Cidade</h4>
                <div className="space-y-3 text-xs">
                  {Array.from(new Set(pets.map(p => p.city))).map(ct => {
                    const count = pets.filter(p => p.city === ct && p.status === 'Adotado').length;
                    return (
                      <div key={ct} className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ct}
                        </span>
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{count} adotados</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Housing analysis */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil dos Interessados</h4>
                <div className="space-y-3 text-xs">
                  {['Casa', 'Apartamento'].map(hs => {
                    const count = candidates.filter(c => c.housingType === hs).length;
                    const total = candidates.length || 1;
                    const pct = (count / total) * 100;
                    return (
                      <div key={hs} className="space-y-1">
                        <div className="flex justify-between text-slate-700 font-semibold">
                          <span>Mora em {hs}</span>
                          <span>{count} pessoas ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Custom SVG Adoption Velocity Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-md font-bold text-slate-900 mb-2">Histórico de Resgates Cadastrados e Adoções Ativas</h3>
              <p className="text-xs text-slate-400 mb-6">Comparativo do volume de pets no sistema.</p>

              <div className="h-48 w-full flex items-end gap-1.5 pt-4">
                {pets.map((p, index) => {
                  const val = p.status === 'Adotado' ? 80 : 40;
                  return (
                    <div key={p.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          p.status === 'Adotado' ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        style={{ height: `${val}%` }}
                      ></div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 truncate max-w-full">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* --- 7. BACKUP & RESTORE DB TAB --- */}
        {activeTab === 'backup' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Backup e Restauração</h2>
              <p className="text-xs text-slate-500">Evite perder dados devido ao reset de cache do navegador. Baixe uma cópia ou restaure um arquivo.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
              
              {/* Export backup block */}
              <div className="space-y-3 pb-6 border-b border-slate-150">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Download className="w-5 h-5 text-indigo-600" /> Exportar Base de Dados (JSON)
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gere um arquivo de backup criptografado em formato JSON contendo todos os dados cadastrados: pets, lares temporários, candidatos e históricos de acompanhamentos.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Fazer Download do Backup (.json)
                </button>
              </div>

              {/* Import backup block */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Upload className="w-5 h-5 text-emerald-600" /> Importar / Restaurar Banco de Dados
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Selecione um arquivo de backup compatível anteriormente exportado pelo sistema para substituir os dados atuais por completo. <strong>Atenção: esta ação substituirá os registros atuais.</strong>
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </main>

      {/* PET DETAIL MODAL FOR ADMINS */}
      <AnimatePresence>
        {selectedPetDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Dog className="w-5 h-5 text-[#5A6340]" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Ficha Detalhada do Pet</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Visualização administrativa do animal no sistema</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPetDetail(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer border border-transparent"
                  title="Fechar"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Top row: images & primary details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Section with support for multiple photos */}
                  <div className="space-y-3">
                    <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={selectedPetDetail.photos[selectedPetDetail.primaryPhotoIndex] || selectedPetDetail.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'}
                        alt={selectedPetDetail.name}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-200"
                        onClick={() => onZoomImage?.(selectedPetDetail.photos[selectedPetDetail.primaryPhotoIndex] || selectedPetDetail.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600')}
                      />
                    </div>
                    {/* Other photos row */}
                    {selectedPetDetail.photos.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedPetDetail.photos.map((ph, idx) => (
                          <div 
                            key={idx} 
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-slate-50 cursor-pointer transition-all ${
                              idx === selectedPetDetail.primaryPhotoIndex ? 'border-[#5A6340]' : 'border-slate-200'
                            }`}
                          >
                            <img
                              src={ph}
                              alt=""
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all duration-200"
                              onClick={() => onZoomImage?.(ph)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* General attributes */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 leading-none">{selectedPetDetail.name}</h2>
                      <span className="text-xs font-semibold text-slate-500 block mt-1">Status: 
                        <span className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          selectedPetDetail.status === 'Disponível' ? 'bg-emerald-100 text-emerald-800' :
                          selectedPetDetail.status === 'Em análise' ? 'bg-amber-100 text-amber-800' :
                          selectedPetDetail.status === 'Reservado' ? 'bg-indigo-100 text-indigo-800' :
                          selectedPetDetail.status === 'Adotado' ? 'bg-indigo-950 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {selectedPetDetail.status}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Espécie / Sexo:</span>
                        <span className="font-bold text-slate-800">{selectedPetDetail.species} • {selectedPetDetail.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Idade aproximada:</span>
                        <span className="font-bold text-slate-800">{selectedPetDetail.ageApprox}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Porte / Pelagem:</span>
                        <span className="font-bold text-slate-800">Porte {selectedPetDetail.size} • {selectedPetDetail.color}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Cidade de Resgate:</span>
                        <span className="font-bold text-slate-800">{selectedPetDetail.city}</span>
                      </div>
                    </div>

                    {/* Compatibility */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div className="p-2 bg-[#FDFCF0] border border-[#E0DBC1]/50 rounded-lg">
                        <strong>Aceita outros animais?</strong> {selectedPetDetail.compatOtherAnimals}
                      </div>
                      <div className="p-2 bg-[#FDFCF0] border border-[#E0DBC1]/50 rounded-lg">
                        <strong>Compatível com crianças?</strong> {selectedPetDetail.compatChildren}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health parameters */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histórico de Saúde</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${selectedPetDetail.castrated ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedPetDetail.castrated ? '✓ Castrado' : '✗ Não castrado'}
                      {selectedPetDetail.castrationDate && ` (${selectedPetDetail.castrationDate})`}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${selectedPetDetail.vaccinated ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedPetDetail.vaccinated ? '✓ Vacinado' : '✗ Não vacinado'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${selectedPetDetail.dewormed ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedPetDetail.dewormed ? '✓ Vermifugado' : '✗ Não vermifugado'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${selectedPetDetail.needsTreatment ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedPetDetail.needsTreatment ? '⚠ Tratamento Ativo' : '✓ Saudável / Sem tratamento'}
                    </span>
                  </div>

                  {selectedPetDetail.treatmentNotes && (
                    <p className="text-xs bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-amber-800 leading-relaxed">
                      <strong>Observações de Tratamento:</strong> {selectedPetDetail.treatmentNotes}
                    </p>
                  )}
                  {selectedPetDetail.specialNeeds && (
                    <p className="text-xs bg-red-50 border border-red-100 p-2.5 rounded-lg text-red-800 leading-relaxed">
                      <strong>Necessidades Especiais:</strong> {selectedPetDetail.specialNeeds}
                    </p>
                  )}
                </div>

                {/* Story and temperament */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="font-bold text-slate-700 block">História do Resgate:</span>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPetDetail.story || 'Nenhuma história cadastrada.'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="font-bold text-slate-700 block">Temperamento:</span>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPetDetail.temperament || 'Não especificado.'}</p>
                  </div>
                </div>

                {/* LT (Lar temporário) association & Donor info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FDFCF0] border border-[#E0DBC1]/60 rounded-xl space-y-1.5">
                    <span className="font-bold text-[#5A6340] block">Lar Temporário Vinculado:</span>
                    {selectedPetDetail.temporaryHomeId === 'none' ? (
                      <p className="text-slate-500 italic">Resgatado particular, sem LT associado.</p>
                    ) : (
                      <div>
                        {(() => {
                          const lt = allTemporaryHomes.find(h => h.id === selectedPetDetail.temporaryHomeId);
                          return lt ? (
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-800">{lt.name}</p>
                              <p className="text-slate-500 font-mono text-[10px]">Contato: {lt.contact}</p>
                              {lt.notes && <p className="text-slate-400 text-[10px] mt-1 italic">{lt.notes}</p>}
                            </div>
                          ) : (
                            <p className="text-slate-500">LT não encontrado ou removido.</p>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[#F5F2E1] border border-[#E0DBC1]/80 rounded-xl space-y-1.5">
                    <span className="font-bold text-[#5A6340] block">Informações do Doador / Protetor:</span>
                    {selectedPetDetail.donorId ? (
                      <div>
                        {(() => {
                          const linkedUser = users.find(u => u.id === selectedPetDetail.donorId);
                          return linkedUser ? (
                            <div className="space-y-0.5">
                              <p 
                                className="font-semibold text-[#5A6340] cursor-pointer hover:underline flex items-center gap-1 font-bold"
                                onClick={() => {
                                  setSelectedUserDetail(linkedUser);
                                  setSelectedPetDetail(null);
                                }}
                              >
                                {linkedUser.name} <span className="text-[9px] bg-[#5A6340]/10 text-[#5A6340] px-1.5 py-0.5 rounded font-normal">Ver Perfil</span>
                              </p>
                              <p className="text-slate-500 font-mono text-[10px]">{linkedUser.email} {linkedUser.phone && `• ${linkedUser.phone}`}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-semibold text-slate-800">{selectedPetDetail.donorInfo?.name || 'Não informado'}</p>
                              <p className="text-slate-500 font-mono text-[10px]">{selectedPetDetail.donorInfo?.email} {selectedPetDetail.donorInfo?.phone && `• ${selectedPetDetail.donorInfo?.phone}`}</p>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-slate-800">{selectedPetDetail.donorInfo?.name || 'Não informado'}</p>
                        <p className="text-slate-500 font-mono text-[10px]">{selectedPetDetail.donorInfo?.email} {selectedPetDetail.donorInfo?.phone && `• ${selectedPetDetail.donorInfo?.phone}`}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-between">
                <button
                  onClick={() => {
                    setEditingPet(selectedPetDetail);
                    setSelectedPetDetail(null);
                  }}
                  className="px-4 py-2 bg-[#5A6340] hover:bg-[#4E5637] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar Informações do Pet
                </button>
                <button
                  onClick={() => setSelectedPetDetail(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Fechar Ficha
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* USER DETAIL MODAL FOR ADMINS */}
      <AnimatePresence>
        {selectedUserDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#5A6340]" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Perfil Completo do Usuário</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Informações de doador, tutor ou lar temporário</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer border border-transparent"
                  title="Fechar"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Profile Top Info block */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-100">
                  {selectedUserDetail.profilePhotoUrl ? (
                    <img
                      src={selectedUserDetail.profilePhotoUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-inner cursor-pointer hover:scale-105 transition-all duration-200 shrink-0"
                      onClick={() => onZoomImage?.(selectedUserDetail.profilePhotoUrl!)}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#5A6340]/10 text-[#5A6340] font-bold flex items-center justify-center text-xl border border-slate-200 shrink-0 uppercase">
                      {selectedUserDetail.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <h2 className="text-xl font-bold text-slate-950">{selectedUserDetail.name}</h2>
                      {selectedUserDetail.flaggedAttention && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
                          <AlertCircle className="w-3 h-3" /> Atenção Necessária
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{selectedUserDetail.email} {selectedUserDetail.phone && `• ${selectedUserDetail.phone}`}</p>
                    <div className="flex gap-2 justify-center sm:justify-start pt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A6340]/10 text-[#5A6340]">
                        Papel: {selectedUserDetail.role || 'Doador'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 font-mono">
                        Cadastrado em {new Date(selectedUserDetail.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* House & Structure details (if applicable) */}
                {(selectedUserDetail.city || selectedUserDetail.housingType || selectedUserDetail.backyard) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estrutura Residencial & Condições</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Cidade / Bairro:</span>
                        <span className="font-bold text-slate-800">
                          {selectedUserDetail.city || 'Não especificado'} {selectedUserDetail.neighborhood && `/ ${selectedUserDetail.neighborhood}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Tipo de Residência:</span>
                        <span className="font-bold text-slate-800">
                          {selectedUserDetail.housingType || 'Não informado'} {selectedUserDetail.tenure && `(${selectedUserDetail.tenure})`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Possui Quintal:</span>
                        <span className="font-bold text-slate-800">{selectedUserDetail.backyard || 'Não especificado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Quintal Fechado (Muros/Cercas):</span>
                        <span className="font-bold text-slate-800">{selectedUserDetail.isWalledOrFenced || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Companion info */}
                <div className="space-y-3 text-xs">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histórico com Animais</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <p><strong>Já teve outros animais?</strong> {selectedUserDetail.hadPets || 'Não informado'}</p>
                    <p><strong>Animais atuais na residência:</strong> {selectedUserDetail.otherAnimalsCount !== undefined ? selectedUserDetail.otherAnimalsCount : 'Não informado'} {selectedUserDetail.otherAnimalsDetails && `(${selectedUserDetail.otherAnimalsDetails})`}</p>
                    {selectedUserDetail.motivation && (
                      <div className="pt-2 border-t border-slate-200">
                        <strong className="block text-slate-500 mb-1">Motivação para adotar:</strong>
                        <p className="text-slate-600 leading-relaxed font-sans">{selectedUserDetail.motivation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Backoffice Custom Tags & Notes */}
                <div className="space-y-3 text-xs">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Painel Administrativo Interno</h4>
                  <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2.5">
                    <div>
                      <span className="text-slate-500 block font-semibold">Observações internas dos admins:</span>
                      <p className="text-slate-700 italic font-sans leading-relaxed mt-0.5 whitespace-pre-wrap">
                        {selectedUserDetail.adminDescription || 'Nenhuma nota interna registrada pelos administradores.'}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 block font-semibold mb-1">Tags cadastradas:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedUserDetail.customTags && selectedUserDetail.customTags.length > 0 ? (
                          selectedUserDetail.customTags.map(tag => (
                            <span key={tag} className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">Nenhuma tag cadastrada.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked pets list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pets Cadastrados por este Usuário</h4>
                  {pets.filter(p => p.donorId === selectedUserDetail.id).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Nenhum pet cadastrado sob a tutela deste usuário.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pets.filter(p => p.donorId === selectedUserDetail.id).map(p => (
                        <div 
                          key={p.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-[#5A6340] cursor-pointer flex items-center gap-3 transition-all"
                          onClick={() => {
                            setSelectedPetDetail(p);
                            setSelectedUserDetail(null);
                          }}
                        >
                          <img
                            src={p.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 hover:scale-105 transition-all duration-200 cursor-pointer"
                          />
                          <div className="overflow-hidden">
                            <span className="font-bold text-slate-800 text-xs block truncate hover:underline">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{p.species} • {p.city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-between">
                <button
                  onClick={() => {
                    toggleExpandUser(selectedUserDetail);
                    setSelectedUserDetail(null);
                    setActiveTab('reports'); // Move to user listing tab
                  }}
                  className="px-4 py-2 bg-[#5A6340] hover:bg-[#4E5637] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Abrir Painel de Gestão do Usuário
                </button>
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Fechar Perfil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
