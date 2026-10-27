const Note = require('../models/Note');

const seedStarterNotesForUser = async (userId) => {
  const starterNotes = [
    {
      userId,
      title: 'Machine Learning Notes',
      icon: 'document',
      tags: ['Study'],
      color: 'amber',
      isPinned: true,
      isFavorite: true,
      plainText: 'Types of learning, key algorithms, evaluation metrics. Machine Learning is a subset of Artificial Intelligence that enables systems to learn from data...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '1. What is Machine Learning?' }]
          },
          {
            type: 'paragraph',
            attrs: { class: 'callout-box' },
            content: [
              {
                type: 'text',
                text: 'Machine Learning is a subset of Artificial Intelligence that enables systems to learn from data and make decisions without being explicitly programmed.'
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '2. Types of Learning' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '• Supervised Learning: ' },
              { type: 'text', text: 'Learn from labeled data (input → output). Examples: Linear Regression, Decision Trees.' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '• Unsupervised Learning: ' },
              { type: 'text', text: 'Find hidden patterns in unlabeled data. Clustering, Dimensionality Reduction. Examples: K-Means, PCA.' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: '• Reinforcement Learning: ' },
              { type: 'text', text: 'Learn through trial and error using rewards. Agent, Environment, Reward. Examples: Q-Learning, Deep Q-Networks.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '3. Machine Learning Workflow' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '1. Collect Data  →  2. Preprocess  →  3. Train Model  →  4. Evaluate  →  5. Deploy' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '4. Evaluation Metrics' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Classification: ' },
              { type: 'text', text: 'Accuracy, Precision, Recall, F1-Score, Confusion Matrix' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Regression: ' },
              { type: 'text', text: 'MAE, MSE, RMSE, R² Score' }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Clustering: ' },
              { type: 'text', text: 'Silhouette Score, Davies-Bouldin Index' }
            ]
          }
        ]
      }
    },
    {
      userId,
      title: 'Project Ideas',
      icon: 'lightbulb',
      tags: ['Ideas', 'Work'],
      color: 'default',
      isPinned: false,
      isFavorite: true,
      plainText: 'Note taking app, AI recipe generator, interactive markdown diagram tool, personal knowledge graph...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Upcoming Projects & Prototypes' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Notely - Elegant MERN Notes application with rich text editing.' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AI Recipe Generator based on pantry ingredients.' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Personal Knowledge Base with backlinks and graphs.' }] }]
              }
            ]
          }
        ]
      }
    },
    {
      userId,
      title: 'Workout Plan',
      icon: 'dumbbell',
      tags: ['Personal'],
      color: 'default',
      isPinned: false,
      isFavorite: false,
      plainText: 'Push Pull Legs split, diet plan, hydration goals, progressive overload schedule...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Weekly Routine (PPL)' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Monday: Push (Chest, Shoulders, Triceps)' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Tuesday: Pull (Back, Biceps, Rear Delts)' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Wednesday: Legs & Core' }]
          }
        ]
      }
    },
    {
      userId,
      title: 'Web Development Topics',
      icon: 'laptop',
      tags: ['Study', 'Work'],
      color: 'sky',
      isPinned: false,
      isFavorite: false,
      plainText: 'React 18/19, Node.js internals, MongoDB aggregations, System Design principles, caching layers...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Core Architecture Concepts' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'REST API best practices & idempotency' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'JWT secure cookies vs tokens in headers' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'TipTap & Prosemirror rich text state management' }] }]
              }
            ]
          }
        ]
      }
    },
    {
      userId,
      title: 'Books to Read',
      icon: 'book',
      tags: ['Personal', 'Study'],
      color: 'default',
      isPinned: false,
      isFavorite: false,
      plainText: 'Clean Code, Designing Data-Intensive Applications, The Psychology of Money, Atomic Habits...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Reading List 2026' }]
          },
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                attrs: { checked: true },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Atomic Habits by James Clear' }] }]
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Designing Data-Intensive Applications' }] }]
              },
              {
                type: 'taskItem',
                attrs: { checked: false },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'The Psychology of Money' }] }]
              }
            ]
          }
        ]
      }
    },
    {
      userId,
      title: 'Travel Plan',
      icon: 'plane',
      tags: ['Personal'],
      color: 'emerald',
      isPinned: false,
      isFavorite: false,
      plainText: 'Places to visit, budget, itinerary, packing list, photography gear...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Kyoto & Alps Itinerary' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Day 1-3: Traditional temples, bamboo forest, culinary tour.' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Day 4-7: Mountain hiking, hot springs, scenic train.' }]
          }
        ]
      }
    },
    {
      userId,
      title: 'Recipes to Try',
      icon: 'bowl',
      tags: ['Personal'],
      color: 'rose',
      isPinned: false,
      isFavorite: false,
      plainText: 'High protein meals, smoothie bowls, homemade sourdough, ramen broth...',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Quick Healthy Meals' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Avocado, poached egg & sourdough toast' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Blueberry protein oats with almond butter' }] }]
              }
            ]
          }
        ]
      }
    }
  ];

  await Note.insertMany(starterNotes);
};

module.exports = { seedStarterNotesForUser };
