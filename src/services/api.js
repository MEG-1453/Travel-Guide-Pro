import { STATIC_PLACES } from '../data/places';

const PLACES_KEY = 'travelguide_places_v3';
const PENDING_KEY = 'travelguide_pending_v3';
const MEMORIES_KEY = 'travelguide_memories_v1';

// ─── Helpers ─────────────────────────────────────────────────

const asyncResolve = (value, delay = 60) =>
    new Promise(resolve => setTimeout(() => resolve(value), delay));

const computeRating = reviews => {
    if (!reviews?.length) return 0;
    return parseFloat((reviews.reduce((a, r) => a + r.score, 0) / reviews.length).toFixed(1));
};

const readLS = (key, fallback) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch { return fallback; }
};

const writeLS = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('LS write failed:', e); }
};

// ─── Places ──────────────────────────────────────────────────

export const getPlaces = () => {
    const saved = readLS(PLACES_KEY, null);
    if (saved) {
        const savedMap = new Map(saved.map(p => [p.id, p]));
        const merged = STATIC_PLACES.map(sp =>
            savedMap.has(sp.id)
                ? { ...sp, ...savedMap.get(sp.id), image: sp.image }
                : sp
        );
        const communityPlaces = saved.filter(p => p.id > 1000);
        return asyncResolve([...merged, ...communityPlaces]);
    }
    return asyncResolve([...STATIC_PLACES]);
};

export const savePlaces = places => {
    writeLS(PLACES_KEY, places.map(({ image, ...rest }) => rest));
};

// ─── Admin CRUD on approved places ───────────────────────────

/** Update fields of an existing approved place (admin only). */
export const updatePlace = (currentPlaces, placeId, updates) => {
    const updatedPlaces = currentPlaces.map(p =>
        p.id === placeId ? { ...p, ...updates } : p
    );
    savePlaces(updatedPlaces);
    return asyncResolve(updatedPlaces);
};

/** Delete an approved place (admin only). */
export const deletePlace = (currentPlaces, placeId) => {
    const updatedPlaces = currentPlaces.filter(p => p.id !== placeId);
    savePlaces(updatedPlaces);
    return asyncResolve(updatedPlaces);
};

// ─── Reviews ─────────────────────────────────────────────────

