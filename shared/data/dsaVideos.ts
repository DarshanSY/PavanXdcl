// ─────────────────────────────────────────────────────────────
//  Data Structures & Algorithms (DSA) Structured Videos Data
// ─────────────────────────────────────────────────────────────

export interface VideoItem {
  url: string;
  label?: string;
  notesUrl?: string;
  leetcodeUrl?: string;
}

export interface DSAVideo {
  module: "Beginner + Rookie DSA module" | "Intermediate Module" | "Hard Module";
  topic: string;
  icon: string;
  description: string;
  videos: VideoItem[];
}

const dsaVideos: DSAVideo[] = [
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "Basics",
    "icon": "\ud83d\udce6",
    "description": "Programming basics, variables, loops, operators, and conditions.",
    "videos": [
      {
        "url": "https://youtu.be/JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/13NmAr3DIKfAhFTJgY-dC3QShygVsCS4ESBTx840mwZs/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/aEDBVEmhEgM",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/13NmAr3DIKfAhFTJgY-dC3QShygVsCS4ESBTx840mwZs/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/g2-c3Q0pl3U",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/13NmAr3DIKfAhFTJgY-dC3QShygVsCS4ESBTx840mwZs/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/nCa4rqbGwIk",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/13NmAr3DIKfAhFTJgY-dC3QShygVsCS4ESBTx840mwZs/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "Pattern Programming",
    "icon": "\ud83e\udde9",
    "description": "Build logical thinking using nested loops and patterns.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Overview Lecture",
        "notesUrl": "https://docs.google.com/document/d/1XNQoKJamncmfftehY-6crb-BqbC2_50a2GxzFB85dB0/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "ArrayList / List",
    "icon": "\ud83d\udcda",
    "description": "Dynamic arrays, basic array operations, and standard problems.",
    "videos": [
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/can-place-flowers/"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/increasing-triplet-subsequence/submissions/1948171683/"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/merge-strings-alternately/description/"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/description/"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/running-sum-of-1d-array/description/"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/16aYqZvsPRZO8yFEmD54EiVT7N5p73r8fZbvZWjYCxzI/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "HashMap / Dictionary",
    "icon": "\ud83d\uddc2\ufe0f",
    "description": "Hashing concepts, collision handling, and key-value pairings.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/find-all-duplicates-in-an-array/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/first-unique-character-in-a-string/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 7",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/happy-number/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 8",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/isomorphic-strings/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 9",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 10",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 11",
        "notesUrl": "https://docs.google.com/document/d/18jgIVm66p5G7ujDNGXUtSVm_bnoPYeBub96t-R78wR0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "Two Pointers",
    "icon": "\ud83d\udd0d",
    "description": "Optimize search/traversal from O(N^2) to O(N) using two endpoints.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1TzrUQJBvvKDAmCcPFSq5uX003UrfaEnTM12EwpwHY6Y/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/3sum/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1TzrUQJBvvKDAmCcPFSq5uX003UrfaEnTM12EwpwHY6Y/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/4sum/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1TzrUQJBvvKDAmCcPFSq5uX003UrfaEnTM12EwpwHY6Y/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/is-subsequence/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/1TzrUQJBvvKDAmCcPFSq5uX003UrfaEnTM12EwpwHY6Y/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-vowels-of-a-string/"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "Stack",
    "icon": "\ud83e\udd5e",
    "description": "LIFO structures, balancing parentheses, and stack properties.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1Zj5dcKD0R7h8V0SbR40p9OPmVTq9YS0PbIjtSMraTh0/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/description/"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "Maths",
    "icon": "\ud83d\udd22",
    "description": "Basic mathematical algorithms, gcd, modulo arithmetic.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Overview Lecture",
        "notesUrl": "https://docs.google.com/document/d/1okBkbOkvULeublAUOblSeUvroFXFwxYGCPlIsY4_xG0/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Beginner + Rookie DSA module",
    "topic": "LinkedList",
    "icon": "\ud83d\udd17",
    "description": "Singly and doubly linked lists, pointer adjustments, fast/slow pointers.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/middle-of-the-linked-list/submissions/1951325083/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/odd-even-linked-list/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/remove-linked-list-elements/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/1kP1T2adfNKDsEB9Osl91XoeYvFFdA4N16uW1DBVrgEk/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/sort-list/submissions/1951300970/"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Hackerrank Module",
    "icon": "\ud83c\udfc6",
    "description": "Solve foundational coding challenges to build logic and speed.",
    "videos": [
      {
        "url": "https://youtu.be/2pdtC_NHyW4",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/5aFrVIja-yo",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/8A_zR-MKMcQ",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/CdLI_xxL5jU",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/E42rsXUqIM4",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/GFcOn_HETrE",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/I5LJFCx6d4U",
        "label": "Lecture 7",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/IKOcCs3OoVc",
        "label": "Lecture 8",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/IcS-oQ-GGx4",
        "label": "Lecture 9",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/N5IaWebOBQI",
        "label": "Lecture 10",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/OP6ECt5RdvI",
        "label": "Lecture 11",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/PiVRgG6uCww",
        "label": "Lecture 12",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/R9MSSjx0m4Y",
        "label": "Lecture 13",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/Vc12yxkm4AI",
        "label": "Lecture 14",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/joKZAVFhB7A",
        "label": "Lecture 15",
        "notesUrl": "https://docs.google.com/document/d/1FQn2vzEWPBU8t731i49MHN4RqzGBStu_y2uOrEQ2Lgo/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Maths (Intermediate)",
    "icon": "\u26a1",
    "description": "Prime numbers, Sieve of Eratosthenes, and modular calculations.",
    "videos": [
      {
        "url": "https://youtu.be/QoXa1js3xY0",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1sa1ZgkW9F5bgoHphXJJS00s-HI51r9IemkR28GUDOK4/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/count-primes/description/"
      },
      {
        "url": "https://youtu.be/pcy2lzwOSMw",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1sa1ZgkW9F5bgoHphXJJS00s-HI51r9IemkR28GUDOK4/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Two Pointers + Binary Search",
    "icon": "\ud83c\udfaf",
    "description": "Search spaces, binary searching on arrays, and complex pointer problems.",
    "videos": [
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/3sum/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/4sum/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/is-subsequence/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-average-subarray-i/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 7",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 8",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 9",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/merge-sorted-array/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 10",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-vowels-of-a-string/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 11",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/search-insert-position/description/"
      },
      {
        "url": "https://youtu.be/T5UW4InGhls",
        "label": "Lecture 12",
        "notesUrl": "https://docs.google.com/document/d/19GqNKj50LvFKhkSwtPpy4M66obO-RE56ZMsdNlwxg8U/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Recursion",
    "icon": "\ud83c\udf00",
    "description": "Functional call stacks, backtracking, subsets, and permutations.",
    "videos": [
      {
        "url": "https://youtu.be/-W77g9Qqj-8",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/13_OYmmA-1QlfomOCax-SRjvfxY7GfEd5dvnuDax3EwQ/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/A4x-mZtIXT8",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/13_OYmmA-1QlfomOCax-SRjvfxY7GfEd5dvnuDax3EwQ/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/e2cw5jKXJZ8",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/13_OYmmA-1QlfomOCax-SRjvfxY7GfEd5dvnuDax3EwQ/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Dynamic Programming",
    "icon": "\ud83e\udde0",
    "description": "Optimize overlapping subproblems with memoization and tabulation.",
    "videos": [
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/fibonacci-number/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/increasing-triplet-subsequence/submissions/1948171683/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/n-th-tribonacci-number/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 7",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/description/"
      },
      {
        "url": "https://www.youtube.com/watch?v=JrLLP2U2D3s",
        "label": "Lecture 8",
        "notesUrl": "https://docs.google.com/document/d/1t2sCBhxerqQLZWT_-DCXTtcZYx5JVb8QmGWAW0sxvus/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/running-sum-of-1d-array/description/"
      }
    ]
  },
  {
    "module": "Intermediate Module",
    "topic": "Graphs",
    "icon": "\ud83d\udd78\ufe0f",
    "description": "Vertices, edges, breadth-first and depth-first searches, topological sorting.",
    "videos": [
      {
        "url": "https://youtu.be/EQVvMF5_MrM",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1zf88STlP8glsn_c49HT09jGhhNNi82QcCAdRtp2lfa4/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/re0UweGjf1s",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1zf88STlP8glsn_c49HT09jGhhNNi82QcCAdRtp2lfa4/edit?usp=sharing"
      },
      {
        "url": "https://youtu.be/t9dTYHbIzac",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1zf88STlP8glsn_c49HT09jGhhNNi82QcCAdRtp2lfa4/edit?usp=sharing"
      }
    ]
  },
  {
    "module": "Hard Module",
    "topic": "LeetCode 250",
    "icon": "\ud83d\udd25",
    "description": "Ultimate 250 LeetCode interview prep problems warmup.",
    "videos": [
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 1",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/"
      },
      {
        "url": "https://youtu.be/8ZzSt2wVHew",
        "label": "Lecture 2",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/submissions/2035438615"
      },
      {
        "url": "https://youtu.be/8s7b4w3zuOw",
        "label": "Lecture 3",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/"
      },
      {
        "url": "https://youtu.be/HXvP3JeFrHo",
        "label": "Lecture 4",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/submissions/2056911861"
      },
      {
        "url": "https://youtu.be/Kp4aB9KQaN0",
        "label": "Lecture 5",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/check-if-n-and-its-double-exist/"
      },
      {
        "url": "https://youtu.be/cWyKoAI3_ps",
        "label": "Lecture 6",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/check-if-n-and-its-double-exist/submissions/2035416111"
      },
      {
        "url": "https://youtu.be/e-vLidc3lPI",
        "label": "Lecture 7",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/"
      },
      {
        "url": "https://youtu.be/uT2KZjqi12o",
        "label": "Lecture 8",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/submissions/2059503567"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 9",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 10",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/submissions/2032944170"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 11",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/count-primes/"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 12",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/count-primes/submissions/2036552929"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 13",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/detect-capital/"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 14",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/detect-capital/submissions/2034199648"
      },
      {
        "url": "https://youtu.be/8TKeqEQ9Z8M",
        "label": "Lecture 15",
        "notesUrl": "https://docs.google.com/document/d/1Xxqw8I9N9Y56YIAn1LW5aXaQSwo8_0rlVyF4QNlbs3o/edit?usp=sharing",
        "leetcodeUrl": "https://leetcode.com/problems/duplicate-zeros/"
      }
    ]
  }
];

export default dsaVideos;
