import type { MilestoneCategory } from '../types';

export interface MilestoneGuidance {
  title: string;
  whatItMeans: string;
  expectedBehaviours: string[];
  tips: string[];
  nextSteps: string[];
  autismSupport: string[];
  links: Array<{ label: string; url: string }>;
}

export const MILESTONE_GUIDANCE: Record<MilestoneCategory, MilestoneGuidance> = {
  speech: {
    title: 'Speech and language development',
    whatItMeans: 'These milestones help you track communication progress such as sounds, words, understanding, and two-way interaction.',
    expectedBehaviours: ['Responds to name', 'Uses words or symbols to request', 'Builds vocabulary over time'],
    tips: ['Model short and clear phrases', 'Use visual supports and gestures', 'Pause to give processing time'],
    nextSteps: ['Record examples of communication attempts', 'Share patterns with school/therapy teams', 'Discuss concerns early with a GP or SLT'],
    autismSupport: ['Accept AAC, gestures, and echolalia as valid communication', 'Reduce background noise before communication tasks'],
    links: [{ label: 'NHS: Speech and language delay', url: 'https://www.nhs.uk/conditions/developmental-language-disorder/' }],
  },
  motor: {
    title: 'Motor development',
    whatItMeans: 'Tracks fine and gross motor progress such as coordination, balance, hand control, and movement confidence.',
    expectedBehaviours: ['Improving balance', 'Improving hand coordination', 'Developing everyday movement routines'],
    tips: ['Break tasks into short steps', 'Use repetition and predictable routines', 'Offer movement breaks'],
    nextSteps: ['Log what helps and what is difficult', 'Use OT/physio recommendations in school and home'],
    autismSupport: ['Offer proprioceptive input before difficult tasks', 'Allow extra transition time'],
    links: [{ label: 'NHS: Child development stages', url: 'https://www.nhs.uk/start-for-life/baby/development/' }],
  },
  social: {
    title: 'Social development',
    whatItMeans: 'Tracks relationships, shared attention, emotional understanding, and social participation.',
    expectedBehaviours: ['Shows interest in others', 'Shares attention to activities', 'Uses social routines'],
    tips: ['Use social stories', 'Practise turn-taking in short activities', 'Prepare for change with visual plans'],
    nextSteps: ['Capture successful social contexts', 'Share observations with school/SEND team'],
    autismSupport: ['Respect different social styles', 'Use identity-affirming language and avoid forced masking'],
    links: [{ label: 'NHS: Autism overview', url: 'https://www.nhs.uk/conditions/autism/' }],
  },
  cognitive: {
    title: 'Cognitive and learning development',
    whatItMeans: 'Tracks attention, memory, problem-solving, and understanding of routines and concepts.',
    expectedBehaviours: ['Sustains attention for longer', 'Follows increasingly complex routines', 'Applies learned strategies'],
    tips: ['Chunk tasks into manageable steps', 'Use clear visual sequencing', 'Repeat key concepts in context'],
    nextSteps: ['Log what supports attention and retention', 'Review support plans regularly'],
    autismSupport: ['Provide low-demand recovery time', 'Avoid overload by limiting simultaneous instructions'],
    links: [{ label: 'NHS: Learning disability support', url: 'https://www.nhs.uk/conditions/learning-disabilities/' }],
  },
  self_care: {
    title: 'Self-care and independence',
    whatItMeans: 'Tracks everyday skills such as dressing, eating, hygiene, and toilet confidence.',
    expectedBehaviours: ['More independent participation', 'Improved routine completion', 'Reduced support prompts'],
    tips: ['Use visual checklists', 'Celebrate partial success', 'Offer adaptive tools where needed'],
    nextSteps: ['Track prompt levels over time', 'Coordinate strategies between home and school'],
    autismSupport: ['Account for sensory barriers (textures, noise, smell)', 'Keep routines predictable and explicit'],
    links: [{ label: 'NHS: Toilet training advice', url: 'https://www.nhs.uk/conditions/baby/babys-development/potty-training-and-bedwetting/how-to-potty-train/' }],
  },
  routine: {
    title: 'Routine and transition skills',
    whatItMeans: 'Tracks consistency with routines and ability to manage transitions and change.',
    expectedBehaviours: ['Follows known routines', 'Transitions with fewer prompts', 'Uses coping supports'],
    tips: ['Preview daily plan in advance', 'Use timers/first-then prompts', 'Build in calming transition points'],
    nextSteps: ['Record transition triggers', 'Align transition supports across settings'],
    autismSupport: ['Warn before transitions and avoid sudden changes', 'Provide clear safe-regulation options'],
    links: [{ label: 'NHS: Autism support and adjustments', url: 'https://www.nhs.uk/conditions/autism/support/' }],
  },
  sensory: {
    title: 'Sensory processing',
    whatItMeans: 'Tracks sensory preferences, triggers, and regulation needs across home, school, and therapy settings.',
    expectedBehaviours: ['Identifiable sensory triggers', 'More predictable regulation strategies', 'Improved comfort in adapted environments'],
    tips: ['Track trigger + response + recovery time', 'Offer sensory tools proactively', 'Keep environments adjustable'],
    nextSteps: ['Share sensory profile updates with care team', 'Review coping kit regularly'],
    autismSupport: ['Validate sensory distress quickly', 'Use personalised sensory accommodations'],
    links: [{ label: 'NHS: Autism and sensory differences', url: 'https://www.nhs.uk/conditions/autism/signs/adults/' }],
  },
  other: {
    title: 'Custom milestone',
    whatItMeans: 'Use this for educational, therapy, or family goals outside the default categories.',
    expectedBehaviours: ['Clearly defined measurable target', 'Trackable date window', 'Shared understanding across caregivers'],
    tips: ['Use specific milestone names', 'Add context in notes', 'Link to action plan next steps'],
    nextSteps: ['Review and refine goal after each update', 'Add follow-up milestone when achieved'],
    autismSupport: ['Use strengths-based framing and clear expectations'],
    links: [{ label: 'NHS homepage', url: 'https://www.nhs.uk/' }],
  },
};
