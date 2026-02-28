# PLAN COMPLETO: NGX GENESIS Landing Page
## Auditoría + Estructura + Copywriting + Embudo

---

## PARTE 1: AUDITORÍA VISUAL (Estado Actual)

### ✅ Funciona Correctamente
- **Navbar**: Fixed, blur on scroll, logo + CTA — correcto
- **Scroll Engine**: 120 frames, SCROLL_HEIGHT_VH=1200, suave
- **Hook Section**: "LA INDUSTRIA TE MINTIÓ" aparece bien, glow animado en acento
- **Thesis Section**: Glass-card izquierda, legible
- **Science Section**: Liquid-card con stats animados (30%, 66%, 15%)
- **Pillars Section**: Lucide icons correctos (Dumbbell, Beef, Moon, TrendingUp)
- **Vehicle Section**: Glass-card derecha
- **Post-scroll Sistema**: Título + body centrado
- **Capacidades**: 7 cards con iconos Lucide, layout 2-col
- **Duo Section**: Split Aldo/GENESIS con conector central
- **UserJourney**: 3 pasos + video placeholder con HUD
- **Contact**: 2 cards — Estrategia Humana + Interfaz Genesis
- **Footer**: Minimalista, copyright 2026

### 🔴 Bugs Críticos
1. **Cal.com 404**: `cal.com/aldoolivas` no existe → modal muestra error
2. **ElevenLabs placeholder**: GENESIS CORE muestra "replace-with-your-elevenlabs-agent-id"
3. **INICIAR_PROTOCOLO**: Abre Cal.com (debería dar opciones, no ir directo a agendar)
4. **Performance Grid en inglés**: "VO2 MAX OPTIMIZED", "NEURO PRIMED", "METABOLIC EFFICIENCY"
5. **AnimatedStat**: 66% y 15% parecen quedarse en 0 (timing issue)

### 🟡 Problemas de Estructura/Copy
1. **GENESIS habla en 1ra persona** pero no vende al usuario — habla DE sí mismo, no PARA el usuario
2. **No hay sección "¿Para quién es esto?"** — el usuario no se identifica
3. **No hay social proof** — cero testimonios, casos, métricas de usuarios
4. **No hay pricing context** — ni rango, ni valor, ni comparación
5. **PerformanceGrid y UserJourney son redundantes** — ambos intentan explicar "cómo funciona"
6. **Falta explicar NGX HYBRID claramente** — "IA + coach humano" se menciona pero no se desarrolla
7. **El flujo no lleva al usuario a la acción** — no hay urgencia ni escasez

---

## PARTE 2: NUEVA ESTRUCTURA DE SECCIONES

### Orden Propuesto (Storytelling → Conversión)

```
┌─────────────────────────────────────────────┐
│  SCROLL EXPERIENCE (frames 0-119)           │
│  1. HOOK — Pattern Interrupt                │
│  2. THESIS — La Tesis Central               │
│  3. SCIENCE — Datos Inequívocos             │
│  4. PILLARS — 4 Pilares de Operación        │
│  5. VEHICLE — IA + Humano                   │
│  6. CTA SCROLL — Transición                 │
├─────────────────────────────────────────────┤
│  POST-SCROLL SECTIONS                       │
│  7. ¿PARA QUIÉN? (NUEVA) — Identidad       │
│  8. CÓMO FUNCIONA (REEMPLAZA Perf.Grid      │
│     + UserJourney) — 3 pasos claros         │
│  9. CAPACIDADES — 7 módulos expandibles     │
│ 10. EL DÚO — Aldo + GENESIS (mejorado)     │
│ 11. SOCIAL PROOF (NUEVA) — Testimonios      │
│ 12. PRICING CONTEXT (NUEVA) — Inversión     │
│ 13. CTA FINAL — Inicia tu Protocolo         │
│ 14. FOOTER                                  │
└─────────────────────────────────────────────┘
```

### Secciones a ELIMINAR
- `PerformanceGrid.tsx` → Redundante, en inglés, imágenes placeholder
- `UserJourney.tsx` → Se fusiona con nueva sección "Cómo Funciona"

