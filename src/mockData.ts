import { Pet, Candidate, TemporaryHome, FollowUp, DonorUser } from './types';

export const INITIAL_TEMPORARY_HOMES: TemporaryHome[] = [
  {
    id: 'lt-1',
    name: 'Lar Temporário da Márcia',
    contact: '(11) 98765-4321',
    vacancies: 4,
    notes: 'Espaço com quintal grande. Aceita cães e gatos. Preferência por filhotes.'
  },
  {
    id: 'lt-2',
    name: 'LT do Seu Cláudio',
    contact: '(11) 99888-7766',
    vacancies: 2,
    notes: 'Apartamento telado. Apenas gatos. Muito experiente com socialização.'
  },
  {
    id: 'lt-3',
    name: 'Lar da Patrícia (Protetora)',
    contact: '(11) 91234-5678',
    vacancies: 3,
    notes: 'Chácara segura. Ideal para animais de grande porte ou reabilitação.'
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Pipoca',
    species: 'Cachorro',
    gender: 'Macho',
    ageApprox: 'Filhote (4 meses)',
    size: 'Pequeno',
    color: 'Caramelo e Branco',
    story: 'Pipoca foi encontrado abandonado perto de uma feira livre em uma caixa de papelão com seus três irmãos. Seus irmãos já foram adotados, e agora ele espera por uma família amorosa.',
    temperament: 'Extremamente brincalhão, ativo, se dá muito bem com outros cães e adora crianças. Um pouco ansioso ao ficar sozinho.',
    castrated: true,
    castrationDate: '2026-05-10',
    vaccinated: true,
    vaccineDates: {
      'V10 - 1ª Dose': '2026-04-15',
      'V10 - 2ª Dose': '2026-05-15',
      'Anti-rábica': '2026-06-01'
    },
    dewormed: true,
    needsTreatment: false,
    compatOtherAnimals: 'Sim',
    compatChildren: 'Sim',
    specialNeeds: '',
    city: 'Campinas',
    temporaryHomeId: 'lt-1',
    photos: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1537151608828-ea2b117b6281?auto=format&fit=crop&q=80&w=600'
    ],
    primaryPhotoIndex: 0,
    status: 'Disponível',
    tags: ['Filhote', 'Brincalhão', 'Caramelo', 'LT da Márcia'],
    historyEvents: [
      {
        id: 'evt-1',
        date: '2026-04-02',
        event: 'Resgate',
        notes: 'Resgatado em Campinas próximo à feira da Vila Mimosa. Estava com pulgas e vermes.'
      },
      {
        id: 'evt-2',
        date: '2026-05-10',
        event: 'Castração',
        notes: 'Castrado na clínica conveniada VetAmor. Recuperação excelente.'
      }
    ]
  },
  {
    id: 'pet-2',
    name: 'Mel',
    species: 'Gato',
    gender: 'Fêmea',
    ageApprox: 'Adulto (2 anos)',
    size: 'Médio',
    color: 'Escama de Tartaruga (Escaminha)',
    story: 'Mel vivia no telhado de uma escola. Ela era alimentada pelos funcionários, mas corria riscos devido à movimentação e cachorros de rua. Foi resgatada para ganhar um lar seguro.',
    temperament: 'Muito dócil, tranquila e silenciosa. Gosta de carinho na cabeça e de dormir em locais altos. Um pouco tímida com estranhos no início.',
    castrated: true,
    castrationDate: '2025-11-15',
    vaccinated: true,
    vaccineDates: {
      'Quádrupla Felina': '2025-12-01',
      'Anti-rábica': '2025-12-22'
    },
    dewormed: true,
    needsTreatment: false,
    compatOtherAnimals: 'Sim',
    compatChildren: 'Sim',
    specialNeeds: '',
    city: 'Valinhos',
    temporaryHomeId: 'lt-2',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513360309081-36f5e878fc11?auto=format&fit=crop&q=80&w=600'
    ],
    primaryPhotoIndex: 0,
    status: 'Disponível',
    tags: ['Calma', 'Castrada', 'Dócil'],
    historyEvents: [
      {
        id: 'evt-3',
        date: '2025-10-30',
        event: 'Resgate',
        notes: 'Resgatada da Escola Estadual de Valinhos. Estava saudável mas precisava de vermifugação.'
      }
    ]
  },
  {
    id: 'pet-3',
    name: 'Banzé',
    species: 'Cachorro',
    gender: 'Macho',
    ageApprox: 'Adulto (5 anos)',
    size: 'Grande',
    color: 'Preto e Branco',
    story: 'Banzé foi atropelado em uma avenida movimentada. Sofreu uma fratura na pata traseira esquerda que precisou de cirurgia. Graças aos protetores, ele se recuperou plenamente, mas possui uma leve claudicação que não o impede de correr e ser feliz!',
    temperament: 'Muito leal, companheiro e protetor. Tem energia média. Se dá melhor como cão único, pois tem ciúmes de comida com outros machos.',
    castrated: true,
    castrationDate: '2026-01-20',
    vaccinated: true,
    vaccineDates: {
      'V10 - Anual': '2026-02-15',
      'Anti-rábica': '2026-02-15'
    },
    dewormed: true,
    needsTreatment: true,
    treatmentNotes: 'Necessita de suplementação de condroprotetor diário devido à antiga cirurgia na pata.',
    compatOtherAnimals: 'Não',
    compatChildren: 'Sim',
    specialNeeds: 'Leve manqueira na pata traseira. Exige condroprotetores.',
    city: 'Campinas',
    temporaryHomeId: 'lt-3',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600'
    ],
    primaryPhotoIndex: 0,
    status: 'Em análise',
    tags: ['Especial', 'Porte Grande', 'Leal', 'Necessita Condroprotetor'],
    historyEvents: [
      {
        id: 'evt-4',
        date: '2025-12-15',
        event: 'Resgate e Atropelamento',
        notes: 'Resgatado após atropelamento na Av. das Amoreiras. Levado às pressas ao pronto-socorro veterinário.'
      },
      {
        id: 'evt-5',
        date: '2025-12-18',
        event: 'Cirurgia Ortopédica',
        notes: 'Cirurgia de osteossíntese com colocação de placa e parafusos na pata traseira.'
      }
    ]
  },
  {
    id: 'pet-4',
    name: 'Luna',
    species: 'Gato',
    gender: 'Fêmea',
    ageApprox: 'Filhote (5 meses)',
    size: 'Pequeno',
    color: 'Branco e Cinza',
    story: 'Luna e sua ninhada nasceram em um motor de caminhão. Foram resgatados a tempo antes do veículo dar partida. Luna é a última de seus irmãos aguardando adoção.',
    temperament: 'Curiosa, esperta e ronronenta. Adora brinquedos com peninhas e bolinhas de papel.',
    castrated: true,
    castrationDate: '2026-05-20',
    vaccinated: true,
    vaccineDates: {
      'Quádrupla - 1ª dose': '2026-04-10',
      'Quádrupla - 2ª dose': '2026-05-10'
    },
    dewormed: true,
    needsTreatment: false,
    compatOtherAnimals: 'Sim',
    compatChildren: 'Sim',
    specialNeeds: '',
    city: 'Campinas',
    temporaryHomeId: 'none',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600'
    ],
    primaryPhotoIndex: 0,
    status: 'Adotado',
    tags: ['Filhote', 'Super Dócil', 'Adotada'],
    historyEvents: [
      {
        id: 'evt-6',
        date: '2026-03-15',
        event: 'Resgate do Motor de Caminhão',
        notes: 'Resgatada com muito cuidado da garagem de ônibus de Campinas.'
      }
    ]
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    petId: 'pet-1', // Pipoca
    name: 'Amanda Souza de Oliveira',
    whatsapp: '19982345678',
    city: 'Campinas',
    neighborhood: 'Taquaral',
    housingType: 'Casa',
    backyard: 'Sim',
    tenure: 'Própria',
    experience: {
      hadPets: 'Sim',
      otherAnimalsCount: 1,
      otherAnimalsDetails: 'Tem um cão Golden Retriever de 3 anos, muito dócil.'
    },
    motivation: 'Quero um companheiro para o meu cachorro atual e temos bastante espaço no quintal. Amamos animais e sempre adotamos.',
    notes: 'Amanda se mostrou extremamente carinhosa na mensagem inicial. Disse que o Golden dela sente falta de companhia.',
    status: 'Contato realizado',
    tags: ['Casa com quintal', 'Possui cão dócil', 'Ótimo perfil'],
    createdAt: '2026-06-15T14:30:00Z',
    internalNotes: [
      {
        id: 'inote-1',
        date: '2026-06-16',
        text: 'Mandei mensagem no WhatsApp. Amanda respondeu prontamente, confirmando que o quintal é totalmente murado e seguro.',
        author: 'APP adote aqui'
      },
      {
        id: 'inote-2',
        date: '2026-06-18',
        text: 'Agendamos uma entrevista virtual para o dia 25/06.',
        author: 'APP adote aqui'
      }
    ],
    historyLogs: [
      {
        id: 'hlog-1',
        date: '2026-06-15',
        action: 'Interesse cadastrado pelo site'
      },
      {
        id: 'hlog-2',
        date: '2026-06-16',
        action: 'Status alterado de "Interesse recebido" para "Contato realizado"'
      }
    ]
  },
  {
    id: 'cand-2',
    petId: 'pet-2', // Mel
    name: 'Juliana Ribeiro',
    whatsapp: '19971223344',
    city: 'Valinhos',
    neighborhood: 'Centro',
    housingType: 'Apartamento',
    backyard: 'Não',
    tenure: 'Alugada',
    experience: {
      hadPets: 'Sim',
      otherAnimalsCount: 0,
      otherAnimalsDetails: 'Já teve uma gata que faleceu de velhice aos 15 anos.'
    },
    motivation: 'Moro sozinha e sinto muita falta da companhia de um felino em casa. O apartamento é calmo e perfeito para a gata Mel.',
    notes: 'Seu apartamento é no 3º andar. Preciso confirmar se possui telas de proteção nas janelas.',
    status: 'Interesse recebido',
    tags: ['Apartamento', 'Sem animais atuais'],
    createdAt: '2026-06-22T09:15:00Z',
    internalNotes: [],
    historyLogs: [
      {
        id: 'hlog-3',
        date: '2026-06-22',
        action: 'Interesse cadastrado pelo site'
      }
    ]
  },
  {
    id: 'cand-3',
    petId: 'pet-4', // Luna
    name: 'Carlos Henrique Mendes',
    whatsapp: '19988112233',
    city: 'Campinas',
    neighborhood: 'Cambuí',
    housingType: 'Apartamento',
    backyard: 'Não',
    tenure: 'Própria',
    experience: {
      hadPets: 'Sim',
      otherAnimalsCount: 0,
      otherAnimalsDetails: 'Nenhum animal no momento.'
    },
    motivation: 'Sempre tive animais na infância. Agora que estou morando no meu próprio apartamento telado, quero dar um lar para um gatinho resgatado.',
    notes: 'Excelente adotante. Enviou fotos das janelas teladas antes mesmo de pedirmos.',
    status: 'Adotado',
    tags: ['Aprovado rápido', 'Janelas teladas', 'Cambuí'],
    createdAt: '2026-05-10T10:00:00Z',
    internalNotes: [
      {
        id: 'inote-3',
        date: '2026-05-11',
        text: 'Entrevista realizada por vídeo. Carlos é extremamente responsável e já comprou ração super premium, arranhadores e brinquedos.',
        author: 'APP adote aqui'
      },
      {
        id: 'inote-4',
        date: '2026-05-14',
        text: 'Entrega da Luna realizada com sucesso na residência do adotante. Ele assinou o termo de adoção responsável.',
        author: 'APP adote aqui'
      }
    ],
    historyLogs: [
      {
        id: 'hlog-4',
        date: '2026-05-10',
        action: 'Interesse cadastrado pelo site'
      },
      {
        id: 'hlog-5',
        date: '2026-05-11',
        action: 'Status alterado para "Entrevista" após contato bem-sucedido'
      },
      {
        id: 'hlog-6',
        date: '2026-05-13',
        action: 'Status alterado para "Aprovado" e entrega agendada'
      },
      {
        id: 'hlog-7',
        date: '2026-05-14',
        action: 'Luna foi entregue. Status alterado para "Adotado"'
      }
    ]
  },
  {
    id: 'cand-4',
    petId: 'pet-3', // Banzé
    name: 'Marcos Vinícius Silva',
    whatsapp: '19991234512',
    city: 'Campinas',
    neighborhood: 'Vila Georgina',
    housingType: 'Casa',
    backyard: 'Sim',
    tenure: 'Alugada',
    experience: {
      hadPets: 'Sim',
      otherAnimalsCount: 2,
      otherAnimalsDetails: 'Dois cães machos de médio porte e temperamento forte.'
    },
    motivation: 'Gosto de cães grandes para vigiar a casa.',
    notes: 'O Banzé não se dá muito bem com outros machos de temperamento dominante. O fato de Marcos já ter dois machos e o intuito de segurança acende um alerta vermelho.',
    status: 'Em análise',
    tags: ['Alerta vermelho', 'Cães machos ativos', 'Segurança'],
    createdAt: '2026-06-18T16:00:00Z',
    internalNotes: [
      {
        id: 'inote-5',
        date: '2026-06-19',
        text: 'Avaliei que o perfil de guarda e a presença de outros 2 machos dominantes inviabiliza a adoção do Banzé, que necessita de cuidados delicados na pata e paz social.',
        author: 'APP adote aqui'
      }
    ],
    historyLogs: [
      {
        id: 'hlog-8',
        date: '2026-06-18',
        action: 'Interesse cadastrado'
      },
      {
        id: 'hlog-9',
        date: '2026-06-19',
        action: 'Revisão interna realizada: Alerta sobre compatibilidade de cães.'
      }
    ]
  }
];

