import { Course, Module } from '../types';

export interface CourseFlashcard {
  id: string;
  term: string;
  definition: string;
  category: string;
  example?: string;
  hint?: string;
  mastered?: boolean;
  needsReview?: boolean;
}

export const COURSE_FLASHCARDS_MAP: Record<number, CourseFlashcard[]> = {
  // 1: Flutter Masterclass
  1: [
    {
      id: 'flt-1',
      term: 'Widget Tree',
      definition: 'The fundamental hierarchy of visual and structural elements in Flutter that describes what the interface should look like given its current configuration and state.',
      category: 'Architecture',
      example: 'Widget build(BuildContext context) => Scaffold(body: Center(child: Text("Hello")));',
      hint: 'The nested blueprint of every Flutter UI element.'
    },
    {
      id: 'flt-2',
      term: 'StatefulWidget vs StatelessWidget',
      definition: 'StatelessWidgets are immutable and never change properties at runtime, whereas StatefulWidgets maintain mutable state over their lifecycle via a separate State object.',
      category: 'Core Concepts',
      example: 'Use StatelessWidget for static icons/labels; use StatefulWidget for forms, timers, and animations.',
      hint: 'Think: dynamic runtime data changes vs static displays.'
    },
    {
      id: 'flt-3',
      term: 'BuildContext',
      definition: 'A handle to the location of a widget within the overall widget tree hierarchy, used to look up themes, media queries, navigators, and inherited widgets.',
      category: 'Core Concepts',
      example: 'final theme = Theme.of(context);',
      hint: 'Tells Flutter "where" in the tree this widget lives.'
    },
    {
      id: 'flt-4',
      term: 'InheritedWidget & Provider',
      definition: 'A specialized base widget that allows descendant widgets to efficiently subscribe and listen to data propagation down the tree without manual prop drilling.',
      category: 'State Management',
      example: 'Provider.of<AuthModel>(context).currentUser',
      hint: 'Efficient data transmission from parent to distant children.'
    },
    {
      id: 'flt-5',
      term: 'Hot Reload vs Hot Restart',
      definition: 'Hot Reload injects updated source code into the running Dart VM preserving existing application state; Hot Restart destroys state and runs the app from main().',
      category: 'Developer Workflow',
      example: 'Pressing "r" preserves current cart items while tweaking button padding.',
      hint: 'Preserves state in sub-seconds vs complete app restart.'
    },
    {
      id: 'flt-6',
      term: 'RenderObject',
      definition: 'The internal low-level layout engine object that handles actual screen measuring, constraints propagation (box constraints), and GPU canvas painting.',
      category: 'Rendering Pipeline',
      example: 'RenderBox implements performLayout() and paint(PaintingContext context, Offset offset).',
      hint: 'The true worker behind widgets doing layout math and pixel rendering.'
    },
    {
      id: 'flt-7',
      term: 'Slivers',
      definition: 'Portions of a scrollable area that implement custom scrolling effects, collapsible app bars, floating headers, and lazy-loaded infinite viewports.',
      category: 'UI & Layout',
      example: 'CustomScrollView(slivers: [SliverAppBar(), SliverList()])',
      hint: 'Specialized scrollable slices that react to scroll offset.'
    },
    {
      id: 'flt-8',
      term: 'Dart Sound Null Safety',
      definition: 'A type-system guarantee ensuring variables cannot be null unless explicitly marked with a question mark (?), eliminating null pointer dereference crashes at runtime.',
      category: 'Dart Language',
      example: 'String name = "Alex"; // Non-nullable, String? bio = null; // Nullable',
      hint: 'Guarantees no "NoSuchMethodError: null pointer" in production.'
    }
  ],

  // 2: Powerful Business Writing
  2: [
    {
      id: 'bw-1',
      term: 'BLUF (Bottom Line Up Front)',
      definition: 'A military-originated business communication technique where conclusions, recommendations, and key decisions are presented in the very first sentence rather than buried at the end.',
      category: 'Structure & Framing',
      example: '“Recommendation: We should migrate server hosting to save $4,200/month by Q3.”',
      hint: 'Give busy executives the answer before the backstory.'
    },
    {
      id: 'bw-2',
      term: 'The Minto Pyramid Principle',
      definition: 'A structured writing framework developed by Barbara Minto where thoughts are grouped hierarchically: single top conclusion, supporting logical arguments, and underlying empirical data.',
      category: 'Structuring Arguments',
      example: 'Top: Expand into Europe; Mid-tier: Market size, regulatory readiness; Base: Revenue projections.',
      hint: 'Build arguments from the apex down to foundation data.'
    },
    {
      id: 'bw-3',
      term: 'Active Voice vs Passive Voice',
      definition: 'Active voice assigns clear agency and subject accountability (“The marketing team launched the campaign”) while passive voice obscures responsibility (“The campaign was launched”).',
      category: 'Style & Clarity',
      example: 'Active: "We completed the audit on Friday." Passive: "The audit was completed on Friday."',
      hint: 'Subject performs the action directly.'
    },
    {
      id: 'bw-4',
      term: 'Executive Scannability',
      definition: 'Designing memos and communications with clear subheaders, bullet points, bold keywords, and generous whitespace to enable comprehension in under 60 seconds.',
      category: 'Formatting',
      example: 'Breaking a 4-paragraph dense block into 3 bullet points with bold lead-ins.',
      hint: 'Format for readers on mobile phones between meetings.'
    },
    {
      id: 'bw-5',
      term: 'Cognitive Load Reduction',
      definition: 'Eliminating corporate jargon, filler qualifiers (“in order to”, “needless to say”), and nominalizations to reduce the mental effort required to absorb the message.',
      category: 'Editing Principles',
      example: 'Change "conduct an investigation into" to simply "investigate".',
      hint: 'Fewer words, zero fluff, maximum signal.'
    },
    {
      id: 'bw-6',
      term: 'Action-Oriented Call to Action (CTA)',
      definition: 'A closing statement specifying who does what by when, preventing ambiguity about ownership or project timelines.',
      category: 'Closing Communication',
      example: '“Action required: Please approve the attached vendor agreement by Thursday, 5 PM EST.”',
      hint: 'Who, what, and exact deadline.'
    }
  ],

  // 3: UI/UX Masterclass
  3: [
    {
      id: 'ux-1',
      term: "Fitts's Law",
      definition: 'A human-computer interaction principle stating that the time required to rapidly move to a target area is a function of the target distance and the target width.',
      category: 'HCI Principles',
      example: 'Primary CTA buttons placed near thumb reach with large hit targets (44px+) are faster to tap.',
      hint: 'Larger and closer targets are faster and easier to click.'
    },
    {
      id: 'ux-2',
      term: 'Affordance vs Signifier',
      definition: 'An affordance is what an object physically or logically allows a user to do; a signifier is any sensory signal (like a shadow, icon, or label) that communicates that affordance.',
      category: 'Design Psychology',
      example: 'A button affords clicking; the drop shadow and rounded border signify it is clickable.',
      hint: 'Affordance is the possibility; signifier is the clue.'
    },
    {
      id: 'ux-3',
      term: "Hick's Law",
      definition: 'The time it takes to make a decision increases logarithmically with the number and complexity of choices available to the user.',
      category: 'Cognitive Science',
      example: 'Filtering a navigation bar from 18 items down to 5 grouped categories dramatically speeds up user task completion.',
      hint: 'More choices = longer decision paralysis.'
    },
    {
      id: 'ux-4',
      term: 'Progressive Disclosure',
      definition: 'An interaction design pattern that sequences information and actions across several screens or steps to avoid overwhelming the user with complexity upfront.',
      category: 'Information Architecture',
      example: 'A multi-step checkout with Shipping, Payment, and Review separated into sequential phases.',
      hint: 'Show only what is necessary right now; reveal details on demand.'
    },
    {
      id: 'ux-5',
      term: 'Visual Hierarchy & Typographic Scale',
      definition: 'Organizing visual weight through contrast, scale, and positioning so viewers intuitively perceive the order of importance of elements.',
      category: 'Visual Design',
      example: 'H1 in bold 48px, followed by muted 16px body copy with 1.6 line height and generous margins.',
      hint: 'Guides the user’s eye naturally across the page.'
    },
    {
      id: 'ux-6',
      term: 'Heuristic Evaluation (Nielsen’s 10)',
      definition: 'A usability engineering method where evaluators examine an interface against established usability principles such as error prevention and consistency.',
      category: 'Usability Testing',
      example: 'Adding undo toast notifications aligns with "User control and freedom".',
      hint: 'Quick expert audit against proven usability rules.'
    },
    {
      id: 'ux-7',
      term: 'Micro-interactions',
      definition: 'Single-purpose, subtle animations or feedback loops (like a toggle flipping or heart bursting) that confirm state changes and delight users.',
      category: 'Motion Design',
      example: 'Subtle haptic vibration and scale animation when adding an item to the shopping cart.',
      hint: 'Small moments of tactile feedback.'
    },
    {
      id: 'ux-8',
      term: 'Gestalt Principle of Proximity',
      definition: 'Objects that are close to one another are perceived by the human brain as belonging to the same group or sharing common functionality.',
      category: 'Visual Perception',
      example: 'Placing an input label 4px above its textfield and 24px away from the preceding field.',
      hint: 'Closeness signals relatedness.'
    }
  ],

  // 4: Advanced Data Structures
  4: [
    {
      id: 'ds-1',
      term: 'Amortized Time Complexity',
      definition: 'The average time taken per operation over a worst-case sequence of operations, accounting for occasional costly operations across many cheap ones.',
      category: 'Algorithm Analysis',
      example: 'Appending to a dynamic array is O(1) amortized, even though resizing takes O(N).',
      hint: 'Smoothing out the cost of occasional expensive operations.'
    },
    {
      id: 'ds-2',
      term: 'Red-Black Tree',
      definition: 'A self-balancing binary search tree where each node stores an extra bit representing color (red or black), guaranteeing O(log N) search, insertion, and deletion.',
      category: 'Balanced Trees',
      example: 'Standard library implementations of std::map in C++ and TreeMap in Java use Red-Black trees.',
      hint: 'Color constraints prevent trees from becoming degenerate linked lists.'
    },
    {
      id: 'ds-3',
      term: 'Trie (Prefix Tree)',
      definition: 'A tree data structure used to store an associative array of strings where all descendants of a node share a common string prefix.',
      category: 'String Data Structures',
      example: 'Search engine autocompletion and spell-checker dictionary lookups.',
      hint: 'Prefix-sharing tree optimized for word lookups.'
    },
    {
      id: 'ds-4',
      term: 'Disjoint Set Union (Union-Find)',
      definition: 'A data structure that tracks a set of elements partitioned into non-overlapping subsets, supporting near O(1) near-constant time with path compression and union by rank.',
      category: 'Graph Algorithms',
      example: "Kruskal's Minimum Spanning Tree algorithm and connected components in networks.",
      hint: 'Quickly find whether two nodes belong to the same component.'
    },
    {
      id: 'ds-5',
      term: 'LRU Cache (Least Recently Used)',
      definition: 'A caching system combining a Hash Map for O(1) key lookups with a Doubly Linked List for O(1) evictions of the oldest accessed item.',
      category: 'Memory Systems',
      example: 'Web browser page caches, database buffer pools, and API memory caches.',
      hint: 'Evicts the item that hasn’t been accessed in the longest time.'
    },
    {
      id: 'ds-6',
      term: 'Bloom Filter',
      definition: 'A space-efficient probabilistic data structure used to test set membership; it may return false positives, but never false negatives.',
      category: 'Probabilistic Structures',
      example: 'Fast pre-check before expensive disk queries in databases like Cassandra and Bigtable.',
      hint: 'Definitely not in set, or might be in set.'
    }
  ],

  // 5: Agile Project Management
  5: [
    {
      id: 'ag-1',
      term: 'Sprint Burndown Chart',
      definition: 'A graphical representation of work remaining versus time remaining within a sprint iteration, used to forecast likelihood of sprint goal completion.',
      category: 'Scrum Metrics',
      example: 'A downward trending line showing story points decreasing each day towards 0.',
      hint: 'Visual day-by-day countdown of remaining story points.'
    },
    {
      id: 'ag-2',
      term: 'Definition of Done (DoD)',
      definition: 'An agreed formal checklist of criteria that every user story must satisfy (e.g. tests passing, peer review, docs updated) before it is deemed complete.',
      category: 'Quality Governance',
      example: 'Unit tests > 80%, code reviewed by 2 engineers, deployed to staging, and verified by QA.',
      hint: 'The unambiguous standard of when work is truly finished.'
    },
    {
      id: 'ag-3',
      term: 'Spike',
      definition: 'A time-boxed research or prototyping story used to gather information, explore technical feasibility, or clarify requirements before committing to estimation.',
      category: 'Sprint Planning',
      example: 'A 2-day spike to test whether WebSockets or SSE is best suited for our chat feature.',
      hint: 'Time-boxed investigation to reduce architectural risk.'
    },
    {
      id: 'ag-4',
      term: 'WIP Limits (Work In Progress)',
      definition: 'A core Kanban practice that caps the maximum number of task items allowed in any single workflow column at any given time to eliminate bottlenecks.',
      category: 'Kanban Flow',
      example: 'A limit of 3 tickets in the "In Code Review" column forces the team to review before starting new tickets.',
      hint: 'Stop starting, start finishing.'
    },
    {
      id: 'ag-5',
      term: 'Velocity',
      definition: 'A metric measuring the amount of story points an Agile development team completes during a typical sprint, used for future capacity planning.',
      category: 'Capacity Planning',
      example: 'If a team averaged 34 points across the last 4 sprints, their projected capacity for next sprint is ~34.',
      hint: 'Historical team throughput in story points.'
    },
    {
      id: 'ag-6',
      term: 'Sprint Retrospective',
      definition: 'A recurring collaborative meeting held at the end of every sprint where the team reflects on what went well, what stalled, and commits to continuous improvements.',
      category: 'Continuous Improvement',
      example: 'Mad / Sad / Glad or What went well / What can we improve / Action items.',
      hint: 'Team reflection to sharpen the saw.'
    }
  ],

  // 6: React Performance Tuning
  6: [
    {
      id: 'rp-1',
      term: 'Reconciliation & Virtual DOM Diffing',
      definition: 'The heuristic O(N) diffing algorithm React uses to compare the previous and new virtual DOM trees to determine the minimal set of real DOM mutations.',
      category: 'React Internals',
      example: 'Using unique and stable keys in lists so React only moves items rather than remounting all children.',
      hint: 'Computing the diff between old and new UI trees.'
    },
    {
      id: 'rp-2',
      term: 'React.memo & Shallow Comparison',
      definition: 'A higher-order component that skips re-rendering a component if its props have not changed according to a shallow referential equality check.',
      category: 'Component Optimization',
      example: 'const PureCard = React.memo(({ title }) => <div>{title}</div>);',
      hint: 'Prevents re-renders if incoming props remain identical.'
    },
    {
      id: 'rp-3',
      term: 'useMemo vs useCallback',
      definition: 'useMemo memoizes the computed result of an expensive function; useCallback memoizes the function definition itself to preserve reference equality across renders.',
      category: 'Hooks Optimization',
      example: 'const sortedData = useMemo(() => sortList(data), [data]); const handleClick = useCallback(() => ..., []);',
      hint: 'useMemo caches values; useCallback caches function references.'
    },
    {
      id: 'rp-4',
      term: 'useTransition & Concurrent Mode',
      definition: 'A React 18+ hook that marks state updates as non-urgent transitions, keeping the user interface responsive and interactive during heavy CPU re-renders.',
      category: 'Concurrent React',
      example: 'startTransition(() => { setFilterQuery(input); }); // Input remains snappy!',
      hint: 'Keeps typing and clicks responsive during heavy list filtering.'
    },
    {
      id: 'rp-5',
      term: 'Layout Thrashing',
      definition: 'A browser performance bottleneck that occurs when JavaScript repeatedly reads and writes to the DOM in rapid succession, forcing multiple synchronous layout reflows.',
      category: 'Browser Rendering',
      example: 'Reading element.offsetWidth immediately after changing element.style.width inside a loop.',
      hint: 'Alternating DOM reads and writes causes costly reflows.'
    },
    {
      id: 'rp-6',
      term: 'Context Splitting',
      definition: 'Dividing large monolithic React contexts into smaller, specialized contexts so components only re-render when the specific data slice they consume changes.',
      category: 'Architecture',
      example: 'Splitting UserContext into UserDataContext and UserActionsContext to prevent re-renders when actions don’t change.',
      hint: 'Separate fast-changing state from static actions in Context.'
    }
  ]
};