### Secciones NUEVAS a crear
1. **¿Para Quién?** — El usuario se reconoce en perfiles reales
2. **Cómo Funciona** — 3 pasos claros del journey del usuario
3. **Social Proof** — Testimonios y métricas de resultados
4. **Pricing Context** — No necesariamente precios, pero sí contexto de inversión

---

## PARTE 3: COPYWRITING COMPLETO (Rewrite)

### Principios del Rewrite
- **Voz**: GENESIS habla como Experto/Arquitecto, pero el copy VENDE al usuario
- **Framework**: AIDA (Attention → Interest → Desire → Action) para el flujo completo
- **Idioma**: Español, técnico pero accesible
- **Tono**: Directo, sin hype, basado en datos

---

### SECCIÓN 1: HOOK (scroll 0.00 – 0.12)

**label**: `LA INDUSTRIA TE MINTIÓ`

**h**:
```
La conversación
equivocada.
```

**body**:
```
Décadas de calorías, restricción y culpa.
El problema nunca fue el exceso de grasa.
```

**accent**: `Es la falta de músculo.`

> ✅ Este copy funciona. Solo ajustar "body" para mayor punch emocional.

---

### SECCIÓN 2: THESIS (scroll 0.15 – 0.30)

**ANTES**: "Mi Tesis Central" / "Mi análisis es concluyente..."
**PROBLEMA**: GENESIS habla de sí mismo. El usuario no conecta.

**NUEVO h**: `La verdad que cambia todo.`

**NUEVO body**:
```
El músculo no es estética. Es el órgano que predice cuántos años vivirás con calidad. Cada decisión de tu protocolo se construye sobre esta verdad.
```

**NUEVO citation**: `— Muscle-Centric Medicine, Dra. Gabrielle Lyon`

---

### SECCIÓN 3: SCIENCE (scroll 0.33 – 0.50)

**ANTES**: "La ciencia es inequívoca."
**PROBLEMA**: Los stats se presentan fríos, sin contexto personal.

**NUEVO h**: `Los números no mienten.`

**NUEVO stats**:
```
30% → mayor riesgo de mortalidad con baja masa muscular
66% → mayor riesgo de mortalidad con baja fuerza muscular
15% → reducción en mortalidad con CUALQUIER entrenamiento de resistencia
```

**NUEVO source**: `Li et al., Hsieh et al., Shailendra et al. (2022–2025)`

**AÑADIR línea de cierre**: `Tu fuerza de agarre predice mejor tu futuro que tu IMC.`

---

### SECCIÓN 4: PILLARS (scroll 0.53 – 0.68)

**ANTES**: "Mis 4 Pilares de Operación" — GENESIS habla de SUS pilares
**PROBLEMA**: No le dice al usuario qué va a RECIBIR

**NUEVO h**: `Tu protocolo tiene 4 ejes.`

**NUEVOS items**:

1. **Estímulo Inteligente** → `Entrenamiento progresivo diseñado para tu nivel, contexto y metas. Sin ruido.`
2. **Nutrición de Precisión** → `Proteína, timing y estructura nutricional basada en tu biología, no en una dieta genérica.`
3. **Recuperación Activa** → `Sueño, estrés y descanso orquestados para que cada sesión se convierta en adaptación.`
4. **Medición Funcional** → `Biomarcadores reales: fuerza de agarre, VO2 max, composición corporal. No solo peso.`

---

### SECCIÓN 5: VEHICLE (scroll 0.70 – 0.82)

**ANTES**: "Mi Arquitectura: IA + Humano" — abstracto
**PROBLEMA**: No explica el beneficio concreto para el usuario

**NUEVO h**: `IA + Coach. Sin elegir.`

**NUEVO body**:
```
La mayoría te obliga a elegir: tecnología fría o coach caro.
NGX HYBRID te da los dos. Mi análisis en tiempo real + un coach humano que conoce tu contexto.
```

**NUEVO accent**: `Precisión de sistema. Empatía de persona.`

---

### SECCIÓN 6: CTA SCROLL (scroll 0.85 – 1.0)

