import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Heart, 
  MapPin, 
  Info, 
  Calendar, 
  Check, 
  ChevronRight, 
  X, 
  XCircle,
  Sparkles,
  Shield, 
  Activity, 
  MessageCircle,
  HelpCircle,
  Upload
} from 'lucide-react';
import { Pet, Candidate, PetSpecies, PetGender, PetSize, DonorUser, TemporaryHome } from '../types';

interface PublicAreaProps {
  pets: Pet[];
  candidates?: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'internalNotes' | 'historyLogs'>) => void;
  currentUser: DonorUser | null;
  onRegisterUser: (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    password?: string;
    role?: 'Doador' | 'Pretendente' | 'Ambos';
    profilePhotoUrl?: string;
  }) => Promise<DonorUser>;
  onLoginUser: (email: string, password?: string) => Promise<DonorUser | null>;
  onLogoutUser: () => void;
  onLoginWithGoogle?: () => Promise<DonorUser | null>;
  onAddPet: (pet: Omit<Pet, 'id' | 'historyEvents' | 'tags'> & { tags?: string[] }) => void;
  onUpdateUserProfile?: (updatedFields: Partial<DonorUser>) => void;
  onRegisterTemporaryHome?: (ltData: Omit<TemporaryHome, 'id' | 'donorId'>) => void;
  temporaryHomes?: TemporaryHome[];
  // Controlled tabs from App header
  activeSubTab?: 'gallery' | 'donor';
  setActiveSubTab?: (tab: 'gallery' | 'donor') => void;
  isAddingPet?: boolean;
  setIsAddingPet?: (val: boolean) => void;
}

