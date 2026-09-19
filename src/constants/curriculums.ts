import { Module } from '../types';

export const DEFAULT_MODULES: Module[] = [
  { 
    id: 1, 
    title: "Module 1: Foundations & Core Paradigms", 
    time: "1h 15m",
    lessons: [
       { id: 1, title: "Welcome & Environment Setup", time: "10:00", type: "video", isFree: true, description: "Overview of toolchain, extensions, and starter code repository." },
       { id: 2, title: "The Core Principles of Motion & Feedback", time: "25:00", type: "video", isFree: true, description: "Deep dive into natural acceleration, damping curves, and visual perception." },
       { id: 3, title: "Understanding Easing Curves & Timing Tokens", time: "12:00", type: "reading", isFree: false, wordCount: 1650, description: "Comprehensive guide on cubic-bezier formulas and physics spring constants." },
       { id: 4, title: "Exercise: Bouncing Ball Physics Simulation", time: "25:00", type: "exercise", isFree: false, description: "Hands-on implementation of responsive spring curves with interactive parameters." },
    ]
  },
  { 
    id: 2, 
    title: "Module 2: Layout Systems, Typography & Architecture", 
    time: "2h 30m",
    lessons: [
       { id: 5, title: "Fluid Typography Systems & Mathematical Scales", time: "40:00", type: "video", isFree: false, description: "Designing resilient typographic scales using clamp() and modular steps." },
       { id: 6, title: "CSS Grid vs Modern Flexbox Layout Patterns", time: "28:00", type: "reading", isFree: false, wordCount: 2100, description: "Comparative architectural analysis of subgrid, auto-fit, and flex shrink ratios." },
       { id: 7, title: "Building an Interactive Bento Grid Component", time: "1h 15m", type: "exercise", isFree: false, description: "Step-by-step assembly of a responsive multi-aspect-ratio dashboard widget." },
    ]
  },
  { 
    id: 3, 
    title: "Module 3: Advanced Choreography & Production Deployment", 
    time: "3h 45m",
    lessons: [
       { id: 8, title: "Scroll-Linked Choreography & AnimatePresence", time: "50:00", type: "video", isFree: false, description: "Zero-jank scroll interactions utilizing hardware-accelerated transforms." },
       { id: 9, title: "Drag Interactions & Elastic Constraints", time: "20:00", type: "video", isFree: false, description: "Touch and pointer gesture handlers with inertia and boundary snapping." },
       { id: 10, title: "Production Motion Review & Developer Handoff", time: "15:00", type: "reading", isFree: false, wordCount: 1850, description: "Exporting specs, token synchronizations, and bundle-size audits." },
       { id: 11, title: "Capstone Challenge: Complete Interactive Application", time: "1h 30m", type: "exercise", isFree: false, description: "Final graded project applying all learned principles." },
    ]
  }
];

export function getModulesForCourse(courseId: number): Module[] {
  // Can be customized per course topic
  return DEFAULT_MODULES;
}