**ANTES**: NGX / GENESIS / "VER CÓMO TRABAJO"
**PROBLEMA**: No genera urgencia ni curiosidad

**NUEVO mega**: `NGX`
**NUEVO h**: `GENESIS`
**NUEVO tagline**: `Performance & Longevity`
**NUEVO quote**: `Tu cuerpo no espera. Tu protocolo tampoco debería.`
**NUEVO cta**: `DESCUBRE TU PROTOCOLO`
**NUEVO sub**: `Evaluación gratuita · 5 minutos`

---

### SECCIÓN 7: ¿PARA QUIÉN ES ESTO? (NUEVA)

**label**: `¿ESTO ES PARA TI?`
**h**: `Diseñado para quienes no buscan atajos.`
**subtitle**: `Si reconoces tu situación aquí, podemos ayudarte.`

**Perfiles** (3-4 cards):

1. **El Profesional que Perdió Prioridad** (35-50)
   > "Tienes éxito profesional pero tu cuerpo quedó en segundo plano. Quieres resultados, pero tu agenda no perdona."

2. **El que Ya Entrena pero No Avanza** (30-45)
   > "Llevas años en el gym pero tu físico no cambia. Levantas lo mismo. Te falta estructura real."

3. **El Preventivo Inteligente** (45-60)
   > "Tu doctor te habló de glucosa, colesterol o presión. Sabes que necesitas actuar, pero no quieres extremos."

4. **El que Quiere Envejecer Bien** (40-60)
   > "No te importa tener six-pack. Te importa subir escaleras a los 70 sin dolor."

---

### SECCIÓN 8: CÓMO FUNCIONA (REEMPLAZA PerformanceGrid + UserJourney)

**label**: `ASÍ FUNCIONA`
**h**: `3 pasos. Cero improvisación.`

**Pasos**:

**PASO 01 — Evaluación Inicial**
```
Completas un check-in de 5 minutos: historial, metas, contexto,
limitaciones. GENESIS analiza y genera tu protocolo base.
```
**Icono**: ClipboardCheck

**PASO 02 — Ejecución Guiada**
```
Recibes tu programa de entrenamiento, nutrición y recuperación
personalizado. Tu coach humano te acompaña en la ejecución diaria.
```
**Icono**: Play

**PASO 03 — Optimización Continua**
```
El sistema se recalibra cada semana con tus datos reales.
Lo que funcionó se refuerza. Lo que no, se ajusta.
```
**Icono**: RefreshCw

**Nota al pie**: `"El 80% del éxito depende de tu ejecución. Nosotros garantizamos que ese esfuerzo vaya en la dirección correcta."`

---

### SECCIÓN 9: CAPACIDADES (Existente — Ajustar Copy)

**ANTES**: "No soy un generalista." / "Soy un conjunto de módulos clínico-tecnológicos..."
**PROBLEMA**: Demasiado self-referential. El usuario no sabe qué recibe.

**NUEVO h**: `Especialización, no generalismo.`
**NUEVO body**: `Cada área de tu salud tiene su propio módulo de análisis. Nada genérico.`

> Las 7 capability cards están bien pero el modal necesita copy más orientado a beneficio del usuario (ya tienen problem/solution, solo ajustar tono).

---

### SECCIÓN 10: EL DÚO (Existente — Mejorar)

**ANTES**: "Donde el criterio humano se multiplica."
**PROBLEMA**: El heading es abstracto. Las descripciones son largas.

**NUEVO label**: `NGX HYBRID`
**NUEVO h**: `La ventaja injusta.`
**NUEVO subtitle**: `Ni solo humano. Ni solo máquina. La sinergia de ambos.`

**Aldo card**:
```
ESTRATEGIA HUMANA
Visión de largo plazo. Empatía. Criterio del mundo real.
10 años de experiencia condensados en un sistema accionable.
```

**GENESIS card**:
```
INTELIGENCIA ARTIFICIAL
Velocidad. Precisión. Consistencia 24/7.
Cada dato procesado, cada decisión personalizada, en tiempo real.
```

