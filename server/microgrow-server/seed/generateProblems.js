// Generates a large bank of original DSA problems using Groq AI and saves them to MongoDB.
// This avoids copyright issues from scraping LeetCode/other sites - every problem is
// freshly AI-generated.
//
// Usage: node seed/generateProblems.js
//
// Note: This makes many API calls to Groq (one per problem). With the free tier
// rate limits, this may take a few minutes. The script pauses briefly between
// requests to avoid hitting rate limits.

require('dotenv').config();
const mongoose = require('mongoose');
const DSAProblem = require('../models/DSAProblem');
const { generateDSAProblem } = require('../services/groq.service');

const TOPICS = [
  'Arrays',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'OS',
  'DBMS',
  'CN',
  'System Design',
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

// How many problems to generate per (topic x difficulty) combination
const PROBLEMS_PER_COMBO = 5;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const newProblems = [];
    let count = 0;
    const total = TOPICS.length * DIFFICULTIES.length * PROBLEMS_PER_COMBO;

    for (const topic of TOPICS) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < PROBLEMS_PER_COMBO; i++) {
          count++;
          console.log(`[${count}/${total}] Generating ${difficulty} problem for ${topic}...`);

          try {
            const result = await generateDSAProblem(topic, difficulty);

            newProblems.push({
              title: result.title,
              topic,
              difficulty,
              prompt: result.prompt,
              expectedApproach: result.expectedApproach,
              tags: result.tags || [],
              estimatedMins: result.estimatedMins || 10,
            });
          } catch (err) {
            console.error(`  Failed: ${err.message} - skipping`);
          }

          // Small delay to be gentle on rate limits
          await sleep(500);
        }
      }
    }

    console.log(`\nGenerated ${newProblems.length} problems. Inserting into database...`);

    // Append to existing problems (doesn't delete what's already there)
    await DSAProblem.insertMany(newProblems);

    const totalInDb = await DSAProblem.countDocuments();
    console.log(`Done! Total problems in database: ${totalInDb}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

generate();
