# Test Político Argentino

## Overview
Test interactivo de 10 preguntas sobre política argentina que ayuda a los usuarios a descubrir con qué corrientes políticas coinciden más sus ideas. La aplicación calcula porcentajes de afinidad con 6 corrientes: Liberalismo, Conservadurismo, Peronismo, Kirchnerismo/Progresismo, Izquierda y Radicalismo.

## Project Type
Single Page Application (SPA) - React con TypeScript, sin backend necesario (toda la lógica es client-side)

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components
- **Routing**: Wouter
- **State Management**: React hooks (useState)
- **No Backend Required**: Toda la lógica de scoring se ejecuta en el cliente

## Features Implemented
1. ✅ Página de inicio con título "Descubrí con qué ideas políticas coincidís en Argentina"
2. ✅ 10 preguntas políticas con 3 opciones cada una (De acuerdo, Neutral, En desacuerdo)
3. ✅ Sistema de puntuación interno para 6 corrientes políticas
4. ✅ Navegación pregunta por pregunta con barra de progreso
5. ✅ Página de resultados mostrando:
   - Corriente dominante con descripción completa
   - Porcentajes de afinidad con todas las corrientes (suma 100%)
6. ✅ Botón para compartir resultados (usa Web Share API o clipboard)
7. ✅ Botón para reiniciar el test
8. ✅ Diseño responsive, optimizado para mobile y desktop
9. ✅ Interfaz simple y profesional enfocada en texto

## Architecture

### File Structure
```
client/src/
├── components/
│   ├── LandingPage.tsx      # Página inicial con CTA
│   ├── QuestionView.tsx     # Vista de pregunta individual
│   └── ResultsView.tsx      # Pantalla de resultados
├── pages/
│   └── Home.tsx             # Página principal que maneja el estado
└── App.tsx                  # Router principal

shared/
└── schema.ts                # Tipos, preguntas y descripciones de corrientes
```

### Key Components
- **LandingPage**: Hero section con título y botón "Empezar Test"
- **QuestionView**: Muestra una pregunta a la vez con progress bar y opciones
- **ResultsView**: Muestra corriente dominante, descripción y breakdown de porcentajes
- **Home**: Maneja el state machine (landing → quiz → results) y cálculo de resultados

### Data Flow
1. Usuario inicia el test desde LandingPage
2. Home component itera sobre las 10 preguntas de `shared/schema.ts`
3. Cada respuesta se almacena en el estado local
4. Al finalizar, se calcula el puntaje para cada corriente política
5. Se determina la corriente dominante y se calculan porcentajes
6. ResultsView muestra los resultados con opción de compartir o reiniciar

## Scoring System
Cada pregunta tiene un objeto `scores` que mapea respuestas a puntos por corriente:
```typescript
scores: {
  agree: { "Liberalismo": 3, "Conservadurismo": 2 },
  neutral: { "Radicalismo": 1 },
  disagree: { "Peronismo": 2 }
}
```

Los porcentajes se calculan como: `(puntos_corriente / total_puntos) * 100`

## Design Guidelines
- Color principal: Azul profesional (220 90% 56%)
- Tipografía: Inter, tamaños jerárquicos
- Espaciado consistente: 4, 6, 8 unidades
- Bordes de 2px para elementos interactivos
- Transiciones suaves (200ms)
- Max width: 2xl para óptima lectura

## Running the Project
```bash
npm install
npm run dev
```

El servidor se inicia en puerto 5000.

## Recent Changes
- 2025-10-21: Implementación inicial completa del Test Político Argentino
  - Schema con 10 preguntas políticas argentinas
  - Componentes LandingPage, QuestionView, ResultsView
  - Sistema de scoring y cálculo de porcentajes
  - Funcionalidad de compartir con Web Share API
  - Diseño responsive siguiendo design guidelines