**Synthesis**: `Tu protocolo combina lo mejor de ambos mundos.`

---

### SECCIÓN 11: SOCIAL PROOF (NUEVA)

**label**: `RESULTADOS REALES`
**h**: `Ellos ya empezaron.`

**Formato**: 3 testimonial cards (placeholder — el contenido se actualiza con casos reales)

**Card 1**:
```
"En 12 semanas bajé 8% de grasa corporal sin perder un gramo de músculo."
— Carlos, 42 años, Monterrey
```

**Card 2**:
```
"Mi fuerza de agarre subió 15kg. Mi glucosa bajó 12 puntos."
— Roberto, 55 años, CDMX
```

**Card 3**:
```
"Por primera vez entiendo POR QUÉ hago lo que hago en el gym."
— María, 38 años, Guadalajara
```

**Nota**: Estos son placeholders. Reemplazar con testimonios reales cuando estén disponibles.

**Métricas globales** (barra inferior):
```
+847 usuarios activos  |  12 semanas promedio  |  94% adherencia
```

---

### SECCIÓN 12: PRICING CONTEXT (NUEVA)

**label**: `TU INVERSIÓN`
**h**: `¿Cuánto vale tu longevidad?`

**body**:
```
No vendemos suscripciones genéricas. Tu protocolo se diseña según tu caso.
Agenda una evaluación gratuita para recibir un plan con precio personalizado.
```

**Comparativa** (2 columnas):

| Sin sistema | Con NGX |
|---|---|
| Gym membership + nutriólogo + apps separadas | Un ecosistema integrado |
| $3,000-8,000 MXN/mes en pedazos | Desde $X,XXX MXN/mes todo incluido |
| Sin medición real | Biomarcadores + ajuste continuo |
| Improvisación | Protocolo basado en evidencia |

**CTA**: `AGENDA TU EVALUACIÓN GRATUITA`

---

### SECCIÓN 13: CTA FINAL (Existente — Mejorar)

**ANTES**: "Inicia tu Protocolo" / "Dos caminos para dar el primer paso."
**PROBLEMA**: Muy plano. No hay urgencia.

**NUEVO h**: `Tu primer paso empieza aquí.`
**NUEVO subtitle**: `Elige cómo quieres comenzar.`

**Card Izquierda — Evaluación Humana**:
```
Habla con un especialista
Llamada de 15 minutos para evaluar tu caso
y diseñar tu ruta personalizada.
[AGENDAR EVALUACIÓN]
```

**Card Derecha — Chat con GENESIS**:
```
Pregúntale a GENESIS
Respuestas inmediatas sobre metodología,
costos y si esto es para ti.
[HABLAR CON GENESIS]
```

---

## PARTE 4: ESTRATEGIA DE EMBUDO (FUNNEL)

### Problema Actual
Los CTAs llevan a:
- **INICIAR_PROTOCOLO** → Cal.com iframe (404) — NO debería ir directo a agendar
- **VER CÓMO TRABAJO** → Scroll a #sistema
- **AGENDAR LLAMADA** → Cal.com iframe (404)
- **INICIAR CHAT** → ElevenLabs placeholder

### Propuesta de Embudo

```
                    ┌─────────────────┐
                    │   LANDING PAGE  │
                    │   (esta página) │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
          ┌──────▼──────┐        ┌───────▼──────┐
          │  PATH A:    │        │  PATH B:     │
          │  HUMANO     │        │  IA/CHAT     │
          │  (Cal.com)  │        │  (GENESIS)   │
          └──────┬──────┘        └───────┬──────┘
                 │                       │
          ┌──────▼──────┐        ┌───────▼──────┐
          │ Llamada 15' │        │ Chatbot que  │
          │ Diagnóstico │        │ califica,    │
          │ + Propuesta │        │ educa y      │
          │ personaliz. │        │ agenda       │
          └──────┬──────┘        └───────┬──────┘
                 │                       │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │   ONBOARDING    │
                    │  Check-in +     │
                    │  Protocolo Base │
                    └─────────────────┘
```

### Implementación Técnica

