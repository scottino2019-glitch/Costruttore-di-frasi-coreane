export interface Sentence {
  id: string;
  korean: string;
  translation: string;
  romanization: string;
  blocks: string[]; // These will be scrambled by the client when playing
  explanation: string;
  category: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzato";
}

export const CATEGORIES = [
  "Presentazioni",
  "Ristorante e Cibo",
  "Viaggi e Direzioni",
  "Vita Quotidiana",
  "K-Drama ed Espressioni"
];

export const DIFFICULTY_LEVELS = [
  "Principiante",
  "Intermedio",
  "Avanzato"
];

export const curatedSentences: Sentence[] = [
  // --- PRINCIPIANTE ---
  {
    id: "beg-1",
    korean: "안녕하세요.",
    translation: "Buongiorno / Ciao.",
    romanization: "An-nyeong-ha-se-yo.",
    blocks: ["안녕하세요."],
    explanation: "안녕하세요 è il saluto più comune in coreano, coniugato al livello cortese formale/informale (-요). Deriva dal verbo 안녕하다 (essere in pace/salute).",
    category: "Presentazioni",
    difficulty: "Principiante"
  },
  {
    id: "beg-2",
    korean: "저는 학생입니다.",
    translation: "Io sono uno studente.",
    romanization: "Jeo-neun hak-saeng-im-ni-da.",
    blocks: ["저", "는", "학생", "입니다."],
    explanation: "• 저 (io, formale) + 는 (particella del tema)\n• 학생 (studente)\n• 입니다 (essere, coniugato nello stile formale cortese -ㅂ니다).\nLa struttura è Soggetto - Oggetto/Predicato - Verbo.",
    category: "Presentazioni",
    difficulty: "Principiante"
  },
  {
    id: "beg-3",
    korean: "이름이 무엇입니까?",
    translation: "Come ti chiami? (Qual è il tuo nome?)",
    romanization: "I-reum-i mu-eot-im-ni-kka?",
    blocks: ["이름", "이", "무엇", "입니까?"],
    explanation: "• 이름 (nome) + 이 (particella del soggetto)\n• 무엇 (cosa)\n• 입니까 (essere, in forma di domanda formale -ㅂ니까?).",
    category: "Presentazioni",
    difficulty: "Principiante"
  },
  {
    id: "beg-4",
    korean: "김치를 좋아합니다.",
    translation: "Mi piace il Kimchi.",
    romanization: "Gim-chi-reul jo-a-ham-ni-da.",
    blocks: ["김치", "를", "좋아합니다."],
    explanation: "• 김치 (Kimchi, piatto tradizionale) + 를 (particella dell'oggetto diretto)\n• 좋아합니다 (verbo 좋아하다 - piacere/amare, in stile formale cortese).\nIn coreano il soggetto ('io') è spesso sottointeso quando è ovvio dal contesto.",
    category: "Ristorante e Cibo",
    difficulty: "Principiante"
  },
  {
    id: "beg-5",
    korean: "이것은 얼마예요?",
    translation: "Quanto costa questo?",
    romanization: "I-geot-eun ol-ma-ye-yo?",
    blocks: ["이것", "은", "얼마", "예요?"],
    explanation: "• 이것 (questo) + 은 (particella del tema)\n• 얼마 (quanto)\n• 예요? (essere, coniugato nello stile cortese informale -예요/이에요).",
    category: "Ristorante e Cibo",
    difficulty: "Principiante"
  },
  {
    id: "beg-6",
    korean: "물이 필요해요.",
    translation: "Ho bisogno di acqua.",
    romanization: "Mul-i pil-yo-hae-yo.",
    blocks: ["물", "이", "필요해요."],
    explanation: "• 물 (acqua) + 이 (particella del soggetto)\n• 필요해요 (verbo 필요하다 - essere necessario, coniugato in stile cortese informale).",
    category: "Ristorante e Cibo",
    difficulty: "Principiante"
  },
  {
    id: "beg-7",
    korean: "화장실은 어디에 있어요?",
    translation: "Dov'è il bagno?",
    romanization: "Hwa-jang-sil-eun eo-di-e is-seo-yo?",
    blocks: ["화장실", "은", "어디", "에", "있어요?"],
    explanation: "• 화장실 (bagno) + 은 (particella del tema)\n• 어디 (dove) + 에 (particella di luogo/stato)\n• 있어요? (verbo 있다 - esserci/avere, coniugato in stile cortese informale).",
    category: "Viaggi e Direzioni",
    difficulty: "Principiante"
  },
  {
    id: "beg-8",
    korean: "지금 어디에 가요?",
    translation: "Dove stai andando adesso?",
    romanization: "Ji-geum eo-di-e ga-yo?",
    blocks: ["지금", "어디", "에", "가요?"],
    explanation: "• 지금 (adesso)\n• 어디 (dove) + 에 (particella di direzione/luogo)\n• 가요? (verbo 가다 - andare, coniugato in stile cortese informale).",
    category: "Viaggi e Direzioni",
    difficulty: "Principiante"
  },
  {
    id: "beg-9",
    korean: "한국어를 공부해요.",
    translation: "Studio il coreano.",
    romanization: "Han-gug-eo-reul gong-bu-hae-yo.",
    blocks: ["한국어", "를", "공부해요."],
    explanation: "• 한국어 (lingua coreana) + 를 (particella dell'oggetto diretto)\n• 공부해요 (verbo 공부하다 - studiare, coniugato in stile cortese informale).",
    category: "Vita Quotidiana",
    difficulty: "Principiante"
  },
  {
    id: "beg-10",
    korean: "오늘 날씨가 좋아요.",
    translation: "Oggi il tempo è bello.",
    romanization: "O-neul nal-ssi-ga jo-a-yo.",
    blocks: ["오늘", "날씨", "가", "좋아요."],
    explanation: "• 오늘 (oggi)\n• 날씨 (tempo atmosferico) + 가 (particella del soggetto)\n• 좋아요 (verbo/aggettivo 좋다 - essere buono/bello, in stile cortese informale).",
    category: "Vita Quotidiana",
    difficulty: "Principiante"
  },

  // --- INTERMEDIO ---
  {
    id: "int-1",
    korean: "저는 한국 친구를 만나고 싶어요.",
    translation: "Voglio incontrare un amico coreano.",
    romanization: "Jeo-neun han-guk chin-gu-reul man-na-go sip-eo-yo.",
    blocks: ["저는", "한국", "친구", "를", "만나고", "싶어요."],
    explanation: "• 한국 친구 (amico coreano) + 를 (particella oggetto)\n• 만나다 (incontrare) + -고 싶다 (esprime desiderio: 'voglio...') con coniugazione cortese informale -싶어요.",
    category: "Presentazioni",
    difficulty: "Intermedio"
  },
  {
    id: "int-2",
    korean: "매운 음식을 먹을 수 있어요?",
    translation: "Riesci a mangiare cibo piccante?",
    romanization: "Mae-un eum-sik-eul meog-eul su is-seo-yo?",
    blocks: ["매운", "음식", "을", "먹을", "수", "있어요?"],
    explanation: "• 매운 (piccante, aggettivo 맵다 modificato per precedere un sostantivo)\n• 음식 (cibo) + 을 (particella oggetto)\n• 먹다 (mangiare) + -(으)ㄹ 수 있다 (esprime abilità: 'poter fare qualcosa') -> 먹을 수 있어요?.",
    category: "Ristorante e Cibo",
    difficulty: "Intermedio"
  },
  {
    id: "int-3",
    korean: "여기에서 서울역까지 어떻게 가요?",
    translation: "Da qui come vado alla stazione di Seul?",
    romanization: "Yeo-gi-e-seo Seo-ul-yeog-kka-ji eo-tteoh-ge ga-yo?",
    blocks: ["여기", "에서", "서울역", "까지", "어떻게", "가요?"],
    explanation: "• 여기 (qui) + 에서 (da, punto di partenza)\n• 서울역 (Stazione di Seul) + 까지 (fino a, punto di arrivo)\n• 어떻게 (come, avverbio)\n• 가요? (andare, cortese informale).",
    category: "Viaggi e Direzioni",
    difficulty: "Intermedio"
  },
  {
    id: "int-4",
    korean: "내일 친구와 같이 영화를 볼 거예요.",
    translation: "Domani guarderò un film insieme a un amico.",
    romanization: "Nae-il chin-gu-wa ga-chi yeong-hwa-reul bol geo-ye-yo.",
    blocks: ["내일", "친구", "와", "같이", "영화", "를", "볼", "거예요."],
    explanation: "• 내일 (domani)\n• 친구 (amico) + 와 (con/e)\n• 같이 (insieme)\n• 영화 (film) + 를 (particella oggetto)\n• 볼 거예요 (verbo 보다 - guardare/vedere + -(으)ㄹ 것이다 per coniugare al futuro).",
    category: "Vita Quotidiana",
    difficulty: "Intermedio"
  },
  {
    id: "int-5",
    korean: "진짜 대박이네요! 축하해요!",
    translation: "È pazzesco / incredibile! Congratulazioni!",
    romanization: "Jin-jja dae-bag-i-ne-yo! Chuk-ha-hae-yo!",
    blocks: ["진짜", "대박", "이네요!", "축하해요!"],
    explanation: "• 진짜 (davvero/veramente)\n• 대박 (grande successo / pazzesco - slang molto comune)\n• -네요 (suffisso esclamativo che indica sorpresa/scoperta)\n• 축하해요 (dal verbo 축하하다 - congratularsi).",
    category: "K-Drama ed Espressioni",
    difficulty: "Intermedio"
  },

  // --- AVANZATO ---
  {
    id: "adv-1",
    korean: "한국어로 더 유창하게 말하고 싶어서 매일 연습해요.",
    translation: "Pratico ogni giorno perché voglio parlare coreano più fluentemente.",
    romanization: "Han-gug-eo-ro deo yu-chang-ha-ge mal-ha-go sip-eo-seo mae-il yeon-seub-hae-yo.",
    blocks: ["한국어로", "더", "유창하게", "말하고", "싶어서", "매일", "연습해요."],
    explanation: "• 한국어 (coreano) + -로 (particella strumentale: 'in/con il coreano')\n• 더 (più)\n• 유창하게 (fluentemente, da 유창하다)\n• 말하고 싶다 (voler parlare) + -어서 (congiunzione causale: 'poiché voglio... / desiderando...')\n• 매일 (ogni giorno)\n• 연습해요 (praticare, cortese informale).",
    category: "Vita Quotidiana",
    difficulty: "Avanzato"
  },
  {
    id: "adv-2",
    korean: "제가 추천하는 식당에 같이 가 보실래요?",
    translation: "Ti andrebbe di andare insieme al ristorante che ti consiglio?",
    romanization: "Je-ga chu-cheon-ha-neun sik-dang-e ga-chi ga bo-sil-rae-yo?",
    blocks: ["제가", "추천하는", "식당", "에", "같이", "가", "보실래요?"],
    explanation: "• 제가 (io, formale soggetto)\n• 추천하는 (che consiglio, verbo 추천하다 al participio presente modificatore del nome 식당)\n• 식당 (ristorante) + 에 (particella di luogo/direzione)\n• 같이 (insieme)\n• 가 보다 (provare ad andare)\n• -(으)ㄹ래요? (esprime proposta o invito cortese, con l'onorifico 시 inserito per mostrare rispetto all'interlocutore: 보실래요?).",
    category: "Ristorante e Cibo",
    difficulty: "Avanzato"
  },
  {
    id: "adv-3",
    korean: "드라마에서 보던 장소에 직접 가 보니까 정말 신기해요.",
    translation: "Andare di persona nei posti che vedevo nei K-Drama è davvero fantastico/emozionante.",
    romanization: "Deu-ra-ma-e-seo bo-deon jang-so-e jik-jeob ga bo-ni-kka jeong-mal sin-gi-hae-yo.",
    blocks: ["드라마에서", "보던", "장소", "에", "직접", "가", "보니까", "정말", "신기해요."],
    explanation: "• 드라마 (drama/serie TV) + 에서 (in/da)\n• 보던 (che vedevo, retrospettivo di 보다)\n• 장소 (posto/luogo) + 에 (a/in)\n• 직접 (direttamente / di persona)\n• 가 보다 (andare a vedere/provare) + -(으)니까 (poiché/ora che ho fatto... scoprendo che...)\n• 정말 (davvero)\n• 신기하다 (essere fantastico, curioso, magico).",
    category: "K-Drama ed Espressioni",
    difficulty: "Avanzato"
  }
];
