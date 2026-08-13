// ─────────────────────────────────────────────────────────────
//  Full Stack Video Data
//  Each topic has an array of videos. Each video can optionally
//  have a notesUrl (Google Docs) and a leetcodeUrl.
// ─────────────────────────────────────────────────────────────

export interface VideoItem {
  url: string;
  label?: string;
  notesUrl?: string;
  leetcodeUrl?: string;
}

export interface FullStackVideo {
  topic: string;
  description: string;
  videos: VideoItem[];
}

const fullstackVideos: FullStackVideo[] = [
  {
    topic: "HTML",
    description: "Complete HTML fundamentals — tags, semantics, forms, and accessibility.",
    videos: [
      { url: "https://youtu.be/gtG-O3omj98", label: "Part 1" },
      { url: "https://youtu.be/XrI4vjBdEas", label: "Part 2" },
      { url: "https://youtu.be/h1WUWlHZyuY", label: "Part 3" },
      { url: "https://youtu.be/36dLsjWVCuo", label: "Part 4" },
      { url: "https://youtu.be/X2eWd54iNts", label: "Part 5" },
    ],
  },
  {
    topic: "CSS",
    description: "CSS from basics to advanced — flexbox, grid, animations, and responsive design.",
    videos: [
      { url: "https://youtu.be/F_lAfM7BJIk", label: "Part 1" },
      { url: "https://youtu.be/AWwlDaKYAVw", label: "Part 2" },
      { url: "https://youtu.be/N6yYawia8QA", label: "Part 3" },
      { url: "https://youtu.be/uabS3JIAtWE", label: "Part 4" },
      { url: "https://youtu.be/0fYRDPFblks", label: "Part 5" },
      { url: "https://youtu.be/NC8ynlEP-A0", label: "Part 6" },
    ],
  },
  {
    topic: "JavaScript",
    description: "Full JavaScript course — ES6+, async, DOM manipulation, and backend basics.",
    videos: [
      { url: "https://www.youtube.com/watch?v=eUAqbFn64a0", label: "Part 1" },
      { url: "https://www.youtube.com/watch?v=A2SV_bf0yl0", label: "Part 2" },
      { url: "https://www.youtube.com/watch?v=TpcTsba0B4E", label: "Part 3" },
      { url: "https://youtu.be/-r8O8dIGYYA",               label: "Part 4" },
      {
        url: "https://youtu.be/_cXTNp0qnu8",
        label: "Part 5",
        notesUrl: "https://docs.google.com/document/d/1orbh9tZehyZcaBSqzCgh08AIolMzk_1tj5z5K0OLR5E/edit?usp=sharing",
      },
      {
        url: "https://youtu.be/_7hc4xEcUZw",
        label: "Part 6",
        notesUrl: "https://docs.google.com/document/d/1sMBexmWstSGRzzThGfqId898WSNgCR_aBjpi2XbnSLY/edit?usp=sharing",
        leetcodeUrl: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/submissions/1975554261",
      },
      {
        url: "https://youtu.be/xoSbFE82aP0",
        label: "Part 7",
        notesUrl: "https://docs.google.com/document/d/13S0wBMe8TfIGk0OvqMYSagZ_y05ie1d5vX762DjZ3nk/edit?usp=sharing",
      },
      {
        url: "https://youtu.be/ttBqz9aiOew",
        label: "Part 8",
        notesUrl: "https://docs.google.com/document/d/1BQXUy1dMRA30Fix6do7LWLOdWq19Unlw3oZ419FFWDc/edit?usp=sharing",
      },
    ],
  },
  {
    topic: "ReactJS",
    description: "React from scratch — hooks, state management, routing, and full project builds.",
    videos: [
      // ← paste ReactJS video links here
    ],
  },
  {
    topic: "Core Java/ Core Python",
    description: "Core Java and Python for placements — OOP, collections, and interview patterns.",
    videos: [
      // ← paste Core Java/Python video links here
    ],
  },
  {
    topic: "Advanced Subjects",
    description: "Hibernate, Spring Boot, Django and other advanced frameworks in depth.",
    videos: [
      // ← paste Advanced Subjects video links here
    ],
  },
  {
    topic: "DataBase",
    description: "MySQL and Oracle SQL — queries, joins, normalization, and database design.",
    videos: [
      // ← paste DataBase video links here
    ],
  },
  {
    topic: "Full Stack Projects",
    description: "End-to-end full stack projects — build and deploy real-world applications.",
    videos: [
      // ← paste Full Stack Projects video links here
    ],
  },
];

export default fullstackVideos;
