// Run this once to populate the DSAProblem collection with sample problems.
// Usage: node seed/seedProblems.js

require('dotenv').config();
const mongoose = require('mongoose');
const DSAProblem = require('../models/DSAProblem');

const problems = [
  {
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'easy',
    prompt:
      'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
    expectedApproach:
      'Use a hash map to store each number and its index while iterating. For each number, check if (target - number) already exists in the map. This gives O(n) time and O(n) space, much better than the brute force O(n^2) nested loop approach.',
    tags: ['hash map', 'array'],
    estimatedMins: 8,
  },
  {
    title: 'Reverse a Linked List',
    topic: 'Linked Lists',
    difficulty: 'easy',
    prompt: 'Given the head of a singly linked list, reverse the list and return the new head.',
    expectedApproach:
      'Iterate through the list using three pointers: previous, current, and next. At each step, reverse the current node\'s pointer to point to previous, then move all pointers one step forward. O(n) time, O(1) space. Can also be done recursively but that uses O(n) stack space.',
    tags: ['linked list', 'pointers'],
    estimatedMins: 10,
  },
  {
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'medium',
    prompt:
      'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    expectedApproach:
      'Use BFS with a queue. Start by adding the root to the queue. For each level, process all nodes currently in the queue, add their children to the queue for the next level, and collect their values into the result. O(n) time and space.',
    tags: ['tree', 'bfs', 'queue'],
    estimatedMins: 12,
  },
  {
    title: 'Detect Cycle in a Linked List',
    topic: 'Linked Lists',
    difficulty: 'medium',
    prompt: 'Given the head of a linked list, determine if the linked list has a cycle in it.',
    expectedApproach:
      'Use Floyd\'s cycle detection (tortoise and hare). Use two pointers, slow moving one step and fast moving two steps. If there is a cycle, the fast pointer will eventually meet the slow pointer. O(n) time, O(1) space.',
    tags: ['linked list', 'two pointers'],
    estimatedMins: 10,
  },
  {
    title: 'Valid Parentheses',
    topic: 'Arrays',
    difficulty: 'easy',
    prompt:
      'Given a string containing just the characters (, ), {, }, [ and ], determine if the input string is valid (every opening bracket has a matching closing bracket in the correct order).',
    expectedApproach:
      'Use a stack. Push opening brackets onto the stack. When a closing bracket is encountered, check if it matches the top of the stack (pop if it does). If the stack is empty at the end, the string is valid. O(n) time and space.',
    tags: ['stack', 'string'],
    estimatedMins: 8,
  },
  {
    title: 'Number of Connected Components in a Graph',
    topic: 'Graphs',
    difficulty: 'medium',
    prompt:
      'Given n nodes labeled 0 to n-1 and a list of undirected edges, find the number of connected components in the graph.',
    expectedApproach:
      'Build an adjacency list, then run BFS or DFS from each unvisited node, incrementing a counter each time a new traversal starts. Mark nodes visited as you go. O(V+E) time, O(V+E) space.',
    tags: ['graph', 'bfs', 'dfs'],
    estimatedMins: 12,
  },
  {
    title: 'Shortest Path in an Unweighted Graph',
    topic: 'Graphs',
    difficulty: 'medium',
    prompt:
      'Given an unweighted graph and a source node, find the shortest distance from the source to all other nodes.',
    expectedApproach:
      'Use BFS starting from the source node. BFS naturally explores nodes in order of increasing distance since all edges have equal weight. Track distances in an array, initialized to infinity except the source which is 0. O(V+E) time.',
    tags: ['graph', 'bfs', 'shortest path'],
    estimatedMins: 12,
  },
  {
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'easy',
    prompt:
      'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    expectedApproach:
      'This is essentially the Fibonacci sequence. dp[i] = dp[i-1] + dp[i-2], since to reach step i you either came from step i-1 (one step) or step i-2 (two steps). Base cases dp[1]=1, dp[2]=2. O(n) time, can be optimized to O(1) space.',
    tags: ['dp', 'fibonacci'],
    estimatedMins: 8,
  },
  {
    title: 'Longest Common Subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'medium',
    prompt:
      'Given two strings text1 and text2, return the length of their longest common subsequence (a sequence that appears in both, not necessarily contiguous).',
    expectedApproach:
      'Build a 2D DP table where dp[i][j] represents the LCS length of text1[0..i] and text2[0..j]. If characters match, dp[i][j] = dp[i-1][j-1] + 1, otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]). O(m*n) time and space.',
    tags: ['dp', 'strings'],
    estimatedMins: 14,
  },
  {
    title: 'CPU Scheduling - First Come First Served vs SJF',
    topic: 'OS',
    difficulty: 'medium',
    prompt:
      'Explain how First Come First Served (FCFS) and Shortest Job First (SJF) CPU scheduling algorithms work, and discuss the main drawback of each.',
    expectedApproach:
      'FCFS executes processes in arrival order using a simple FIFO queue - simple but can cause the "convoy effect" where short processes wait behind long ones. SJF picks the process with the smallest burst time next, minimizing average waiting time, but can cause starvation of longer processes and requires knowing burst times in advance, which is often impractical.',
    tags: ['os', 'scheduling'],
    estimatedMins: 10,
  },
  {
    title: 'Deadlock Conditions and Prevention',
    topic: 'OS',
    difficulty: 'medium',
    prompt:
      'What are the four necessary conditions for a deadlock to occur, and name one strategy to prevent deadlocks.',
    expectedApproach:
      'The four Coffman conditions are: Mutual Exclusion (resources cannot be shared), Hold and Wait (a process holds resources while waiting for others), No Preemption (resources cannot be forcibly taken), and Circular Wait (a cycle of processes each waiting for a resource held by the next). Prevention strategies include breaking any one condition - e.g. resource ordering to prevent circular wait, or using the Banker\'s Algorithm to avoid unsafe resource allocation states.',
    tags: ['os', 'deadlock'],
    estimatedMins: 10,
  },
  {
    title: 'Normalization - 1NF, 2NF, 3NF',
    topic: 'DBMS',
    difficulty: 'medium',
    prompt:
      'Explain the difference between First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF) with a brief example of what each eliminates.',
    expectedApproach:
      '1NF requires atomic values in each column (no repeating groups or arrays). 2NF requires 1NF plus no partial dependency - every non-key attribute must depend on the whole primary key, not just part of it (relevant for composite keys). 3NF requires 2NF plus no transitive dependency - non-key attributes should depend only on the primary key, not on other non-key attributes. Each level removes a specific type of redundancy that can cause update anomalies.',
    tags: ['dbms', 'normalization'],
    estimatedMins: 10,
  },
  {
    title: 'ACID Properties of Transactions',
    topic: 'DBMS',
    difficulty: 'easy',
    prompt: 'What do the ACID properties stand for in database transactions, and briefly explain each.',
    expectedApproach:
      'Atomicity - a transaction is all-or-nothing, either fully completes or fully rolls back. Consistency - a transaction brings the database from one valid state to another, respecting all rules/constraints. Isolation - concurrent transactions do not interfere with each other, as if executed sequentially. Durability - once committed, changes persist even after a system failure.',
    tags: ['dbms', 'transactions'],
    estimatedMins: 8,
  },
  {
    title: 'TCP vs UDP',
    topic: 'CN',
    difficulty: 'easy',
    prompt: 'Compare TCP and UDP - explain the key differences and when you would use each.',
    expectedApproach:
      'TCP is connection-oriented, reliable, ensures ordered delivery via acknowledgments and retransmission, but has higher overhead - used for web browsing, file transfer, email. UDP is connectionless, faster, no guarantee of delivery or order, lower overhead - used for video streaming, DNS, online gaming where speed matters more than perfect reliability.',
    tags: ['cn', 'protocols'],
    estimatedMins: 8,
  },
  {
    title: 'What Happens When You Type a URL (DNS + TCP Handshake)',
    topic: 'CN',
    difficulty: 'medium',
    prompt:
      'Briefly explain what happens at the network level between typing a URL in a browser and the page starting to load - focus on DNS resolution and the TCP handshake.',
    expectedApproach:
      'First, the browser checks its DNS cache, then queries a DNS resolver to translate the domain name into an IP address (going through recursive resolvers, root, TLD, and authoritative name servers if needed). Once the IP is known, the browser initiates a TCP three-way handshake with the server (SYN, SYN-ACK, ACK) to establish a connection. After the connection is established, an HTTP request is sent (often over TLS if HTTPS) and the server responds with the page data.',
    tags: ['cn', 'dns', 'tcp'],
    estimatedMins: 12,
  },
  {
    title: 'Design a Rate Limiter',
    topic: 'System Design',
    difficulty: 'medium',
    prompt:
      'How would you design a rate limiter that allows a maximum of N requests per user per minute?',
    expectedApproach:
      'Use a sliding window or token bucket algorithm stored in a fast key-value store like Redis. For each user, store a counter with a TTL of 60 seconds (fixed window) or track timestamps of recent requests (sliding window) for more accuracy. On each request, increment/check the counter - if it exceeds N, reject with HTTP 429. Token bucket is often preferred as it allows bursts while maintaining an average rate.',
    tags: ['system design', 'rate limiting'],
    estimatedMins: 15,
  },
  {
    title: 'Design a URL Shortener',
    topic: 'System Design',
    difficulty: 'hard',
    prompt:
      'How would you design a URL shortening service like bit.ly? Cover the core data model and how short codes are generated.',
    expectedApproach:
      'Core data model: a table mapping short_code -> original_url, with optional metadata like creation date and click count. Short codes can be generated via base62 encoding of an auto-incrementing ID, or via hashing the URL and taking the first N characters (handling collisions). On read, look up the short code in a fast cache (Redis) first, falling back to the database, then issue an HTTP redirect. For scale, consider sharding by short code and using a CDN/cache layer for hot URLs.',
    tags: ['system design', 'url shortener'],
    estimatedMins: 15,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await DSAProblem.deleteMany({});
    await DSAProblem.insertMany(problems);

    console.log(`Seeded ${problems.length} DSA problems successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
