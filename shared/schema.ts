import { z } from "zod";

// Political currents in Argentina
export type PoliticalCurrent = 
  | "Liberalismo"
  | "Conservadurismo"
  | "Peronismo"
  | "Kirchnerismo/Progresismo"
  | "Izquierda"
  | "Radicalismo";

// Answer options
export type AnswerOption = "agree" | "neutral" | "disagree";

// Score mapping for each answer
export interface ScoreMapping {
  agree: Partial<Record<PoliticalCurrent, number>>;
  neutral: Partial<Record<PoliticalCurrent, number>>;
  disagree: Partial<Record<PoliticalCurrent, number>>;
}

// Question structure
export interface Question {
  id: number;
  text: string;
  scores: ScoreMapping;
}

// User's answer
export interface UserAnswer {
  questionId: number;
  answer: AnswerOption;
}

// Political current description
export interface CurrentDescription {
  name: PoliticalCurrent;
  description: string;
  shortDescription: string;
}

// Answer detail for results breakdown
export interface AnswerDetail {
  questionId: number;
  questionText: string;
  answer: AnswerOption;
  answerLabel: string;
  contributedTo: Array<{ current: PoliticalCurrent; points: number }>;
}

// Test results
export interface TestResults {
  scores: Record<PoliticalCurrent, number>;
  dominantCurrent: PoliticalCurrent;
  percentages: Record<PoliticalCurrent, number>;
  answerDetails?: AnswerDetail[];
  alignment?: CurrentAlignment;
}

// Answer option display
export const answerLabels: Record<AnswerOption, string> = {
  agree: "De acuerdo",
  neutral: "Neutral",
  disagree: "En desacuerdo"
};

// Analysis of why user aligned with each current
export interface CurrentAlignment {
  current: PoliticalCurrent;
  percentage: number;
  keyReasons: string[];
}

// Political current descriptions
export const currentDescriptions: Record<PoliticalCurrent, CurrentDescription> = {
  "Liberalismo": {
    name: "Liberalismo",
    description: "El liberalismo en Argentina enfatiza la libertad individual, la economía de mercado y la limitación del rol del Estado. Promueve la iniciativa privada, la desregulación económica, y la defensa de las libertades civiles. Históricamente asociado con figuras como Alberdi y en tiempos modernos con propuestas de reducción del gasto público y apertura económica.",
    shortDescription: "Libertad individual y economía de mercado"
  },
  "Conservadurismo": {
    name: "Conservadurismo",
    description: "El conservadurismo argentino defiende los valores tradicionales, la familia, y las instituciones establecidas. Suele enfatizar el orden social, la seguridad, y la preservación de tradiciones culturales y religiosas. En lo económico puede combinarse con liberalismo o con posturas más estatistas según la corriente.",
    shortDescription: "Valores tradicionales y orden social"
  },
  "Peronismo": {
    name: "Peronismo",
    description: "El peronismo es un movimiento político argentino fundado por Juan Domingo Perón, que combina justicia social, independencia económica y soberanía política. Promueve los derechos de los trabajadores, la industrialización nacional, y un Estado con rol activo en la economía. Es un movimiento amplio con diversas corrientes internas.",
    shortDescription: "Justicia social y rol activo del Estado"
  },
  "Kirchnerismo/Progresismo": {
    name: "Kirchnerismo/Progresismo",
    description: "El kirchnerismo es una corriente dentro del peronismo que enfatiza la inclusión social, los derechos humanos, y políticas progresistas. Promueve la intervención estatal en la economía, la redistribución del ingreso, y agenda de derechos ampliados. Se asocia con las presidencias de Néstor y Cristina Kirchner.",
    shortDescription: "Derechos humanos e inclusión social"
  },
  "Izquierda": {
    name: "Izquierda",
    description: "La izquierda argentina abarca diversos movimientos socialistas, comunistas y de izquierda independiente. Promueve la transformación social profunda, la socialización de medios de producción, y la lucha por los derechos de trabajadores y sectores populares. Crítica tanto del liberalismo como del peronismo tradicional.",
    shortDescription: "Transformación social y derechos de trabajadores"
  },
  "Radicalismo": {
    name: "Radicalismo",
    description: "El radicalismo, representado por la Unión Cívica Radical (UCR), es uno de los partidos políticos más antiguos de Argentina. Promueve la democracia representativa, el republicanismo, y una posición centrista con énfasis en las instituciones democráticas. Históricamente asociado con la clase media y reformas progresistas.",
    shortDescription: "Democracia representativa y republicanismo"
  }
};