export default function PublicArea({ 
  pets, 
  candidates = [],
  onAddCandidate,
  currentUser,
  onRegisterUser,
  onLoginUser,
  onLogoutUser,
  onLoginWithGoogle,
  onAddPet,
  onUpdateUserProfile,
  onRegisterTemporaryHome,
  temporaryHomes = [],
  activeSubTab: propsActiveSubTab,
  setActiveSubTab: propsSetActiveSubTab,
  isAddingPet: propsIsAddingPet,
  setIsAddingPet: propsSetIsAddingPet
}: PublicAreaProps) {
  // Filter States
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState<string>('all');
  const [gender, setGender] = useState<string>('all');
  const [size, setSize] = useState<string>('all');
  const [city, setCity] = useState<string>('all');

  // Sub-Tab State
  const [localSubTab, setLocalSubTab] = useState<'gallery' | 'donor'>('gallery');
  const activeSubTab = propsActiveSubTab !== undefined ? propsActiveSubTab : localSubTab;
  const setActiveSubTab = propsSetActiveSubTab !== undefined ? propsSetActiveSubTab : setLocalSubTab;

  const handleViewPets = () => {
    setActiveSubTab('gallery');
    setIsAddingPet(false);
    setTimeout(() => {
      const el = document.getElementById('pets-list');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Direct Upload Dragging States & Helper
  const [isDraggingAuthPhoto, setIsDraggingAuthPhoto] = useState(false);
  const [isDraggingProfPhoto, setIsDraggingProfPhoto] = useState(false);
  const [isDraggingPetPhoto, setIsDraggingPetPhoto] = useState(false);
  const [isDraggingHousePhoto, setIsDraggingHousePhoto] = useState(false);

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

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // New Pet form states
  const [localIsAddingPet, setLocalIsAddingPet] = useState(false);
  const isAddingPet = propsIsAddingPet !== undefined ? propsIsAddingPet : localIsAddingPet;
  const setIsAddingPet = propsSetIsAddingPet !== undefined ? propsSetIsAddingPet : setLocalIsAddingPet;
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Cachorro' | 'Gato'>('Cachorro');
  const [newPetGender, setNewPetGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetSize, setNewPetSize] = useState<'Pequeno' | 'Médio' | 'Grande'>('Médio');
  const [newPetColor, setNewPetColor] = useState('');
  const [newPetStory, setNewPetStory] = useState('');
  const [newPetTemperament, setNewPetTemperament] = useState('');
  const [newPetCastrated, setNewPetCastrated] = useState(false);
  const [newPetVaccinated, setNewPetVaccinated] = useState(false);
  const [newPetDewormed, setNewPetDewormed] = useState(false);
  const [newPetNeedsTreatment, setNewPetNeedsTreatment] = useState(false);
  const [newPetTreatmentNotes, setNewPetTreatmentNotes] = useState('');
  const [newPetCompatOther, setNewPetCompatOther] = useState<'Sim' | 'Não' | 'Depende'>('Sim');
  const [newPetCompatChildren, setNewPetCompatChildren] = useState<'Sim' | 'Não' | 'Depende'>('Sim');
  const [newPetSpecialNeeds, setNewPetSpecialNeeds] = useState('');
  const [newPetCity, setNewPetCity] = useState('');
  const [newPetPhotoUrl, setNewPetPhotoUrl] = useState('');
  const [newPetPhotos, setNewPetPhotos] = useState<string[]>([]);
  const [tempPetPhotoUrl, setTempPetPhotoUrl] = useState('');
  const [newPetErrors, setNewPetErrors] = useState<string | null>(null);
  const [newPetSuccess, setNewPetSuccess] = useState(false);

  // Auth and profile roles/details states
  const [authRole, setAuthRole] = useState<'Doador' | 'Pretendente' | 'Ambos'>('Doador');
  const [authProfilePhotoUrl, setAuthProfilePhotoUrl] = useState('');
  const [donorActiveSection, setDonorActiveSection] = useState<'pets' | 'profile' | 'temporary_home'>('pets');

  // LT form states
  const [ltVacancies, setLtVacancies] = useState<number>(1);
  const [ltNotes, setLtNotes] = useState('');
  const [ltSuccess, setLtSuccess] = useState(false);

  // Extra Candidate form states (interest application)
  const [formIsWalledOrFenced, setFormIsWalledOrFenced] = useState<string>('Sim, murada');
  const [formHasKennel, setFormHasKennel] = useState<boolean>(false);
  const [formHasCatShelter, setFormHasCatShelter] = useState<boolean>(false);
  const [formOtherInfrastructure, setFormOtherInfrastructure] = useState('');
  const [formHousePhotos, setFormHousePhotos] = useState<string[]>([]);
  const [tempHousePhotoUrl, setTempHousePhotoUrl] = useState('');
  const [formProfilePhotoUrl, setFormProfilePhotoUrl] = useState('');

  // Pretendente Profile Edit Form states
  const [profCity, setProfCity] = useState('');
  const [profNeighborhood, setProfNeighborhood] = useState('');
  const [profHousingType, setProfHousingType] = useState<'Casa' | 'Apartamento'>('Casa');
  const [profBackyard, setProfBackyard] = useState<'Sim' | 'Não'>('Sim');
  const [profTenure, setProfTenure] = useState<'Própria' | 'Alugada'>('Própria');
  const [profHadPets, setProfHadPets] = useState<'Sim' | 'Não'>('Não');
  const [profOtherAnimalsCount, setProfOtherAnimalsCount] = useState<number>(0);
  const [profOtherAnimalsDetails, setProfOtherAnimalsDetails] = useState('');
  const [profMotivation, setProfMotivation] = useState('');
  const [profIsWalledOrFenced, setProfIsWalledOrFenced] = useState<string>('Sim, murada');
  const [profHasKennel, setProfHasKennel] = useState<boolean>(false);
  const [profHasCatShelter, setProfHasCatShelter] = useState<boolean>(false);
  const [profOtherInfrastructure, setProfOtherInfrastructure] = useState('');
  const [profHousePhotos, setProfHousePhotos] = useState<string[]>([]);
  const [tempProfHousePhotoUrl, setTempProfHousePhotoUrl] = useState('');
  const [profProfilePhotoUrl, setProfProfilePhotoUrl] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Modal / Selected Pet State
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form States
  const [formName, setFormName] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formHousingType, setFormHousingType] = useState<'Casa' | 'Apartamento'>('Casa');
  const [formBackyard, setFormBackyard] = useState<'Sim' | 'Não'>('Sim');
  const [formTenure, setFormTenure] = useState<'Própria' | 'Alugada'>('Própria');
  const [formHadPets, setFormHadPets] = useState<'Sim' | 'Não'>('Não');
  const [formOtherAnimalsCount, setFormOtherAnimalsCount] = useState<number>(0);
  const [formOtherAnimalsDetails, setFormOtherAnimalsDetails] = useState('');
  const [formMotivation, setFormMotivation] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formHasChildren, setFormHasChildren] = useState<'Sim' | 'Não'>('Não');
  const [formChildrenAges, setFormChildrenAges] = useState('');
  const [formChildrenPetRelation, setFormChildrenPetRelation] = useState('');
  const [formAgreedToVisits, setFormAgreedToVisits] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  // Sync user profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfCity(currentUser.city || '');
      setProfNeighborhood(currentUser.neighborhood || '');
      setProfHousingType(currentUser.housingType || 'Casa');
      setProfBackyard(currentUser.backyard || 'Sim');
      setProfTenure(currentUser.tenure || 'Própria');
      setProfHadPets(currentUser.hadPets || 'Não');
      setProfOtherAnimalsCount(currentUser.otherAnimalsCount || 0);
      setProfOtherAnimalsDetails(currentUser.otherAnimalsDetails || '');
      setProfMotivation(currentUser.motivation || '');
      setProfIsWalledOrFenced(currentUser.isWalledOrFenced || 'Sim, murada');
      setProfHasKennel(currentUser.hasKennel || false);
      setProfHasCatShelter(currentUser.hasCatShelter || false);
      setProfOtherInfrastructure(currentUser.otherInfrastructure || '');
      setProfHousePhotos(currentUser.housePhotos || []);
      setProfProfilePhotoUrl(currentUser.profilePhotoUrl || '');

      setFormName(currentUser.name || '');
      setFormWhatsapp(currentUser.phone || '');
      setFormCity(currentUser.city || '');
      setFormNeighborhood(currentUser.neighborhood || '');
      setFormHousingType(currentUser.housingType || 'Casa');
      setFormBackyard(currentUser.backyard || 'Sim');
      setFormTenure(currentUser.tenure || 'Própria');
      setFormHadPets(currentUser.hadPets || 'Não');
      setFormOtherAnimalsCount(currentUser.otherAnimalsCount || 0);
      setFormOtherAnimalsDetails(currentUser.otherAnimalsDetails || '');
      setFormMotivation(currentUser.motivation || '');
      setFormIsWalledOrFenced(currentUser.isWalledOrFenced || 'Sim, murada');
      setFormHasKennel(currentUser.hasKennel || false);
      setFormHasCatShelter(currentUser.hasCatShelter || false);
      setFormOtherInfrastructure(currentUser.otherInfrastructure || '');
      setFormHousePhotos(currentUser.housePhotos || []);
      setFormProfilePhotoUrl(currentUser.profilePhotoUrl || '');
    }
  }, [currentUser]);

  // Set default active section based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Pretendente') {
        setDonorActiveSection('profile');
      } else {
        setDonorActiveSection('pets');
      }
    }
  }, [currentUser?.role]);

  // Helper lists
  const availablePets = pets.filter(p => p.status === 'Disponível' || p.status === 'Em análise');
  const cities = Array.from(new Set(pets.map(p => p.city)));

  // Filter Logic
  const filteredPets = availablePets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || 
                          pet.story.toLowerCase().includes(search.toLowerCase()) ||
                          pet.color.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecies = species === 'all' || pet.species === species;
    const matchesGender = gender === 'all' || pet.gender === gender;
    const matchesSize = size === 'all' || pet.size === size;
    const matchesCity = city === 'all' || pet.city === city;
    
    return matchesSearch && matchesSpecies && matchesGender && matchesSize && matchesCity;
  });

  const handleOpenDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setIsApplying(false);
    setSubmitSuccess(false);
  };

  const handleOpenForm = () => {
    setIsApplying(true);
    setSubmitSuccess(false);
    setFormErrors(null);
  };

  const resetForm = () => {
    setFormName('');
    setFormWhatsapp('');
    setFormCity('');
    setFormNeighborhood('');
    setFormHousingType('Casa');
    setFormBackyard('Sim');
    setFormTenure('Própria');
    setFormHadPets('Não');
    setFormOtherAnimalsCount(0);
    setFormOtherAnimalsDetails('');
    setFormMotivation('');
    setFormNotes('');
    setFormHasChildren('Não');
    setFormChildrenAges('');
    setFormChildrenPetRelation('');
    setFormAgreedToVisits(false);
  };

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    if (!formName || !formWhatsapp || !formCity || !formNeighborhood || !formMotivation) {
      setFormErrors('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    // Validate visits and adaptation agreement term
    if (!formAgreedToVisits) {
      setFormErrors('Você precisa aceitar os termos de visitas de averiguação e adaptação para prosseguir.');
      return;
    }

    // Basic whatsapp validation
    const cleanWhatsapp = formWhatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      setFormErrors('Por favor, insira um número de WhatsApp válido.');
      return;
    }

    onAddCandidate({
      petId: selectedPet.id,
      name: formName,
      whatsapp: cleanWhatsapp,
      city: formCity,
      neighborhood: formNeighborhood,
      housingType: formHousingType,
      backyard: formBackyard,
      tenure: formTenure,
      experience: {
        hadPets: formHadPets,
        otherAnimalsCount: formOtherAnimalsCount,
        otherAnimalsDetails: formOtherAnimalsDetails
      },
      motivation: formMotivation,
      notes: formNotes,
      status: 'Interesse recebido',
      tags: [formHousingType, formBackyard === 'Sim' ? 'Com quintal' : 'Sem quintal'],
      isWalledOrFenced: formIsWalledOrFenced,
      hasKennel: formHasKennel,
      hasCatShelter: formHasCatShelter,
      otherInfrastructure: formOtherInfrastructure,
      housePhotos: formHousePhotos,
      profilePhotoUrl: formProfilePhotoUrl,
      hasChildren: formHasChildren,
      childrenAges: formChildrenAges,
      childrenPetRelation: formChildrenPetRelation,
      agreedToVisits: formAgreedToVisits
    });

    setSubmitSuccess(true);
    resetForm();
  };

  const translateAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code.includes('email-already-in-use')) {
      return 'Este e-mail já está cadastrado. Tente fazer login.';
    }
    if (code.includes('weak-password')) {
      return 'A senha deve conter pelo menos 6 caracteres.';
    }
    if (code.includes('invalid-email') || code.includes('invalid-credential')) {
      return 'E-mail ou credenciais inválidas.';
    }
    if (code.includes('user-not-found') || code.includes('wrong-password')) {
      return 'E-mail ou senha incorretos.';
    }
    if (code.includes('popup-closed-by-user')) {
      return 'A janela de autenticação foi fechada antes de concluir o login.';
    }
    return err?.message || 'Ocorreu um erro desconhecido durante o acesso.';
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      if (authMode === 'register') {
        if (!authName || !authEmail || !authPhone) {
          setAuthError('Todos os campos obrigatórios devem ser preenchidos.');
          return;
        }
        await onRegisterUser({
          name: authName,
          email: authEmail,
          phone: authPhone,
          password: authPassword,
          role: authRole,
          profilePhotoUrl: authProfilePhotoUrl
        });
        // Clear
        setAuthName('');
        setAuthEmail('');
        setAuthPhone('');
        setAuthPassword('');
        setAuthProfilePhotoUrl('');
      } else {
        if (!authEmail) {
          setAuthError('Por favor, informe seu e-mail.');
          return;
        }
        const user = await onLoginUser(authEmail, authPassword);
        if (!user) {
          setAuthError('Usuário não encontrado ou senha inválida.');
        } else {
          setAuthEmail('');
          setAuthPassword('');
        }
      }
    } catch (err: any) {
      setAuthError(translateAuthError(err));
    }
  };

  const handleAddNewPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewPetErrors(null);

    if (!newPetName || !newPetAge || !newPetColor || !newPetStory || !newPetCity) {
      setNewPetErrors('Por favor, preencha todos os campos obrigatórios (Nome, Idade, Cor, Cidade e História).');
      return;
    }

    if (!currentUser) {
      setNewPetErrors('Você precisa estar conectado para cadastrar um pet.');
      return;
    }

    // Default photo placeholder if empty
    const defaultPhoto = newPetSpecies === 'Cachorro'
      ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'
      : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600';

    let finalPhotos = [...newPetPhotos];
    if (newPetPhotoUrl.trim() && !finalPhotos.includes(newPetPhotoUrl.trim())) {
      finalPhotos.unshift(newPetPhotoUrl.trim());
    }
    if (finalPhotos.length === 0) {
      finalPhotos.push(defaultPhoto);
    }

    onAddPet({
      name: newPetName,
      species: newPetSpecies,
      gender: newPetGender,
      ageApprox: newPetAge,
      size: newPetSize,
      color: newPetColor,
      story: newPetStory,
      temperament: newPetTemperament || 'Dócil e brincalhão',
      castrated: newPetCastrated,
      vaccinated: newPetVaccinated,
      dewormed: newPetDewormed,
      needsTreatment: newPetNeedsTreatment,
      treatmentNotes: newPetTreatmentNotes,
      compatOtherAnimals: newPetCompatOther,
      compatChildren: newPetCompatChildren,
      specialNeeds: newPetSpecialNeeds,
      city: newPetCity,
      temporaryHomeId: 'none',
      photos: finalPhotos,
      primaryPhotoIndex: 0,
      status: 'Aguardando aprovação',
      donorId: currentUser.id,
      donorInfo: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }
    });

    setNewPetSuccess(true);
    // Reset form fields
    setNewPetName('');
    setNewPetAge('');
    setNewPetColor('');
    setNewPetStory('');
    setNewPetTemperament('');
    setNewPetCastrated(false);
    setNewPetVaccinated(false);
    setNewPetDewormed(false);
    setNewPetNeedsTreatment(false);
    setNewPetTreatmentNotes('');
    setNewPetSpecialNeeds('');
    setNewPetCity('');
    setNewPetPhotoUrl('');
    setNewPetPhotos([]);
    setTempPetPhotoUrl('');
    setIsAddingPet(false);
  };

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onUpdateUserProfile) return;

    onUpdateUserProfile({
      city: profCity,
      neighborhood: profNeighborhood,
      housingType: profHousingType,
      backyard: profBackyard,
      tenure: profTenure,
      hadPets: profHadPets,
      otherAnimalsCount: profOtherAnimalsCount,
      otherAnimalsDetails: profOtherAnimalsDetails,
      motivation: profMotivation,
      isWalledOrFenced: profIsWalledOrFenced,
      hasKennel: profHasKennel,
      hasCatShelter: profHasCatShelter,
      otherInfrastructure: profOtherInfrastructure,
      housePhotos: profHousePhotos,
      profilePhotoUrl: profProfilePhotoUrl
    });

    setProfileSuccessMsg('Seu perfil de pretendente foi atualizado com sucesso!');
    setIsEditingProfile(false);
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  const handleVolunteerLTSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onRegisterTemporaryHome) return;

    onRegisterTemporaryHome({
      name: `Lar Temporário - ${currentUser.name}`,
      contact: currentUser.phone,
      vacancies: ltVacancies,
      notes: ltNotes
    });

    setLtSuccess(true);
    setLtNotes('');
  };

  return (
    <div id="public-area-container" className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Banner Section */}
      <section id="hero-banner" className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 py-16 md:py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-4 relative max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center md:text-left"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Adoção Responsável
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight leading-none mb-6">
              Encontre o seu <span className="text-[#EAE5CD]">novo melhor amigo</span>
            </h1>
            <p className="text-lg text-emerald-100/90 leading-relaxed mb-8">
              O APP adote aqui ajuda animais resgatados a encontrarem famílias cheias de amor. 
              Aqui você confere os animais disponíveis para adoção responsável e preenche 
              seu formulário de interesse de forma simples e organizada.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={handleViewPets}
                className="px-6 py-3 bg-white text-[#5A6340] font-semibold rounded-xl shadow-lg hover:bg-[#F5F2E1] transition-colors flex items-center gap-2 cursor-pointer"
              >
                Ver animais para adoção
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="px-4 py-3 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-sm text-emerald-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-300" /> 100% Organizado e Monitorado
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-Tabs Switch Navigation (Natural Tones design) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-14">
          <div className="flex gap-4">
            <button
              onClick={() => { setActiveSubTab('gallery'); setIsAddingPet(false); }}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'gallery'
                  ? 'border-[#5A6340] text-[#5A6340] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Encontrar Amigo (Galeria)
            </button>
            <button
              onClick={() => setActiveSubTab('donor')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'donor'
                  ? 'border-[#5A6340] text-[#5A6340] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" /> Usuário
            </button>
          </div>
          
          {currentUser && (
            <div className="flex flex-wrap items-center gap-3 text-xs py-1">
              <span className="text-slate-600 font-medium hidden md:inline">
                Olá, <strong>{currentUser.name}</strong>
              </span>
              
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Perfil:</span>
                <select
                  value={currentUser.role || 'Pretendente'}
                  onChange={(e) => {
                    if (onUpdateUserProfile) {
                      onUpdateUserProfile({ role: e.target.value as 'Doador' | 'Pretendente' | 'Ambos' });
                    }
                  }}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#5A6340] text-[11px] font-semibold text-slate-700 cursor-pointer shadow-sm"
                >
                  <option value="Pretendente">Pretendente (Adotante)</option>
                  <option value="Doador">Doador / Protetor</option>
                  <option value="Ambos">Ambos (Doador e Pretendente)</option>
                </select>
              </div>

              <button
                onClick={onLogoutUser}
                className="text-[#D48166] hover:text-[#BD6E55] font-bold underline cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {activeSubTab === 'gallery' ? (
        /* --- GALLERY VIEW --- */
        <div id="pets-list" className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Filtrar Animais</h2>
            <span className="text-xs text-slate-500 font-mono ml-auto">
              {filteredPets.length} {filteredPets.length === 1 ? 'animal disponível' : 'animais disponíveis'}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, história..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Quick Filter Badges / Tag Filters */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-100">
              {/* Espécie */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[70px]">Espécie:</span>
                <button
                  type="button"
                  onClick={() => setSpecies('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    species === 'all' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setSpecies('Cachorro')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    species === 'Cachorro' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cachorro
                </button>
                <button
                  type="button"
                  onClick={() => setSpecies('Gato')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    species === 'Gato' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Gato
                </button>
              </div>

              {/* Sexo */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[70px]">Sexo:</span>
                <button
                  type="button"
                  onClick={() => setGender('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    gender === 'all' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Macho')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    gender === 'Macho' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Macho
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Fêmea')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    gender === 'Fêmea' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Fêmea
                </button>
              </div>

              {/* Porte */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[70px]">Porte:</span>
                <button
                  type="button"
                  onClick={() => setSize('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    size === 'all' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setSize('Pequeno')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    size === 'Pequeno' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pequeno
                </button>
                <button
                  type="button"
                  onClick={() => setSize('Médio')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    size === 'Médio' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Médio
                </button>
                <button
                  type="button"
                  onClick={() => setSize('Grande')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    size === 'Grande' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Grande
                </button>
              </div>

              {/* Cidades */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[70px]">Cidades:</span>
                <button
                  type="button"
                  onClick={() => setCity('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    city === 'all' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas
                </button>
                {cities.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      city === c 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pet Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filteredPets.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPets.map((pet) => {
                const primaryPhoto = pet.photos[pet.primaryPhotoIndex] || pet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400';
                return (
                  <motion.div
                    key={pet.id}
                    layoutId={`pet-card-${pet.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col cursor-pointer"
                    onClick={() => handleOpenDetails(pet)}
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={primaryPhoto} 
                        alt={pet.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase text-white shadow-sm ${
                          pet.species === 'Cachorro' ? 'bg-[#D48166]' : 'bg-[#5A6340]'
                        }`}>
                          {pet.species}
                        </span>
                        {pet.status === 'Em análise' && (
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase bg-amber-500 text-white shadow-sm">
                            Em Análise
                          </span>
                        )}
                      </div>

                      {/* City Badge */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-slate-900/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {pet.city}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight group-hover:text-emerald-600 transition-colors">
                            {pet.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            pet.gender === 'Fêmea' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {pet.gender}
                          </span>
                        </div>

                        {/* Badges bar */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">{pet.ageApprox}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">Porte {pet.size}</span>
                          {pet.castrated && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">Castrado</span>}
                          {pet.vaccinated && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">Vacinado</span>}
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {pet.story}
                        </p>
                      </div>

                      {/* Tags & Action Row */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-1 overflow-hidden max-w-[65%]">
                          {pet.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5 group-hover:underline">
                          Saber mais <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto"
            >
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Nenhum pet encontrado</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                Tente ajustar seus filtros ou termos de pesquisa para ver outros amiguinhos disponíveis!
              </p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSpecies('all');
                  setGender('all');
                  setSize('all');
                  setCity('all');
                }}
                className="mt-5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      ) : (
        /* --- DONOR PORTAL VIEW --- */
        <div id="donor-portal" className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
          {!currentUser ? (
            /* --- NOT LOGGED IN: SIGN IN & SIGN UP --- */
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl">
              <div className="w-12 h-12 bg-[#F5F2E1] text-[#5A6340] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 fill-current" />
              </div>

              <h2 className="text-2xl font-bold text-center text-[#5A6340] tracking-tight font-display">
                {authMode === 'login' ? 'Acessar Sua Conta' : 'Criar Sua Conta'}
              </h2>
              <p className="text-xs text-[#7C6E5D] text-center mt-1.5 leading-relaxed">
                {authMode === 'login' 
                  ? 'Entre com seu e-mail para cadastrar pets, se voluntariar ou preencher seu perfil de pretendente.' 
                  : 'Cadastre-se para doar animais, se candidatar para adoção ou se voluntariar como Lar Temporário.'}
              </p>

              {authError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Eu quero me cadastrar como: *</label>
                      <select
                        value={authRole}
                        onChange={(e) => setAuthRole(e.target.value as any)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                      >
                        <option value="Doador">Doador / Protetor de Animais</option>
                        <option value="Pretendente">Pretendente (Quero Adotar)</option>
                        <option value="Ambos">Ambos (Doar e Adotar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Foto de Perfil (Fazer Upload ou URL)</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingAuthPhoto(true);
                        }}
                        onDragLeave={() => setIsDraggingAuthPhoto(false)}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsDraggingAuthPhoto(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const file = e.dataTransfer.files[0];
                            if (file.type.startsWith('image/')) {
                              try {
                                const base64 = await fileToBase64(file);
                                setAuthProfilePhotoUrl(base64);
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isDraggingAuthPhoto
                            ? 'border-[#5A6340] bg-[#5A6340]/5'
                            : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                        }`}
                        onClick={() => document.getElementById('auth-photo-file-input')?.click()}
                      >
                        <input
                          id="auth-photo-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              try {
                                const base64 = await fileToBase64(file);
                                setAuthProfilePhotoUrl(base64);
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }}
                        />
                        {authProfilePhotoUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={authProfilePhotoUrl}
                              alt="Pré-visualização"
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#5A6340]"
                            />
                            <p className="text-[11px] text-[#5A6340] font-semibold">Imagem selecionada! Clique ou arraste outra para mudar.</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-xs font-semibold text-slate-700">Arraste sua foto aqui ou clique para fazer upload</p>
                              <p className="text-[10px] text-slate-400">Suporta PNG, JPG, JPEG</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={authProfilePhotoUrl.startsWith('data:') ? '' : authProfilePhotoUrl}
                          onChange={(e) => setAuthProfilePhotoUrl(e.target.value)}
                          placeholder="Ou se preferir, cole o link direto da foto aqui"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-xs"
                        />
                      </div>

                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 self-center">Sugestões rápidas:</span>
                        <button
                          type="button"
                          onClick={() => setAuthProfilePhotoUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[9px] text-slate-600 cursor-pointer"
                        >
                          Tutor 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthProfilePhotoUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[9px] text-slate-600 cursor-pointer"
                        >
                          Tutor 2
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthProfilePhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[9px] text-slate-600 cursor-pointer"
                        >
                          Tutor 3
                        </button>
                        {authProfilePhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setAuthProfilePhotoUrl('')}
                            className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[9px] font-semibold ml-auto cursor-pointer"
                          >
                            Limpar Foto
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Endereço de E-mail *</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="nome@exemplo.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp para contato administrativo *</label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="Ex: 11999999999"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#5A6340] hover:bg-[#495033] text-white text-xs font-bold rounded-xl transition-colors shadow-md mt-6 cursor-pointer"
                >
                  {authMode === 'login' ? 'Entrar no Portal' : 'Cadastrar e Conectar'}
                </button>
              </form>

              <div className="relative my-5 flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Ou acesse com</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (onLoginWithGoogle) {
                      try {
                        setAuthError(null);
                        await onLoginWithGoogle();
                      } catch (err: any) {
                        setAuthError(translateAuthError(err));
                      }
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 cursor-pointer bg-white shadow-sm w-full"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                  Conectar com Google
                </button>
              </div>

              <div className="mt-6 text-center text-xs">
                {authMode === 'login' ? (
                  <p className="text-slate-500">
                    Não tem uma conta ainda?{' '}
                    <button
                      onClick={() => { setAuthMode('register'); setAuthError(null); }}
                      className="text-[#5A6340] font-bold underline hover:text-[#495033] cursor-pointer bg-transparent"
                    >
                      Cadastre-se aqui
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Já possui cadastro?{' '}
                    <button
                      onClick={() => { setAuthMode('login'); setAuthError(null); }}
                      className="text-[#5A6340] font-bold underline hover:text-[#495033] cursor-pointer bg-transparent"
                    >
                      Acesse sua conta
                    </button>
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs">
                <button
                  onClick={handleViewPets}
                  className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5 justify-center mx-auto cursor-pointer bg-transparent"
                >
                  &larr; Voltar para Galeria de Animais
                </button>
              </div>
            </div>
          ) : (
            /* --- LOGGED IN: DONOR AREA --- */
            <div className="space-y-8">
              {/* Welcome card */}
              <div className="bg-gradient-to-r from-[#F5F2E1] to-[#EAE5CD] rounded-2xl p-6 border border-[#E0DBC1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {currentUser.profilePhotoUrl && (
                    <img 
                      src={currentUser.profilePhotoUrl} 
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0" 
                    />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] text-[#5A6340] uppercase font-bold tracking-wider">
                        {currentUser.role === 'Ambos' ? 'Portal do Doador e Adotante' : currentUser.role === 'Pretendente' ? 'Portal do Adotante (Pretendente)' : 'Portal do Doador / Protetor'}
                      </span>
                      <span className="text-slate-400 text-[10px] hidden sm:inline">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-medium">Alterar perfil:</span>
                        <select
                          value={currentUser.role || 'Pretendente'}
                          onChange={(e) => {
                            if (onUpdateUserProfile) {
                              onUpdateUserProfile({ role: e.target.value as 'Doador' | 'Pretendente' | 'Ambos' });
                            }
                          }}
                          className="px-1.5 py-0.5 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#5A6340] text-[10px] font-semibold text-slate-700 cursor-pointer shadow-sm"
                        >
                          <option value="Pretendente">Pretendente (Adotante)</option>
                          <option value="Doador">Doador / Protetor</option>
                          <option value="Ambos">Ambos (Doador e Pretendente)</option>
                        </select>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5 font-display">Olá, {currentUser.name}!</h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {currentUser.role === 'Pretendente'
                        ? 'Atualize seu perfil residencial e envie fotos da casa para facilitar a avaliação do APP adote aqui.'
                        : 'Cadastre animais resgatados, gerencie suas solicitações e se candidate como Lar Temporário.'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={handleViewPets}
                    className="px-4 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    🔍 Ver Animais na Galeria
                  </button>
                  {(currentUser.role === 'Doador' || currentUser.role === 'Ambos') && !isAddingPet && (
                    <button
                      onClick={() => { setIsAddingPet(true); setNewPetSuccess(false); setNewPetErrors(null); }}
                      className="px-4 py-2.5 bg-[#D48166] hover:bg-[#BD6E55] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      + Cadastrar Novo Pet
                    </button>
                  )}
                </div>
              </div>

              {/* Portal Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
                {(currentUser.role === 'Doador' || currentUser.role === 'Ambos') && (
                  <button
                    onClick={() => { setDonorActiveSection('pets'); setIsAddingPet(false); }}
                    className={`py-3 px-4 sm:px-6 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      donorActiveSection === 'pets'
                        ? 'border-[#5A6340] text-[#5A6340]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🐾 Meus Pets Cadastrados
                  </button>
                )}
                {(currentUser.role === 'Pretendente' || currentUser.role === 'Ambos') && (
                  <button
                    onClick={() => { setDonorActiveSection('profile'); setIsAddingPet(false); }}
                    className={`py-3 px-4 sm:px-6 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      donorActiveSection === 'profile'
                        ? 'border-[#5A6340] text-[#5A6340]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏡 Perfil de Adotante (Pretendente)
                  </button>
                )}
                {(currentUser.role === 'Doador' || currentUser.role === 'Ambos') && (
                  <button
                    onClick={() => { setDonorActiveSection('temporary_home'); setIsAddingPet(false); }}
                    className={`py-3 px-4 sm:px-6 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      donorActiveSection === 'temporary_home'
                        ? 'border-[#5A6340] text-[#5A6340]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏠 Ser Lar Temporário (LT)
                  </button>
                )}
              </div>

              {donorActiveSection === 'pets' && (
                <>
                  {newPetSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold">Sucesso! Pet cadastrado e enviado para análise.</p>
                    <p className="font-normal text-[11px] text-emerald-600 mt-0.5">O APP adote aqui revisará os dados do animal e o publicará na galeria de adoção em breve.</p>
                  </div>
                </div>
              )}

              {/* Add Pet Form */}
              {isAddingPet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div>
                        <h3 className="text-xl font-bold text-[#5A6340] font-display flex items-center gap-2">
                          <Heart className="w-5 h-5 text-[#D48166] fill-current" /> Cadastrar Novo Animal para Adoção
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">O APP adote aqui revisará os dados do animal para publicação na galeria.</p>
                      </div>
                      <button
                        onClick={() => setIsAddingPet(false)}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="overflow-y-auto p-6 flex-1">
                      {newPetErrors && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                          {newPetErrors}
                        </div>
                      )}

                  <form onSubmit={handleAddNewPetSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Pet *</label>
                        <input
                          type="text"
                          required
                          value={newPetName}
                          onChange={(e) => setNewPetName(e.target.value)}
                          placeholder="Ex: Tufão"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cidade onde o Pet se encontra *</label>
                        <input
                          type="text"
                          required
                          value={newPetCity}
                          onChange={(e) => setNewPetCity(e.target.value)}
                          placeholder="Ex: Sorocaba"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Espécie *</label>
                        <select
                          value={newPetSpecies}
                          onChange={(e) => setNewPetSpecies(e.target.value as 'Cachorro' | 'Gato')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Cachorro">Cachorro</option>
                          <option value="Gato">Gato</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gênero *</label>
                        <select
                          value={newPetGender}
                          onChange={(e) => setNewPetGender(e.target.value as 'Macho' | 'Fêmea')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Macho">Macho</option>
                          <option value="Fêmea">Fêmea</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Porte *</label>
                        <select
                          value={newPetSize}
                          onChange={(e) => setNewPetSize(e.target.value as 'Pequeno' | 'Médio' | 'Grande')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Pequeno">Pequeno</option>
                          <option value="Médio">Médio</option>
                          <option value="Grande">Grande</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Idade Aproximada *</label>
                        <input
                          type="text"
                          required
                          value={newPetAge}
                          onChange={(e) => setNewPetAge(e.target.value)}
                          placeholder="Ex: Filhote (4 meses) ou Adulto (2 anos)"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cor Predominante *</label>
                        <input
                          type="text"
                          required
                          value={newPetColor}
                          onChange={(e) => setNewPetColor(e.target.value)}
                          placeholder="Ex: Preto e Branco"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Fotos do Animal (Fazer Upload ou URL) *</label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingPetPhoto(true);
                          }}
                          onDragLeave={() => setIsDraggingPetPhoto(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDraggingPetPhoto(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const files = Array.from(e.dataTransfer.files) as File[];
                              const newPhotos: string[] = [];
                              for (const file of files) {
                                if (file.type.startsWith('image/')) {
                                  try {
                                    const base64 = await fileToBase64(file);
                                    if (!newPetPhotos.includes(base64)) {
                                      newPhotos.push(base64);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }
                              if (newPhotos.length > 0) {
                                setNewPetPhotos([...newPetPhotos, ...newPhotos]);
                              }
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingPetPhoto
                              ? 'border-[#5A6340] bg-[#5A6340]/5'
                              : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                          }`}
                          onClick={() => document.getElementById('pet-photos-file-input')?.click()}
                        >
                          <input
                            id="pet-photos-file-input"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const files = Array.from(e.target.files) as File[];
                                const newPhotos: string[] = [];
                                for (const file of files) {
                                  try {
                                    const base64 = await fileToBase64(file);
                                    if (!newPetPhotos.includes(base64)) {
                                      newPhotos.push(base64);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                                if (newPhotos.length > 0) {
                                  setNewPetPhotos([...newPetPhotos, ...newPhotos]);
                                }
                              }
                            }}
                          />
                          <Upload className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Arraste fotos do pet aqui ou clique para selecionar</p>
                            <p className="text-[10px] text-slate-400">Você pode selecionar várias fotos de uma vez</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={tempPetPhotoUrl}
                            onChange={(e) => setTempPetPhotoUrl(e.target.value)}
                            placeholder="Ou cole o link de uma imagem externa"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (tempPetPhotoUrl.trim()) {
                                if (!newPetPhotos.includes(tempPetPhotoUrl.trim())) {
                                  setNewPetPhotos([...newPetPhotos, tempPetPhotoUrl.trim()]);
                                }
                                setTempPetPhotoUrl('');
                              }
                            }}
                            className="px-3 py-2 bg-[#5A6340] text-white rounded-xl text-xs font-bold hover:bg-[#495033] cursor-pointer"
                          >
                            Adicionar URL
                          </button>
                        </div>

                        {newPetPhotos.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[11px] font-bold text-slate-500 mb-1">Fotos Selecionadas ({newPetPhotos.length}):</p>
                            <div className="flex gap-2 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-100">
                              {newPetPhotos.map((photo, i) => (
                                <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                                  <img src={photo} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setNewPetPhotos(newPetPhotos.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-2">
                          <input
                            type="text"
                            value={newPetPhotoUrl}
                            onChange={(e) => setNewPetPhotoUrl(e.target.value)}
                            placeholder="Ou digite o link principal aqui (opcional)"
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-xs text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Temperamento / Traços de personalidade</label>
                      <input
                        type="text"
                        value={newPetTemperament}
                        onChange={(e) => setNewPetTemperament(e.target.value)}
                        placeholder="Ex: Muito amigável, brincalhão, um pouco tímido no começo..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">História do Resgate / Descrição do Pet *</label>
                      <textarea
                        required
                        rows={3}
                        value={newPetStory}
                        onChange={(e) => setNewPetStory(e.target.value)}
                        placeholder="Conte como ele foi resgatado, suas manias e por que ele precisa de um lar cheio de carinho..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                    <div className="bg-[#FDFCF0] p-4 rounded-xl border border-[#E0DBC1] grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPetCastrated}
                          onChange={(e) => setNewPetCastrated(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                        />
                        <span className="text-xs font-semibold text-slate-700">Castrado</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPetVaccinated}
                          onChange={(e) => setNewPetVaccinated(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                        />
                        <span className="text-xs font-semibold text-slate-700">Vacinado</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPetDewormed}
                          onChange={(e) => setNewPetDewormed(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                        />
                        <span className="text-xs font-semibold text-slate-700">Vermifugado</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPetNeedsTreatment}
                          onChange={(e) => setNewPetNeedsTreatment(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                        />
                        <span className="text-xs font-semibold text-slate-700">Requer Tratamento</span>
                      </label>
                    </div>

                    {newPetNeedsTreatment && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Notas sobre o Tratamento necessário</label>
                        <input
                          type="text"
                          value={newPetTreatmentNotes}
                          onChange={(e) => setNewPetTreatmentNotes(e.target.value)}
                          placeholder="Ex: Precisa tomar colírio duas vezes ao dia por causa de cirurgia recente..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Compatível com outros Animais?</label>
                        <select
                          value={newPetCompatOther}
                          onChange={(e) => setNewPetCompatOther(e.target.value as 'Sim' | 'Não' | 'Depende')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                          <option value="Depende">Depende da adaptação</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Compatível com Crianças?</label>
                        <select
                          value={newPetCompatChildren}
                          onChange={(e) => setNewPetCompatChildren(e.target.value as 'Sim' | 'Não' | 'Depende')}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                          <option value="Depende">Depende da adaptação</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Necessidades Especiais (Se houver)</label>
                      <input
                        type="text"
                        value={newPetSpecialNeeds}
                        onChange={(e) => setNewPetSpecialNeeds(e.target.value)}
                        placeholder="Ex: Cadeirante, cego de um olho, dieta especial, etc."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 col-span-full sticky bottom-0 bg-white py-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingPet(false)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white font-bold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
                        >
                          Enviar Pet para Análise
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}

              {/* My Pets list */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#5A6340]" /> Meus Animais Divulgados
                </h3>

                {pets.filter(p => p.donorId === currentUser.id).length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-sm text-slate-500">Você ainda não possui pets cadastrados.</p>
                    <button
                      onClick={() => { setIsAddingPet(true); setNewPetSuccess(false); }}
                      className="mt-4 px-4 py-2 bg-[#5A6340] text-white rounded-xl text-xs font-bold hover:bg-[#495033] transition-colors cursor-pointer"
                    >
                      Cadastrar Primeiro Pet
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pets.filter(p => p.donorId === currentUser.id).map(pet => (
                      <div key={pet.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-4 shadow-sm relative overflow-hidden">
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 block truncate">{pet.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pet.status === 'Aguardando aprovação'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : pet.status === 'Disponível'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {pet.status}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{pet.species} &bull; {pet.gender}</span>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic leading-relaxed">
                            "{pet.story}"
                          </p>

                          {/* Friendly Information Box restricting interests */}
                          <div className="mt-3 p-2 bg-[#FDFCF0] rounded-lg border border-[#E0DBC1]/50 text-[10px] text-slate-500 leading-relaxed">
                            🔒 <strong>Privacidade dos Candidatos</strong>: Para garantir a segurança dos interessados, a lista de entrevistas e questionários de interesse é gerenciada exclusivamente pela Administração do APP adote aqui.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

              {donorActiveSection === 'profile' && (
                <div className="space-y-6">
                  {/* Read-Only Profile Summary Dashboard */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F2E1] text-[#5A6340] flex items-center justify-center">
                          <Heart className="w-5 h-5 text-[#5A6340] fill-current" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 font-display">Meu Perfil de Adotante</h3>
                          <p className="text-xs text-slate-500">Dados residenciais e de convivência com animais consultados pelo APP adote aqui.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        ✏️ Editar Perfil de Adotante
                      </button>
                    </div>

                    {profileSuccessMsg && (
                      <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <p>{profileSuccessMsg}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: User Info */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                        <img 
                          src={profProfilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4 bg-slate-200"
                        />
                        <h4 className="text-base font-bold text-slate-900">{currentUser?.name}</h4>
                        <span className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email}</span>
                        <span className="text-xs text-[#5A6340] font-semibold mt-2 px-3 py-1 bg-[#F5F2E1] rounded-full">
                          {currentUser?.phone}
                        </span>
                      </div>

                      {/* Right: Detailed Summary */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Cidade / Bairro</span>
                            <span className="text-sm font-semibold text-slate-700">{profCity || 'Não informada'} - {profNeighborhood || 'Não informado'}</span>
                          </div>
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Tipo de Imóvel</span>
                            <span className="text-sm font-semibold text-slate-700">{profHousingType} ({profTenure})</span>
                          </div>
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Tem Quintal?</span>
                            <span className="text-sm font-semibold text-slate-700">{profBackyard === 'Sim' ? 'Possui quintal' : 'Não possui quintal'}</span>
                          </div>
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-[#D48166] block uppercase">Segurança (Muro/Cerca)</span>
                            <span className="text-sm font-semibold text-slate-700">{profIsWalledOrFenced}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estrutura & Infraestrutura</h5>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${profHasKennel ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {profHasKennel ? '✓ Possui Canil' : '✗ Não possui canil'}
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${profHasCatShelter ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {profHasCatShelter ? '✓ Possui Gatil' : '✗ Não possui gatil'}
                            </span>
                          </div>
                          {profOtherInfrastructure && (
                            <p className="text-xs text-slate-600 mt-1"><strong className="text-slate-500">Outros detalhes:</strong> {profOtherInfrastructure}</p>
                          )}
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-1">
                          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Histórico de Animais</h5>
                          <p className="text-xs text-slate-700">Já possuiu animais antes? <strong className="text-emerald-700">{profHadPets}</strong></p>
                          <p className="text-xs text-slate-700">Quantidade de animais no momento: <strong>{profOtherAnimalsCount}</strong></p>
                          {profOtherAnimalsDetails && (
                            <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">"{profOtherAnimalsDetails}"</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {profMotivation && (
                      <div className="bg-[#FDFCF0] p-4 rounded-xl border border-[#E0DBC1]/50">
                        <span className="text-[10px] font-bold text-[#5A6340] block uppercase tracking-wider mb-1">Motivação para Adoção</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans italic">"{profMotivation}"</p>
                      </div>
                    )}

                    {profHousePhotos.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase mb-2">Fotos da Casa ({profHousePhotos.length})</span>
                        <div className="flex gap-2 flex-wrap">
                          {profHousePhotos.map((photo, i) => (
                            <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Edit Modal Form */}
                  {isEditingProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in duration-200"
                      >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div>
                            <h3 className="text-xl font-bold text-[#5A6340] font-display flex items-center gap-2">
                              <Heart className="w-5 h-5 text-[#D48166] fill-current" /> Editar Perfil de Adotante
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Preencha seus dados residenciais e hábitos com pets para facilitar a aprovação.</p>
                          </div>
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                          <form onSubmit={handleProfileUpdateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto de Perfil (Fazer Upload ou URL)</label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingProfPhoto(true);
                          }}
                          onDragLeave={() => setIsDraggingProfPhoto(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDraggingProfPhoto(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const file = e.dataTransfer.files[0];
                              if (file.type.startsWith('image/')) {
                                try {
                                  const base64 = await fileToBase64(file);
                                  setProfProfilePhotoUrl(base64);
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingProfPhoto
                              ? 'border-[#5A6340] bg-[#5A6340]/5'
                              : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                          }`}
                          onClick={() => document.getElementById('prof-photo-file-input')?.click()}
                        >
                          <input
                            id="prof-photo-file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const file = e.target.files[0];
                                try {
                                  const base64 = await fileToBase64(file);
                                  setProfProfilePhotoUrl(base64);
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                          />
                          {profProfilePhotoUrl ? (
                            <div className="flex flex-col items-center gap-2">
                              <img
                                src={profProfilePhotoUrl}
                                alt="Pré-visualização"
                                className="w-16 h-16 rounded-full object-cover border-2 border-[#5A6340]"
                              />
                              <p className="text-[11px] text-[#5A6340] font-semibold">Imagem selecionada! Clique ou arraste outra para mudar.</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-slate-400" />
                              <div>
                                <p className="text-xs font-semibold text-slate-700">Arraste sua foto aqui ou clique para fazer upload</p>
                                <p className="text-[10px] text-slate-400">Suporta PNG, JPG, JPEG</p>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-2.5">
                          <input
                            type="text"
                            value={profProfilePhotoUrl.startsWith('data:') ? '' : profProfilePhotoUrl}
                            onChange={(e) => setProfProfilePhotoUrl(e.target.value)}
                            placeholder="Ou se preferir, cole o link direto da foto aqui"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cidade *</label>
                          <input
                            type="text"
                            required
                            value={profCity}
                            onChange={(e) => setProfCity(e.target.value)}
                            placeholder="Ex: Sorocaba"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                          <input
                            type="text"
                            required
                            value={profNeighborhood}
                            onChange={(e) => setProfNeighborhood(e.target.value)}
                            placeholder="Ex: Centro"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Residência *</label>
                        <select
                          value={profHousingType}
                          onChange={(e) => setProfHousingType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Casa">Casa</option>
                          <option value="Apartamento">Apartamento</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Possui Quintal? *</label>
                        <select
                          value={profBackyard}
                          onChange={(e) => setProfBackyard(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Posse do Imóvel *</label>
                        <select
                          value={profTenure}
                          onChange={(e) => setProfTenure(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Própria">Própria</option>
                          <option value="Alugada">Alugada</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Quintal é murado ou cercado? *</label>
                        <select
                          value={profIsWalledOrFenced}
                          onChange={(e) => setProfIsWalledOrFenced(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Sim, murada">Sim, murada</option>
                          <option value="Sim, cercada">Sim, cercada</option>
                          <option value="Não, aberto">Não, aberto</option>
                          <option value="Não se aplica">Não se aplica (Apartamento, etc.)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={profHasKennel}
                            onChange={(e) => setProfHasKennel(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                          />
                          <span className="text-xs font-semibold text-slate-700">Possui Canil</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={profHasCatShelter}
                            onChange={(e) => setProfHasCatShelter(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-[#5A6340] focus:ring-[#5A6340]"
                          />
                          <span className="text-xs font-semibold text-slate-700">Possui Gatil</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Outras infraestruturas relevantes</label>
                      <input
                        type="text"
                        value={profOtherInfrastructure}
                        onChange={(e) => setProfOtherInfrastructure(e.target.value)}
                        placeholder="Ex: Portões eletrônicos duplos, rede de proteção em todas as janelas..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Já possui ou teve outros animais? *</label>
                        <select
                          value={profHadPets}
                          onChange={(e) => setProfHadPets(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm bg-white"
                        >
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </div>

                      {profHadPets === 'Sim' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Quantos atualmente? *</label>
                          <input
                            type="number"
                            min="0"
                            value={profOtherAnimalsCount}
                            onChange={(e) => setProfOtherAnimalsCount(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {profHadPets === 'Sim' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Detalhes dos outros animais (Idade, vacinas, temperamento)</label>
                        <textarea
                          value={profOtherAnimalsDetails}
                          onChange={(e) => setProfOtherAnimalsDetails(e.target.value)}
                          placeholder="Fale um pouco sobre seus animais atuais..."
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fotos da sua Casa (Opcional - Ajuda na triagem do APP adote aqui)</label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingHousePhoto(true);
                        }}
                        onDragLeave={() => setIsDraggingHousePhoto(false)}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsDraggingHousePhoto(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const files = Array.from(e.dataTransfer.files) as File[];
                            const newPhotos: string[] = [];
                            for (const file of files) {
                              if (file.type.startsWith('image/')) {
                                try {
                                  const base64 = await fileToBase64(file);
                                  if (!profHousePhotos.includes(base64)) {
                                    newPhotos.push(base64);
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }
                            if (newPhotos.length > 0) {
                              setProfHousePhotos([...profHousePhotos, ...newPhotos]);
                            }
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isDraggingHousePhoto
                            ? 'border-[#5A6340] bg-[#5A6340]/5'
                            : 'border-slate-200 hover:border-[#5A6340]/50 bg-slate-50 hover:bg-slate-50/50'
                        }`}
                        onClick={() => document.getElementById('prof-house-photos-file-input')?.click()}
                      >
                        <input
                          id="prof-house-photos-file-input"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const files = Array.from(e.target.files) as File[];
                              const newPhotos: string[] = [];
                              for (const file of files) {
                                try {
                                  const base64 = await fileToBase64(file);
                                  if (!profHousePhotos.includes(base64)) {
                                    newPhotos.push(base64);
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                              if (newPhotos.length > 0) {
                                setProfHousePhotos([...profHousePhotos, ...newPhotos]);
                              }
                            }
                          }}
                        />
                        <Upload className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Arraste fotos do seu espaço/casa aqui ou clique para selecionar</p>
                          <p className="text-[10px] text-slate-400">Ajuda a comprovar a segurança das cercas, muros ou redes</p>
                        </div>
                      </div>

                      {profHousePhotos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[11px] font-bold text-slate-500 mb-1">Fotos da Casa Selecionadas ({profHousePhotos.length}):</p>
                          <div className="flex gap-2 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-100">
                            {profHousePhotos.map((photo, i) => (
                              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProfHousePhotos(profHousePhotos.filter((_, idx) => idx !== i))}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Motivação para Adoção *</label>
                      <textarea
                        required
                        value={profMotivation}
                        onChange={(e) => setProfMotivation(e.target.value)}
                        placeholder="Nos conte brevemente por que gostaria de adotar e como planeja a rotina e os cuidados com o pet..."
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                      />
                    </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2 col-span-full">
                              <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white font-bold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
                              >
                                Salvar Perfil de Adotante
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

              {donorActiveSection === 'temporary_home' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#5A6340]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">Seja um Lar Temporário (LT)</h3>
                      <p className="text-xs text-slate-500">Se voluntarie para acolher animais temporariamente enquanto eles esperam por adoção.</p>
                    </div>
                  </div>

                  {ltSuccess ? (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-900">Inscrição de LT Concluída!</h4>
                      <p className="text-xs text-emerald-700 max-w-md mx-auto">
                        Parabéns! Sua candidatura para ser Lar Temporário foi registrada com sucesso. O APP adote aqui entrará em contato em breve para conversar sobre os detalhes.
                      </p>
                      <button
                        onClick={() => setLtSuccess(false)}
                        className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-[#495033] transition-colors cursor-pointer"
                      >
                        Nova Candidatura / Atualizar Vagas
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleVolunteerLTSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Vagas Disponíveis (Número de Animais) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={ltVacancies}
                            onChange={(e) => setLtVacancies(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Notas, preferências de animais ou infraestrutura de apoio *</label>
                        <textarea
                          required
                          value={ltNotes}
                          onChange={(e) => setLtNotes(e.target.value)}
                          placeholder="Ex: Consigo abrigar cães filhotes ou de porte pequeno. Tenho quintal fechado..."
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6340]/20 text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white font-bold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
                        >
                          Candidatar-se como Lar Temporário
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-12 mt-24">
        <div className="container mx-auto px-4 max-w-6xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2 text-white font-sans text-lg font-bold">
              <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              Gestão de Adoção de Pets
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Um sistema para apoiar o valioso trabalho de resgate, reabilitação e adoção de animais do APP adote aqui.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            &copy; 2026 Sistema de Gestão de Adoção. Desenvolvido para facilitar o bem-estar animal.
          </div>
        </div>
      </footer>

      {/* PET DETAIL AND FORM MODAL OVERLAYS */}
      <AnimatePresence mode="wait">
        {selectedPet && !isApplying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              key="pet-details-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header inside modal */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedPet(null)}
                  className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white hover:scale-105 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto flex-1">
                {/* --- PET PROFILE DETAIL VIEW --- */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Visual Media Column (5/12 cols) */}
                    <div className="md:col-span-5 bg-slate-900 flex flex-col justify-between">
                      <div className="relative aspect-[4/3] md:aspect-square w-full">
                        <img 
                          src={selectedPet.photos[selectedPet.primaryPhotoIndex] || selectedPet.photos[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'} 
                          alt={selectedPet.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-1.5">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600/90 shadow-md">
                            {selectedPet.species}
                          </span>
                        </div>
                      </div>

                      {/* Photo Thumbnail Gallery */}
                      {selectedPet.photos.length > 1 && (
                        <div className="p-4 grid grid-cols-4 gap-2 bg-slate-950">
                          {selectedPet.photos.map((ph, idx) => (
                            <div 
                              key={idx} 
                              className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                                selectedPet.primaryPhotoIndex === idx ? 'border-emerald-500' : 'border-transparent opacity-60'
                              }`}
                            >
                              <img src={ph} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Health Quick Grid & Info */}
                      <div className="p-6 text-white border-t border-slate-800 bg-slate-950">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Status de Saúde</h4>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className={`p-2 rounded-xl ${selectedPet.castrated ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            <div className="font-semibold">{selectedPet.castrated ? 'Sim' : 'Não'}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Castrado</div>
                          </div>
                          <div className={`p-2 rounded-xl ${selectedPet.vaccinated ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            <div className="font-semibold">{selectedPet.vaccinated ? 'Sim' : 'Não'}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Vacinado</div>
                          </div>
                          <div className={`p-2 rounded-xl ${selectedPet.dewormed ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            <div className="font-semibold">{selectedPet.dewormed ? 'Sim' : 'Não'}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Vermifugado</div>
                          </div>
                        </div>

                        {selectedPet.specialNeeds && (
                          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                            <span className="font-bold block mb-1">Necessidades Especiais:</span>
                            {selectedPet.specialNeeds}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Profile Column (7/12 cols) */}
                    <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Name & Gender */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <div>
                            <h2 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">
                              {selectedPet.name}
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              Resgatado em {selectedPet.city}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            selectedPet.gender === 'Fêmea' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedPet.gender}
                          </span>
                        </div>

                        {/* Badges Info Panel */}
                        <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 block font-medium">Idade aproximada</span>
                            <span className="font-bold text-slate-800">{selectedPet.ageApprox}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Porte</span>
                            <span className="font-bold text-slate-800">{selectedPet.size}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Cor da Pelagem</span>
                            <span className="font-bold text-slate-800">{selectedPet.color}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Compatível com Crianças</span>
                            <span className="font-bold text-slate-800">{selectedPet.compatChildren}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Compatível com outros Animais</span>
                            <span className="font-bold text-slate-800">{selectedPet.compatOtherAnimals}</span>
                          </div>
                        </div>

                        {/* Story / History of animal */}
                        <div className="mb-6">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Sua História</h3>
                          <p className="text-sm text-slate-600 leading-relaxed font-sans">
                            {selectedPet.story}
                          </p>
                        </div>

                        {/* Temperament */}
                        <div className="mb-6">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Temperamento</h3>
                          <p className="text-sm text-slate-600 leading-relaxed font-sans bg-emerald-50/50 p-3 rounded-lg border border-emerald-500/10 text-emerald-950">
                            {selectedPet.temperament}
                          </p>
                        </div>

                        {/* Vaccine dates if available */}
                        {selectedPet.vaccinated && selectedPet.vaccineDates && Object.keys(selectedPet.vaccineDates).length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Activity className="w-4 h-4 text-emerald-600" /> Registro de Vacinas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(selectedPet.vaccineDates).map(([vac, dt]) => (
                                <div key={vac} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-100 p-2 rounded-lg">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="font-medium text-slate-700">{vac}</span>
                                  <span className="text-slate-400 font-mono ml-auto">{dt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions Bar */}
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 mt-8">
                        <button
                          onClick={() => setSelectedPet(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleOpenForm}
                          className="flex-1 px-6 py-2.5 bg-[#5A6340] hover:bg-[#495033] text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                          <Heart className="w-4 h-4 fill-white" />
                          Tenho Interesse em Adotar
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
        )}

        {selectedPet && isApplying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              key="adoption-form-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header inside form modal */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-display">
                    <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500 animate-pulse" />
                    Quero Adotar: <span className="text-[#5A6340] font-sans">{selectedPet.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Preencha o formulário de interesse para iniciar a entrevista de adoção.</p>
                </div>
                <button
                  onClick={() => { setSelectedPet(null); setIsApplying(false); }}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 md:p-8">
                {/* Back button and title */}
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                  <button 
                    onClick={() => setIsApplying(false)} 
                    className="text-xs text-[#5A6340] hover:text-[#495033] font-bold flex items-center gap-1 transition-all hover:translate-x-[-2px]"
                  >
                    &larr; Voltar para detalhes do pet
                  </button>
                </div>

                    {submitSuccess ? (
                      /* Success State */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 px-4 max-w-md mx-auto"
                      >
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Interesse Registrado!</h3>
                        <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                          Obrigado, <strong>{formName}</strong>! Suas respostas foram salvas com sucesso no painel do APP adote aqui. 
                        </p>
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          O APP adote aqui revisará suas condições de moradia e histórico para garantir o melhor par com <strong>{selectedPet.name}</strong>, e entrará em contato via WhatsApp <strong>{formWhatsapp}</strong> em breve.
                        </p>
                        <button
                          onClick={() => setSelectedPet(null)}
                          className="mt-8 w-full px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors"
                        >
                          Fechar Visualização
                        </button>
                      </motion.div>
                    ) : (
                      /* Form content */
                      <form onSubmit={handleSubmitInterest} className="space-y-6">
                        
                        {formErrors && (
                          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                            {formErrors}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Col 1: Dados Pessoais */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Seus Dados Pessoais</h4>
                            
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo *</label>
                              <input 
                                type="text"
                                required
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Ex: Amanda Souza"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp (DDD + Número) *</label>
                              <input 
                                type="text"
                                required
                                value={formWhatsapp}
                                onChange={(e) => setFormWhatsapp(e.target.value)}
                                placeholder="Ex: 19987654321"
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                              />
                              <span className="text-[10px] text-slate-400">Insira apenas números com DDD. Usado para o contato do APP adote aqui.</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Cidade *</label>
                                <input 
                                  type="text"
                                  required
                                  value={formCity}
                                  onChange={(e) => setFormCity(e.target.value)}
                                  placeholder="Ex: Campinas"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                                <input 
                                  type="text"
                                  required
                                  value={formNeighborhood}
                                  onChange={(e) => setFormNeighborhood(e.target.value)}
                                  placeholder="Ex: Cambuí"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Col 2: Moradia & Espaço */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Estrutura de Moradia</h4>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Lar</label>
                                <select
                                  value={formHousingType}
                                  onChange={(e) => setFormHousingType(e.target.value as any)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                  <option value="Casa">Casa</option>
                                  <option value="Apartamento">Apartamento</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Possui Quintal?</label>
                                <select
                                  value={formBackyard}
                                  onChange={(e) => setFormBackyard(e.target.value as any)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                  <option value="Sim">Sim</option>
                                  <option value="Não">Não</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Posse do Imóvel</label>
                                <select
                                  value={formTenure}
                                  onChange={(e) => setFormTenure(e.target.value as any)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                  <option value="Própria">Própria</option>
                                  <option value="Alugada">Alugada</option>
                                </select>
                              </div>
                            </div>

                            {/* Optional House Photos Upload for Candidate Application */}
                            <div className="mt-3">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">Fotos da sua Casa (Opcional - Ajuda na triagem)</label>
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDraggingHousePhoto(true);
                                }}
                                onDragLeave={() => setIsDraggingHousePhoto(false)}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  setIsDraggingHousePhoto(false);
                                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                    const files = Array.from(e.dataTransfer.files) as File[];
                                    const newPhotos: string[] = [];
                                    for (const file of files) {
                                      if (file.type.startsWith('image/')) {
                                        try {
                                          const base64 = await fileToBase64(file);
                                          if (!formHousePhotos.includes(base64)) {
                                            newPhotos.push(base64);
                                          }
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }
                                    }
                                    if (newPhotos.length > 0) {
                                      setFormHousePhotos([...formHousePhotos, ...newPhotos]);
                                    }
                                  }
                                }}
                                className={`border border-dashed rounded-xl p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                  isDraggingHousePhoto
                                    ? 'border-[#5A6340] bg-[#5A6340]/5'
                                    : 'border-slate-200 hover:border-[#5A6340]/40 bg-slate-50'
                                }`}
                                onClick={() => document.getElementById('form-house-photos-file-input')?.click()}
                              >
                                <input
                                  id="form-house-photos-file-input"
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      const files = Array.from(e.target.files) as File[];
                                      const newPhotos: string[] = [];
                                      for (const file of files) {
                                        try {
                                          const base64 = await fileToBase64(file);
                                          if (!formHousePhotos.includes(base64)) {
                                            newPhotos.push(base64);
                                          }
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }
                                      if (newPhotos.length > 0) {
                                        setFormHousePhotos([...formHousePhotos, ...newPhotos]);
                                      }
                                    }
                                  }}
                                />
                                <Upload className="w-4 h-4 text-slate-400" />
                                <p className="text-[10px] font-semibold text-slate-600">Arraste fotos do seu espaço ou clique para selecionar</p>
                              </div>

                              {formHousePhotos.length > 0 && (
                                <div className="mt-2 flex gap-1 flex-wrap bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                  {formHousePhotos.map((photo, i) => (
                                    <div key={i} className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 group">
                                      <img src={photo} alt="" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => setFormHousePhotos(formHousePhotos.filter((_, idx) => idx !== i))}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] font-bold cursor-pointer"
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">3. Histórico e Experiência</h4>
                            
                            <div className="grid grid-cols-3 gap-2 items-end">
                              <div className="col-span-2">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Já teve ou possui pets?</label>
                                <select
                                  value={formHadPets}
                                  onChange={(e) => setFormHadPets(e.target.value as any)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none"
                                >
                                  <option value="Sim">Sim, atualmente ou no passado</option>
                                  <option value="Não">Não, sou tutor de primeira viagem</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantos atuais?</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={formOtherAnimalsCount}
                                  onChange={(e) => setFormOtherAnimalsCount(parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            {formHadPets === 'Sim' && (
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Detalhes dos outros animais (Idade, raça, temperamento)</label>
                                <textarea
                                  value={formOtherAnimalsDetails}
                                  onChange={(e) => setFormOtherAnimalsDetails(e.target.value)}
                                  placeholder="Ex: Tenho uma cachorra de 5 anos de porte médio, super dócil..."
                                  rows={2}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:bg-white"
                                />
                              </div>
                            )}

                            {/* Children in household info */}
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">3.1. Crianças na Residência</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Há crianças morando ou frequentando a residência? *</label>
                                <select
                                  value={formHasChildren}
                                  onChange={(e) => setFormHasChildren(e.target.value as any)}
                                  className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:bg-white"
                                >
                                  <option value="Não">Não moram e não frequentam crianças</option>
                                  <option value="Sim">Sim, moram ou frequentam regularmente</option>
                                </select>
                              </div>

                              {formHasChildren === 'Sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Idades das Crianças *</label>
                                    <input
                                      type="text"
                                      required={formHasChildren === 'Sim'}
                                      value={formChildrenAges}
                                      onChange={(e) => setFormChildrenAges(e.target.value)}
                                      placeholder="Ex: 4 anos e 8 anos"
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Como se relacionam com pets? *</label>
                                    <input
                                      type="text"
                                      required={formHasChildren === 'Sim'}
                                      value={formChildrenPetRelation}
                                      onChange={(e) => setFormChildrenPetRelation(e.target.value)}
                                      placeholder="Ex: Super calmos, já convivem bem com cães"
                                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:bg-white"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Motivations */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Motivação e Ajustes</h4>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Por que deseja adotar o(a) {selectedPet.name}? *</label>
                            <textarea
                              required
                              value={formMotivation}
                              onChange={(e) => setFormMotivation(e.target.value)}
                              placeholder="Fale um pouco sobre por que escolheu este animal e como será a rotina dele na sua casa..."
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Outras observações importantes para o APP adote aqui saber</label>
                            <textarea
                              value={formNotes}
                              onChange={(e) => setFormNotes(e.target.value)}
                              placeholder="Se houver alguma informação adicional relevante, escreva aqui..."
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>

                          {/* Consent term for home visits and pet adaptation */}
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 mt-4">
                            <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Shield className="w-4 h-4 text-amber-600" /> Consentimento de Visitas de Averiguação e Adaptação
                            </h5>
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                              Ao prosseguir, você declara estar ciente e consentir com a possibilidade de 
                              <strong> visitas de averiguação </strong> ao local indicado para a permanência do pet, 
                              para certificar as condições de segurança fornecidas neste formulário. 
                              Além disso, concorda em receber acompanhamento posterior para a 
                              <strong> adaptação do pet </strong> caso a adoção seja aprovada.
                            </p>
                            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                              <input
                                type="checkbox"
                                required
                                checked={formAgreedToVisits}
                                onChange={(e) => setFormAgreedToVisits(e.target.checked)}
                                className="mt-0.5 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                              />
                              <span className="text-[11px] text-amber-950 font-bold leading-tight">
                                Declaro que li e concordo com o termo de visitas de averiguação e de adaptação do pet. *
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setIsApplying(false)}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors text-center"
                          >
                            Enviar Formulário de Interesse
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              </div>
        )}
      </AnimatePresence>

    </div>
  );
}