export const INITIAL_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'fup-1',
    petId: 'pet-4', // Luna
    candidateId: 'cand-3', // Carlos Henrique
    type: '7 dias',
    scheduledDate: '2026-05-21',
    status: 'Concluído',
    photosReceived: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400'
    ],
    tutorNotes: 'Luna está super adaptada. Já dorme na cama comigo e adora brincar na sala. Come super bem.',
    adminNotes: 'Acompanhamento de 7 dias excelente. Carlos mandou fotos maravilhosas. Animal gordinho e feliz.',
    updatedAt: '2026-05-21T18:00:00Z'
  },
  {
    id: 'fup-2',
    petId: 'pet-4', // Luna
    candidateId: 'cand-3', // Carlos Henrique
    type: '30 dias',
    scheduledDate: '2026-06-14',
    status: 'Concluído',
    photosReceived: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
    ],
    tutorNotes: 'Tudo perfeito por aqui! Ela cresceu bastante e já completou as vacinas.',
    adminNotes: 'Acompanhamento de 30 dias bem-sucedido. Conversado no WhatsApp e arquivadas as imagens.',
    updatedAt: '2026-06-14T19:30:00Z'
  },
  {
    id: 'fup-3',
    petId: 'pet-4', // Luna
    candidateId: 'cand-3', // Carlos Henrique
    type: '90 dias',
    scheduledDate: '2026-08-14',
    status: 'Pendente',
    photosReceived: [],
    tutorNotes: '',
    adminNotes: '',
    updatedAt: '2026-06-14T19:30:00Z'
  },
  {
    id: 'fup-4',
    petId: 'pet-4', // Luna
    candidateId: 'cand-3', // Carlos Henrique
    type: '180 dias',
    scheduledDate: '2026-11-14',
    status: 'Pendente',
    photosReceived: [],
    tutorNotes: '',
    adminNotes: '',
    updatedAt: '2026-06-14T19:30:00Z'
  }
];