export const addReview = (currentPlaces, placeId, review) => {
    const newReview = {
        id: Date.now(),
        user: review.user.trim(),
        text: review.text.trim(),
        score: Number(review.score),
        date: new Date().toLocaleDateString('tr-TR'),
    };
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        const updatedReviews = [newReview, ...place.reviews];
        return { ...place, reviews: updatedReviews, rating: computeRating(updatedReviews) };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

/** Delete a specific review (admin only). */
export const deleteReview = (currentPlaces, placeId, reviewId) => {
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        const updatedReviews = place.reviews.filter(r => r.id !== reviewId);
        return { ...place, reviews: updatedReviews, rating: computeRating(updatedReviews) };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

// ─── Photos ──────────────────────────────────────────────────

/** @param {object} user  - { id, name, color } from UserContext.currentUser */
export const addPhoto = (currentPlaces, placeId, photoUrl, user) => {
    const newPhoto = {
        id: Date.now(),
        url: photoUrl.trim(),
        addedAt: new Date().toLocaleDateString('tr-TR'),
        addedBy: user?.name || 'Misafir',
        addedById: user?.id || 'guest',
        addedColor: user?.color || '#94a3b8',
        likes: 0,
        likedBy: [],
        comments: [],
    };
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        return { ...place, photos: [newPhoto, ...place.photos] };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

/** Delete a specific photo (admin only). */
export const deletePhoto = (currentPlaces, placeId, photoId) => {
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        return { ...place, photos: place.photos.filter(ph => ph.id !== photoId) };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

/** Toggle a like on a photo. */
export const togglePhotoLike = (currentPlaces, placeId, photoId, userId) => {
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        const photos = place.photos.map(photo => {
            if (photo.id !== photoId) return photo;
            const hasLiked = photo.likedBy.includes(userId);
            return {
                ...photo,
                likes: hasLiked ? photo.likes - 1 : photo.likes + 1,
                likedBy: hasLiked
                    ? photo.likedBy.filter(id => id !== userId)
                    : [...photo.likedBy, userId],
            };
        });
        return { ...place, photos };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

/** Add a comment to a specific photo (requires isLoggedIn). */
export const addPhotoComment = (currentPlaces, placeId, photoId, commentData) => {
    const newComment = {
        id: Date.now(),
        user: commentData.user || 'Kullanıcı',
        text: commentData.text.trim(),
        date: new Date().toLocaleDateString('tr-TR'),
    };
    const updatedPlaces = currentPlaces.map(place => {
        if (place.id !== placeId) return place;
        const photos = place.photos.map(photo => {
            if (photo.id !== photoId) return photo;
            return { ...photo, comments: [...(photo.comments || []), newComment] };
        });
        return { ...place, photos };
    });
    savePlaces(updatedPlaces);
    return asyncResolve({ updatedPlaces, updatedPlace: updatedPlaces.find(p => p.id === placeId) });
};

// ─── Pending / Admin ──────────────────────────────────────────

export const getPendingPlaces = () => asyncResolve(readLS(PENDING_KEY, []));

export const submitPlace = (currentPending, formData) => {
    const newPlace = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        category: formData.category || 'landmark',
        link: formData.link?.trim() || '',
        rating: 0,
        reviews: [],
        photos: [],
        submittedAt: new Date().toLocaleDateString('tr-TR'),
    };
    const updated = [newPlace, ...currentPending];
    writeLS(PENDING_KEY, updated);
    return asyncResolve(updated);
};

export const approvePlace = (currentPlaces, currentPending, pendingId) => {
    const place = currentPending.find(p => p.id === pendingId);
    if (!place) return asyncResolve({ updatedPlaces: currentPlaces, updatedPending: currentPending });
    const updatedPlaces = [...currentPlaces, place];
    const updatedPending = currentPending.filter(p => p.id !== pendingId);
    savePlaces(updatedPlaces);
    writeLS(PENDING_KEY, updatedPending);
    return asyncResolve({ updatedPlaces, updatedPending });
};

export const rejectPlace = (currentPending, pendingId) => {
    const updated = currentPending.filter(p => p.id !== pendingId);
    writeLS(PENDING_KEY, updated);
    return asyncResolve(updated);
};

// ─── Memories (Global Social Feed) ─────────────────────────────

export const getMemories = () => asyncResolve(readLS(MEMORIES_KEY, []));

/** Add a new memory post. Throws if spam limit (5 posts per min) is exceeded. */
export const addMemory = (currentMemories, memoryData, user) => {
    // Spam protection: max 5 posts per 60 seconds per user
    const oneMinAgo = Date.now() - 60_000;
    const recentCount = currentMemories.filter(
        m => m.authorId === user.id && m.createdAt > oneMinAgo
    ).length;
    if (recentCount >= 5) {
        return Promise.reject(new Error('SPAM_LIMIT'));
    }

    const newMemory = {
        id: Date.now(),
        text: (memoryData.text || '').trim(),
        image: (memoryData.image || '').trim(),
        placeId: memoryData.placeId || null,        // null = global
        placeTitle: memoryData.placeTitle || null,
        authorId: user.id,
        authorName: user.name,
        authorColor: user.color || '#94a3b8',
        authorInitials: user.initials || user.name?.[0]?.toUpperCase() || '?',
        createdAt: Date.now(),
        dateStr: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        likes: 0,
        likedBy: [],
        comments: [],
    };

    const updated = [newMemory, ...currentMemories];
    writeLS(MEMORIES_KEY, updated);
    return asyncResolve(updated);
};

/** Delete a memory (admin or own author). */
export const deleteMemory = (currentMemories, memoryId) => {
    const updated = currentMemories.filter(m => m.id !== memoryId);
    writeLS(MEMORIES_KEY, updated);
    return asyncResolve(updated);
};

/** Toggle a like on a memory. */
export const toggleMemoryLike = (currentMemories, memoryId, userId) => {
    const updated = currentMemories.map(m => {
        if (m.id !== memoryId) return m;
        const hasLiked = m.likedBy.includes(userId);
        return {
            ...m,
            likes: hasLiked ? m.likes - 1 : m.likes + 1,
            likedBy: hasLiked ? m.likedBy.filter(id => id !== userId) : [...m.likedBy, userId],
        };
    });
    writeLS(MEMORIES_KEY, updated);
    return asyncResolve(updated);
};

/** Add a comment to a memory (logged-in users only). */
export const addMemoryComment = (currentMemories, memoryId, user, text) => {
    const newComment = {
        id: Date.now(),
        authorId: user.id,
        authorName: user.name,
        authorColor: user.color || '#94a3b8',
        text: text.trim(),
        dateStr: new Date().toLocaleDateString('tr-TR'),
    };
    const updated = currentMemories.map(m => {
        if (m.id !== memoryId) return m;
        return { ...m, comments: [...(m.comments || []), newComment] };
    });
    writeLS(MEMORIES_KEY, updated);
    return asyncResolve(updated);
};

