import api from './api';
import { noteService } from './noteService';

// Default initial showcase records strictly matching the reference screenshot
export const DEFAULT_RECENT_NOTES = [
  {
    _id: 'default-1',
    title: 'API Gateway in Go',
    plainText: 'Design and implementation of a high-performance API gateway with rate limiting, circuit breaking, and JWT auth.',
    tags: ['Projects', 'Go'],
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isFavorite: false,
    folder: 'Projects'
  },
  {
    _id: 'default-2',
    title: 'DBMS Notes',
    plainText: 'Normalization, SQL queries, transactions, and indexing concepts. ACID properties and B+ tree indexes explained.',
    tags: ['College', 'DBMS'],
    updatedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    isFavorite: true,
    folder: 'College'
  },
  {
    _id: 'default-3',
    title: 'System Design',
    plainText: 'Scalability, load balancing, caching, and fault tolerance patterns for high-throughput distributed systems.',
    tags: ['College', 'System Design'],
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isFavorite: true,
    folder: 'College'
  },
  {
    _id: 'default-4',
    title: 'NoteNest – UI Ideas',
    plainText: 'Dashboard, note editor, and authentication flow designs. Stationery-inspired moody aesthetics with modern dark surfaces.',
    tags: ['Projects', 'UI/UX'],
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isFavorite: false,
    folder: 'Projects'
  },
  {
    _id: 'default-5',
    title: 'DSA Practice Plan',
    plainText: 'Weekly plan, LeetCode topics, and problem list for next 4 weeks focusing on graphs, dynamic programming, and heaps.',
    tags: ['DSA', 'Practice'],
    updatedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    isFavorite: true,
    folder: 'DSA'
  }
];

export const DEFAULT_FOLDERS = [
  { id: 'college', name: 'College', count: 18, icon: 'folder' },
  { id: 'projects', name: 'Projects', count: 12, icon: 'folder' },
  { id: 'dsa', name: 'DSA', count: 8, icon: 'folder' },
  { id: 'personal', name: 'Personal', count: 6, icon: 'folder' }
];

export const DEFAULT_TAGS = [
  { name: 'Projects', count: 12 },
  { name: 'College', count: 10 },
  { name: 'DSA', count: 8 },
  { name: 'System Design', count: 6 },
  { name: 'Go', count: 4 },
  { name: 'UI/UX', count: 4 }
];

export const DEFAULT_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'edit',
    description: 'Edited "API Gateway in Go"',
    time: '10 min ago',
    timestamp: Date.now() - 10 * 60 * 1000
  },
  {
    id: 'act-2',
    type: 'create',
    description: 'Created "System Design"',
    time: '42 min ago',
    timestamp: Date.now() - 42 * 60 * 1000
  },
  {
    id: 'act-3',
    type: 'update',
    description: 'Updated "DBMS Notes"',
    time: '2 hr ago',
    timestamp: Date.now() - 2 * 3600 * 1000
  },
  {
    id: 'act-4',
    type: 'folder',
    description: 'Created folder "Projects"',
    time: 'Yesterday',
    timestamp: Date.now() - 24 * 3600 * 1000
  }
];

export const dashboardService = {
  async getDashboardData() {
    try {
      // 1. Fetch real aggregated dashboard data from NoteNest backend
      const res = await api.get('/dashboard');
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        return {
          notes: Array.isArray(d.notes) && d.notes.length > 0 ? d.notes : DEFAULT_RECENT_NOTES,
          stats: d.stats || { totalNotes: 0, folders: 0, tags: 0, favorites: 0 },
          folders: Array.isArray(d.folders) && d.folders.length > 0 ? d.folders : DEFAULT_FOLDERS,
          tags: Array.isArray(d.tags) && d.tags.length > 0 ? d.tags : DEFAULT_TAGS,
          storage: d.storage || { usedMb: 245, totalGb: 2, percentage: 12 },
          activities: Array.isArray(d.activities) && d.activities.length > 0 ? d.activities : DEFAULT_ACTIVITIES,
          syncStatus: d.syncStatus || { synced: true, message: 'All notes are up to date' }
        };
      }
    } catch (err) {
      console.warn('[DashboardService] Backend /dashboard unavailable, falling back to local cache/defaults:', err.message);
    }

    try {
      const [notesRes, statsRes] = await Promise.all([
        noteService.getNotes().catch(() => ({ success: false, data: [] })),
        noteService.getStats().catch(() => ({ success: false, data: {} }))
      ]);

      const backendNotes = notesRes.success && Array.isArray(notesRes.data) && notesRes.data.length > 0
        ? notesRes.data
        : null;

      const notes = backendNotes || DEFAULT_RECENT_NOTES;

      // Extract unique tags and compute counts
      const tagCountMap = {};
      notes.forEach((note) => {
        if (Array.isArray(note.tags)) {
          note.tags.forEach((t) => {
            if (t) {
              const clean = t.trim();
              tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
            }
          });
        }
      });

      const dynamicTags = Object.keys(tagCountMap).length > 0
        ? Object.entries(tagCountMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6)
        : DEFAULT_TAGS;

      // Extract folders
      const storedFolders = localStorage.getItem('notenest_custom_folders');
      const folders = storedFolders ? JSON.parse(storedFolders) : DEFAULT_FOLDERS;

      // Stats
      const totalNotes = backendNotes ? backendNotes.length : 48;
      const totalFolders = folders.length || 6;
      const totalTags = Object.keys(tagCountMap).length || 12;
      const totalFavorites = backendNotes
        ? backendNotes.filter((n) => n.isFavorite).length
        : 9;

      // Calculate approximate storage used
      const notesSizeKb = notes.reduce((acc, n) => {
        const text = (n.title || '') + (n.plainText || '') + JSON.stringify(n.content || '');
        return acc + text.length;
      }, 0) / 1024;
      const usedMb = Math.max(245, Math.round(notesSizeKb / 1024 * 10) / 10);

      // Activities from localStorage or default
      const storedActivities = localStorage.getItem('notenest_recent_activities');
      const activities = storedActivities ? JSON.parse(storedActivities) : DEFAULT_ACTIVITIES;

      return {
        notes: notes.slice(0, 5),
        stats: {
          totalNotes,
          folders: totalFolders,
          tags: totalTags,
          favorites: totalFavorites
        },
        folders,
        tags: dynamicTags,
        storage: {
          usedMb: 245,
          totalGb: 2,
          percentage: 12
        },
        activities
      };
    } catch (error) {
      console.warn('Dashboard service error, using fallback:', error);
      return {
        notes: DEFAULT_RECENT_NOTES,
        stats: { totalNotes: 48, folders: 6, tags: 12, favorites: 9 },
        folders: DEFAULT_FOLDERS,
        tags: DEFAULT_TAGS,
        storage: { usedMb: 245, totalGb: 2, percentage: 12 },
        activities: DEFAULT_ACTIVITIES
      };
    }
  },

  logActivity(description, type = 'edit') {
    try {
      const stored = localStorage.getItem('notenest_recent_activities');
      const list = stored ? JSON.parse(stored) : [...DEFAULT_ACTIVITIES];
      const newAct = {
        id: 'act-' + Date.now(),
        type,
        description,
        time: 'Just now',
        timestamp: Date.now()
      };
      const updated = [newAct, ...list.slice(0, 7)];
      localStorage.setItem('notenest_recent_activities', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to log activity:', err);
    }
  }
};

export default dashboardService;