export const INITIAL_USERS: DonorUser[] = [
  {
    id: 'user-carlos',
    name: 'Carlos Henrique Mendes',
    email: 'carlos@example.com',
    phone: '19988112233',
    password: '123',
    role: 'Ambos',
    createdAt: '2026-05-10T10:00:00Z',
    customTags: ['Antigo', 'Doador Ativo', 'Tutor Excelente'],
    city: 'Campinas',
    neighborhood: 'Cambuí',
    housingType: 'Apartamento',
    backyard: 'Não',
    tenure: 'Própria'
  },
  {
    id: 'user-amanda',
    name: 'Amanda Souza de Oliveira',
    email: 'amanda@example.com',
    phone: '19982345678',
    password: '123',
    role: 'Pretendente',
    createdAt: '2026-06-15T14:30:00Z',
    customTags: ['Perfil Ótimo', 'Casa Ampla'],
    city: 'Campinas',
    neighborhood: 'Taquaral',
    housingType: 'Casa',
    backyard: 'Sim',
    tenure: 'Própria'
  },
  {
    id: 'user-juliana',
    name: 'Juliana Ribeiro',
    email: 'juliana@example.com',
    phone: '19971223344',
    password: '123',
    role: 'Pretendente',
    createdAt: '2026-06-22T09:15:00Z',
    customTags: ['Aguardando Visita'],
    city: 'Valinhos',
    neighborhood: 'Centro',
    housingType: 'Apartamento',
    backyard: 'Não',
    tenure: 'Alugada'
  },
  {
    id: 'user-marcia',
    name: 'Márcia Albuquerque',
    email: 'marcia@example.com',
    phone: '11987654321',
    password: '123',
    role: 'Doador',
    createdAt: '2026-04-01T08:00:00Z',
    customTags: ['Lar Temporário Ativo'],
    city: 'Campinas',
    neighborhood: 'Vila Itapura',
    housingType: 'Casa',
    backyard: 'Sim',
    tenure: 'Própria'
  }
];