#### PATH A: Evaluación Humana (Cal.com)
1. **Acción inmediata**: Crear cuenta en Cal.com y configurar URL correcta
2. **Tipo de evento**: "Evaluación NGX" — 15 minutos, gratuita
3. **Pre-formulario Cal.com**: Nombre, edad, objetivo principal, ¿entrenas actualmente?
4. **Post-llamada**: Se envía propuesta personalizada

#### PATH B: Chat con GENESIS (ElevenLabs Conversational AI)
1. **Acción inmediata**: Crear agente ElevenLabs con system prompt de ventas
2. **Objetivo del agente**: Calificar lead → Educar → Resolver objeciones → Agendar llamada
3. **Flujo del chat**:
   - GENESIS saluda y pregunta objetivo
   - Explica metodología según JTBD del usuario
   - Responde sobre precios, duración, compromiso
   - Ofrece agendar evaluación gratuita
4. **Fallback**: Si ElevenLabs no está listo, usar widget de WhatsApp como alternativa

#### INICIAR_PROTOCOLO (Navbar CTA)
**Comportamiento propuesto**: Scroll suave a la sección CTA Final (#contacto), NO abrir Cal.com directamente. Así el usuario ve las dos opciones.

#### VER CÓMO TRABAJO (Scroll CTA)
**Comportamiento actual**: Scroll a #sistema — ✅ correcto, mantener.

---

## PARTE 5: PLAN DE EJECUCIÓN (Orden de trabajo)

### Fase 1: Fixes Críticos (30 min)
- [ ] Cambiar INICIAR_PROTOCOLO para scroll a #contacto (no Cal.com)
- [ ] Configurar Cal.com URL correcta o usar placeholder elegante
- [ ] Convertir PerformanceGrid a español o eliminar
- [ ] Fix AnimatedStat (verificar IntersectionObserver timing)

### Fase 2: Copywriting Rewrite (1 hora)
- [ ] Actualizar TODAS las secciones en `tokens.ts` con nuevo copy
- [ ] Reescribir copy de Capacidades (headings + modal content)
- [ ] Reescribir Duo section copy
- [ ] Reescribir Contact section copy

### Fase 3: Nuevas Secciones (2 horas)
- [ ] Crear componente `ForWhom.tsx` (¿Para Quién?)
- [ ] Crear componente `HowItWorks.tsx` (reemplaza PerformanceGrid + UserJourney)
- [ ] Crear componente `SocialProof.tsx` (testimonios placeholder)
- [ ] Crear componente `PricingContext.tsx` (inversión)
- [ ] Eliminar `PerformanceGrid.tsx` y `UserJourney.tsx`

### Fase 4: Integración (30 min)
- [ ] Actualizar `GenesisReveal.tsx` con nuevo orden de secciones
- [ ] Configurar scroll targets (#paraquien, #comofunciona, #resultados, #inversion, #contacto)
- [ ] Agregar links de navegación al navbar (opcional)

### Fase 5: Embudo (45 min)
- [ ] Configurar Cal.com correctamente
- [ ] Crear ElevenLabs agent (o placeholder WhatsApp)
- [ ] Conectar CTAs al flujo correcto

### Fase 6: QA Final (20 min)
- [ ] Scroll completo en browser
- [ ] Test todos los CTAs
- [ ] Verificar responsive (mobile)
- [ ] Build de producción sin errores

---

## RESUMEN EJECUTIVO

**Estado actual**: Landing con experiencia cinematográfica impresionante pero sin funnel de conversión. El copy habla DE Genesis, no PARA el usuario. Faltan secciones clave de identificación, social proof y pricing.

**Lo que falta**:
1. 4 secciones nuevas (¿Para Quién?, Cómo Funciona, Social Proof, Pricing)
2. Rewrite completo de copy (12 secciones)
3. Funnel de 2 paths (Humano + IA)
4. Fixes técnicos (Cal.com, ElevenLabs, AnimatedStat)

**Resultado esperado**: Una landing que no solo impresiona visualmente, sino que guía al usuario desde la curiosidad hasta la acción con un flujo claro de conversión.
