import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from './UserContext';
import * as api from '../services/api';

const AppContext = createContext(null);

const normalize = text =>
    text.replace(/Ğ/g, 'g').replace(/ğ/g, 'g')
        .replace(/Ü/g, 'u').replace(/ü/g, 'u')
        .replace(/Ş/g, 's').replace(/ş/g, 's')
        .replace(/İ/g, 'i').replace(/ı/g, 'i')
        .replace(/Ö/g, 'o').replace(/ö/g, 'o')
        .replace(/Ç/g, 'c').replace(/ç/g, 'c')
        .toLowerCase();

export function AppProvider({ children }) {
    const { currentUser } = useUser();

    // ── Core data ──────────────────────────────────────────
    const [placesData, setPlacesData] = useState([]);
    const [pendingPlaces, setPendingPlaces] = useState([]);
    const [memoriesData, setMemoriesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ── UI state ───────────────────────────────────────────
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);
    const [activeModalPlace, setActiveModalPlace] = useState(null);
    const [showSuggestModal, setShowSuggestModal] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    // Memories: activeMemoriesPlace = null → global feed, place object → place-specific feed
    const [showMemories, setShowMemories] = useState(false);
    const [activeMemoriesPlace, setActiveMemoriesPlace] = useState(null);
    // Contact modal
    const [showContact, setShowContact] = useState(false);

    // ── Toasts ─────────────────────────────────────────────
    const [toasts, setToasts] = useState([]);

    // ── Toasts helpers (declare before useEffect that uses pushToast) ──
    const pushToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const dismissToast = useCallback(id => setToasts(prev => prev.filter(t => t.id !== id)), []);

    // ── Init ───────────────────────────────────────────────
    useEffect(() => {
        Promise.all([api.getPlaces(), api.getPendingPlaces(), api.getMemories()])
            .then(([places, pending, memories]) => {
                setPlacesData(places);
                setPendingPlaces(pending);
                setMemoriesData(memories);
            })
            .catch(() => pushToast('Veriler yüklenemedi.', 'error'))
            .finally(() => setIsLoading(false));
    }, [pushToast]);

    // ── Derived ────────────────────────────────────────────
    const filteredPlaces = useMemo(() => {
        let result = placesData;
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }
        if (query) {
            const q = normalize(query);
            result = result.filter(p => normalize(p.title).includes(q));
        }
        return result;
    }, [placesData, query, activeCategory]);

    // ── Route planner ──────────────────────────────────────
    const toggleSelectPlace = useCallback(id => {
        setSelectedPlaceIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const createRoute = useCallback(() => {
        const titles = placesData
            .filter(p => selectedPlaceIds.includes(p.id))
            .map(p => encodeURIComponent(p.title));
        if (!titles.length) return;
        window.open(`https://www.google.com/maps/dir/${titles.join('/')}`, '_blank');
    }, [placesData, selectedPlaceIds]);

    // ── Modal controls ─────────────────────────────────────
    const openModal = useCallback(p => setActiveModalPlace(p), []);
    const closeModal = useCallback(() => setActiveModalPlace(null), []);
    const openSuggestModal = useCallback(() => setShowSuggestModal(true), []);
    const closeSuggestModal = useCallback(() => setShowSuggestModal(false), []);
    const openAdmin = useCallback(() => setShowAdmin(true), []);
    const closeAdmin = useCallback(() => setShowAdmin(false), []);
    const openMemories = useCallback((place = null) => {
        setActiveMemoriesPlace(place);
        setShowMemories(true);
    }, []);
    const closeMemories = useCallback(() => {
        setShowMemories(false);
        setActiveMemoriesPlace(null);
    }, []);
    const openContact = useCallback(() => setShowContact(true), []);
    const closeContact = useCallback(() => setShowContact(false), []);

    // ── Sync helper: keep open modal fresh ─────────────────
    const syncModal = useCallback((places, placeId) => {
        const fresh = places.find(p => p.id === placeId);
        if (fresh) {
            setActiveModalPlace(prev => prev?.id === placeId ? fresh : prev);
        }
    }, []);

    // ── Reviews ────────────────────────────────────────────
    const handleAddReview = useCallback(async (placeId, review) => {
        try {
            const { updatedPlaces } = await api.addReview(placesData, placeId, review);
            setPlacesData(updatedPlaces);
            syncModal(updatedPlaces, placeId);
            pushToast('Yorumun başarıyla eklendi! 🌟');
        } catch { pushToast('Yorum eklenemedi.', 'error'); }
    }, [placesData, syncModal, pushToast]);

    const handleDeleteReview = useCallback(async (placeId, reviewId) => {
        try {
            const { updatedPlaces } = await api.deleteReview(placesData, placeId, reviewId);
            setPlacesData(updatedPlaces);
            syncModal(updatedPlaces, placeId);
            pushToast('Yorum silindi.');
        } catch { pushToast('Yorum silinemedi.', 'error'); }
    }, [placesData, syncModal, pushToast]);

    // ── Admin CRUD — places ────────────────────────────────
    const handleUpdatePlace = useCallback(async (placeId, updates) => {
        try {
            const updatedPlaces = await api.updatePlace(placesData, placeId, updates);
            setPlacesData(updatedPlaces);
            syncModal(updatedPlaces, placeId);
            pushToast('Yer güncellendi! ✅');
        } catch { pushToast('Güncelleme başarısız.', 'error'); }
    }, [placesData, syncModal, pushToast]);

    const handleDeletePlace = useCallback(async (placeId) => {
        try {
            const updatedPlaces = await api.deletePlace(placesData, placeId);
            setPlacesData(updatedPlaces);
            setActiveModalPlace(prev => prev?.id === placeId ? null : prev);
            pushToast('Yer silindi.');
        } catch { pushToast('Silme başarısız.', 'error'); }
    }, [placesData, pushToast]);

    // ── Admin actions — pending ────────────────────────────
    const handleSuggestPlace = useCallback(async formData => {
        try {
            const updated = await api.submitPlace(pendingPlaces, formData);
            setPendingPlaces(updated);
            closeSuggestModal();
            pushToast('Yer önerildi! Yönetici onayı bekleniyor. 🙏');
        } catch { pushToast('Gönderilemedi.', 'error'); }
    }, [pendingPlaces, pushToast, closeSuggestModal]);

    const handleApprovePlace = useCallback(async pendingId => {
        try {
            const { updatedPlaces, updatedPending } = await api.approvePlace(placesData, pendingPlaces, pendingId);
            setPlacesData(updatedPlaces);
            setPendingPlaces(updatedPending);
            pushToast('Yer onaylandı ve listeye eklendi! ✅');
        } catch { pushToast('Onaylama başarısız.', 'error'); }
    }, [placesData, pendingPlaces, pushToast]);

    const handleRejectPlace = useCallback(async pendingId => {
        try {
            const updated = await api.rejectPlace(pendingPlaces, pendingId);
            setPendingPlaces(updated);
            pushToast('Yer reddedildi.', 'error');
        } catch { pushToast('İşlem başarısız.', 'error'); }
    }, [pendingPlaces, pushToast]);

    // ── Memories CRUD ──────────────────────────────────────
    const handleAddMemory = useCallback(async (memoryData) => {
        if (currentUser.role === 'anonymous') {
            pushToast('Hatıra paylaşmak için giriş yapmalısın.', 'error');
            return;
        }
        try {
            const updated = await api.addMemory(memoriesData, memoryData, currentUser);
            setMemoriesData(updated);
            pushToast('Hatıran paylaşıldı! 🤍');
        } catch (e) {
            if (e.message === 'SPAM_LIMIT') {
                pushToast('Yavaş ol! 1 dakikada en fazla 5 paylaşım yapabilirsin.', 'error');
            } else {
                pushToast('Paylaşım eklenemedi.', 'error');
            }
        }
    }, [memoriesData, currentUser, pushToast]);

    const handleDeleteMemory = useCallback(async (memoryId) => {
        try {
            const updated = await api.deleteMemory(memoriesData, memoryId);
            setMemoriesData(updated);
            pushToast('Paylaşım silindi.');
        } catch { pushToast('Silinemedi.', 'error'); }
    }, [memoriesData, pushToast]);

    const handleToggleMemoryLike = useCallback(async (memoryId) => {
        if (currentUser.role === 'anonymous') {
            pushToast('Beğenmek için giriş yapmalısın.', 'error');
            return;
        }
        try {
            const updated = await api.toggleMemoryLike(memoriesData, memoryId, currentUser.id);
            setMemoriesData(updated);
        } catch { pushToast('İşlem başarısız.', 'error'); }
    }, [memoriesData, currentUser, pushToast]);

    const handleAddMemoryComment = useCallback(async (memoryId, text) => {
        if (currentUser.role === 'anonymous') {
            pushToast('Yorum yapmak için giriş yapmalısın.', 'error');
            return;
        }
        try {
            const updated = await api.addMemoryComment(memoriesData, memoryId, currentUser, text);
            setMemoriesData(updated);
        } catch { pushToast('Yorum gönderilemedi.', 'error'); }
    }, [memoriesData, currentUser, pushToast]);

    const value = useMemo(() => ({
        // state
        placesData, pendingPlaces, filteredPlaces, selectedPlaceIds,
        memoriesData,
        query, activeCategory, activeModalPlace, showSuggestModal, showAdmin,
        showMemories, activeMemoriesPlace, showContact,
        toasts, isLoading,
        // actions
        setQuery, setActiveCategory, toggleSelectPlace, createRoute,
        openModal, closeModal,
        openSuggestModal, closeSuggestModal, openAdmin, closeAdmin,
        openMemories, closeMemories, openContact, closeContact,
        handleAddReview, handleDeleteReview,
        handleAddMemory, handleDeleteMemory,
        handleToggleMemoryLike, handleAddMemoryComment,
        handleUpdatePlace, handleDeletePlace,
        handleSuggestPlace, handleApprovePlace, handleRejectPlace,
        pushToast, dismissToast,
    }), [
        placesData, pendingPlaces, filteredPlaces, selectedPlaceIds,
        memoriesData,
        query, activeCategory, activeModalPlace, showSuggestModal, showAdmin,
        showMemories, activeMemoriesPlace, showContact,
        toasts, isLoading,
        setQuery, setActiveCategory, toggleSelectPlace, createRoute,
        openModal, closeModal,
        openSuggestModal, closeSuggestModal, openAdmin, closeAdmin,
        openMemories, closeMemories, openContact, closeContact,
        handleAddReview, handleDeleteReview,
        handleAddMemory, handleDeleteMemory,
        handleToggleMemoryLike, handleAddMemoryComment,
        handleUpdatePlace, handleDeletePlace,
        handleSuggestPlace, handleApprovePlace, handleRejectPlace,
        pushToast, dismissToast,
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be inside <AppProvider>');
    return ctx;
}
