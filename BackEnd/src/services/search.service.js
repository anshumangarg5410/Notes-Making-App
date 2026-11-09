const Note = require('../models/Note');
const Folder = require('../models/Folder');

class SearchService {
  async search(userId, params = {}) {
    const {
      q = '',
      folder = '',
      tag = '',
      favorites = false,
      sortBy = 'relevance',
      limit = 30,
      skip = 0
    } = params;

    const query = {
      userId,
      isDeleted: false
    };

    // Text search if query provided
    const trimmed = q.trim();
    if (trimmed) {
      const regex = new RegExp(trimmed, 'i');
      query.$or = [
        { title: regex },
        { plainText: regex },
        { tags: { $in: [regex] } },
        { folder: regex }
      ];
    }

    // Folder filter
    if (folder && folder !== 'all') {
      query.$or = [
        ...(query.$or || []),
        { folder: new RegExp(`^${folder.trim()}$`, 'i') }
      ];
    }

    // Tag filter
    if (tag && tag !== 'all') {
      query.tags = { $in: [new RegExp(`^${tag.trim()}$`, 'i')] };
    }

    // Favorites filter
    if (favorites === true || favorites === 'true') {
      query.isFavorite = true;
    }

    // Sorting
    let sortOptions = { updatedAt: -1 };
    if (sortBy === 'created_desc') sortOptions = { createdAt: -1 };
    else if (sortBy === 'created_asc') sortOptions = { createdAt: 1 };
    else if (sortBy === 'title_asc' || sortBy === 'alphabetical') sortOptions = { title: 1 };
    else if (sortBy === 'title_desc') sortOptions = { title: -1 };
    else if (sortBy === 'updated_asc') sortOptions = { updatedAt: 1 };

    // Also search matching folders
    let matchedFolders = [];
    if (trimmed) {
      matchedFolders = await Folder.find({
        userId,
        name: { $regex: trimmed, $options: 'i' }
      })
        .limit(5)
        .lean();
    }

    const [notes, totalCount] = await Promise.all([
      Note.find(query)
        .sort(sortOptions)
        .skip(parseInt(skip, 10) || 0)
        .limit(parseInt(limit, 10) || 30)
        .lean(),
      Note.countDocuments(query)
    ]);

    return {
      query: trimmed,
      totalCount,
      notes: notes.map((n) => ({
        ...n,
        id: n._id.toString()
      })),
      folders: matchedFolders.map((f) => ({
        ...f,
        id: f._id.toString()
      }))
    };
  }
}

module.exports = new SearchService();