// 10 political questions with scoring
export const questions: Question[] = [
  {
    id: 1,
    text: "El Estado debe tener un rol activo en la economía, regulando precios y protegiendo la industria nacional.",
    scores: {
      agree: { "Peronismo": 3, "Kirchnerismo/Progresismo": 3, "Izquierda": 3 },
      neutral: { "Radicalismo": 2 },
      disagree: { "Liberalismo": 3, "Conservadurismo": 2 }
    }
  },
  {
    id: 2,
    text: "La educación pública y la salud pública deben ser gratuitas y de calidad, financiadas por el Estado.",
    scores: {
      agree: { "Peronismo": 2, "Kirchnerismo/Progresismo": 3, "Izquierda": 3, "Radicalismo": 2 },
      neutral: { "Conservadurismo": 1 },
      disagree: { "Liberalismo": 2 }
    }
  },
  {
    id: 3,
    text: "Los impuestos deben reducirse significativamente para fomentar la inversión privada y el crecimiento económico.",
    scores: {
      agree: { "Liberalismo": 3, "Conservadurismo": 2 },
      neutral: { "Radicalismo": 1 },
      disagree: { "Kirchnerismo/Progresismo": 2, "Izquierda": 3, "Peronismo": 1 }
    }
  },
  {
    id: 4,
    text: "Es prioritario mantener los valores tradicionales y la familia como núcleo de la sociedad.",
    scores: {
      agree: { "Conservadurismo": 3, "Peronismo": 1 },
      neutral: { "Radicalismo": 1, "Liberalismo": 1 },
      disagree: { "Kirchnerismo/Progresismo": 2, "Izquierda": 1 }
    }
  },
  {
    id: 5,
    text: "Los derechos humanos deben estar por encima de cualquier consideración de seguridad o económica.",
    scores: {
      agree: { "Kirchnerismo/Progresismo": 3, "Izquierda": 3, "Radicalismo": 2 },
      neutral: { "Peronismo": 1 },
      disagree: { "Conservadurismo": 2, "Liberalismo": 1 }
    }
  },
  {
    id: 6,
    text: "Los sindicatos son fundamentales para defender los derechos de los trabajadores.",
    scores: {
      agree: { "Peronismo": 3, "Kirchnerismo/Progresismo": 2, "Izquierda": 3, "Radicalismo": 1 },
      neutral: { "Conservadurismo": 1 },
      disagree: { "Liberalismo": 2 }
    }
  },
  {
    id: 7,
    text: "Argentina debe abrirse más al comercio internacional y reducir las barreras aduaneras.",
    scores: {
      agree: { "Liberalismo": 3, "Radicalismo": 1 },
      neutral: { "Conservadurismo": 1 },
      disagree: { "Peronismo": 2, "Kirchnerismo/Progresismo": 2, "Izquierda": 2 }
    }
  },
  {
    id: 8,
    text: "El gobierno debe garantizar subsidios y asistencia social para los sectores más vulnerables.",
    scores: {
      agree: { "Peronismo": 3, "Kirchnerismo/Progresismo": 3, "Izquierda": 2, "Radicalismo": 2 },
      neutral: { "Conservadurismo": 1 },
      disagree: { "Liberalismo": 3 }
    }
  },
  {
    id: 9,
    text: "Las instituciones republicanas y la división de poderes deben ser intocables.",
    scores: {
      agree: { "Radicalismo": 3, "Liberalismo": 2, "Conservadurismo": 2 },
      neutral: { "Peronismo": 1 },
      disagree: { "Kirchnerismo/Progresismo": 1, "Izquierda": 1 }
    }
  },
  {
    id: 10,
    text: "Es necesario transformar profundamente el sistema económico para lograr una sociedad más justa e igualitaria.",
    scores: {
      agree: { "Izquierda": 3, "Kirchnerismo/Progresismo": 2 },
      neutral: { "Peronismo": 1, "Radicalismo": 1 },
      disagree: { "Liberalismo": 2, "Conservadurismo": 2 }
    }
  }
];