export function getFlashcardsForCourse(course: Course, modules?: Module[]): CourseFlashcard[] {
  if (COURSE_FLASHCARDS_MAP[course.id]) {
    return COURSE_FLASHCARDS_MAP[course.id];
  }

  // Generate dynamic flashcards based on modules and lessons if custom course
  if (modules && modules.length > 0) {
    const extracted: CourseFlashcard[] = [];
    modules.forEach((mod, modIdx) => {
      mod.lessons.forEach((l, lIdx) => {
        extracted.push({
          id: `dyn-${course.id}-${modIdx}-${lIdx}`,
          term: l.title.replace(/^Module \d+:?\s*/i, '').replace(/^Exercise:?\s*/i, ''),
          definition: l.description || `Core conceptual mastery of ${l.title} within ${course.title}.`,
          category: mod.title.split(':')[1]?.trim() || mod.title,
          example: `Practical application in ${course.category} workflows.`,
          hint: `Key focus of lesson ${lIdx + 1} in ${mod.title}.`
        });
      });
    });
    if (extracted.length > 0) return extracted.slice(0, 10);
  }

  // Fallback generic deck
  return [
    {
      id: `gen-1-${course.id}`,
      term: `${course.topic || 'Domain'} Fundamentals`,
      definition: `The core principles and architectural setup taught in ${course.title}.`,
      category: 'Foundations',
      example: `Applying best practices to real-world ${course.category} projects.`,
      hint: 'The foundational baseline of the course.'
    },
    {
      id: `gen-2-${course.id}`,
      term: 'Workflow Efficiency',
      definition: 'Techniques, shortcuts, and toolchain configurations that streamline productivity.',
      category: 'Productivity',
      example: 'Leveraging modern tooling to reduce iteration cycle times.',
      hint: 'Faster, higher quality output.'
    },
    {
      id: `gen-3-${course.id}`,
      term: 'Production Deployment',
      definition: 'The checklist, testing protocols, and verification steps necessary to ship reliable deliverables.',
      category: 'Deployment',
      example: 'Quality assurance checks and performance monitoring.',
      hint: 'Taking your project live.'
    }
  ];
}
