import { create } from 'zustand';
import { JsonElement, BindingData } from '../types';
import { deserialize, serialize } from '../utils/treeActions';
import { listPages, createPage, updatePage, deletePage, PageDto } from '../api/pages';

interface Page {
    id: string;
    name: string;
    content: JsonElement;
    bindings: BindingData;
}

interface PageListStore {
    pages: Page[];
    selectedPageId: string | null;
    loading: boolean;
    loadPages: () => Promise<void>;
    setPages: (pages: Page[]) => void;
    addPage: (page: Page) => Promise<void>;
    removePage: (id: string) => Promise<void>;
    selectPage: (id: string | null) => void;
    getSelectedPage: () => Page | null;
    savePage: (id: string, content: JsonElement, bindings: BindingData) => Promise<void>;
    renamePage: (id: string, newName: string) => Promise<void>;
}

const toDto = (p: Page): PageDto => ({ id: p.id, name: p.name, content: serialize(p.content), bindings: p.bindings });
const fromDto = (d: PageDto): Page => ({ id: d.id, name: d.name, content: deserialize(d.content), bindings: d.bindings });

const savePagesToStorage = (pages: Page[]) => {
    const serializedPages = pages.map(page => ({ ...page, content: serialize(page.content) }));
    localStorage.setItem('pages', JSON.stringify(serializedPages));
};

const SELECTED_PAGE_KEY = 'selectedPageId';

const usePageListStore = create<PageListStore>((set, get) => ({
    pages: [],
    selectedPageId: localStorage.getItem(SELECTED_PAGE_KEY),
    loading: false,
    loadPages: async () => {
        set({ loading: true });
        try {
            const dtos = await listPages();
            const pages = dtos.map(fromDto);
            set({ pages });
            savePagesToStorage(pages);
            const currentSelected = get().selectedPageId;
            if (!currentSelected || !pages.some(p => p.id === currentSelected)) {
                const first = pages[0]?.id || null;
                set({ selectedPageId: first });
                if (first) localStorage.setItem(SELECTED_PAGE_KEY, first); else localStorage.removeItem(SELECTED_PAGE_KEY);
            }
        } finally {
            set({ loading: false });
        }
    },
    setPages: (pages) => {
        set({ pages });
        savePagesToStorage(pages);
    },
    addPage: async (page) => {
        // Let server assign ID if empty
        const dto = await createPage(toDto({ ...page, id: page.id || '' }));
        const created = fromDto(dto);
        const updated = [...get().pages, created];
        set({ pages: updated, selectedPageId: created.id });
        localStorage.setItem(SELECTED_PAGE_KEY, created.id);
        savePagesToStorage(updated);
    },
    renamePage: async (id, newName) => {
        const page = get().pages.find(p => p.id === id);
        if (!page) return;
        const updatedPage: Page = { ...page, name: newName };
        await updatePage(id, toDto(updatedPage));
        const updated = get().pages.map(p => p.id === id ? updatedPage : p);
        set({ pages: updated });
        savePagesToStorage(updated);
    },
    removePage: async (id) => {
        await deletePage(id);
        const updatedPages = get().pages.filter(page => page.id !== id);
        let nextSelected = get().selectedPageId;
        if (nextSelected === id) {
            nextSelected = updatedPages[0]?.id || null;
        }
        set({ pages: updatedPages, selectedPageId: nextSelected });
        if (nextSelected) localStorage.setItem(SELECTED_PAGE_KEY, nextSelected); else localStorage.removeItem(SELECTED_PAGE_KEY);
        savePagesToStorage(updatedPages);
    },
    selectPage: (id) => {
        set({ selectedPageId: id });
        if (id) localStorage.setItem(SELECTED_PAGE_KEY, id); else localStorage.removeItem(SELECTED_PAGE_KEY);
    },
    getSelectedPage: () => {
        const { pages, selectedPageId } = get();
        return pages.find(page => page.id === selectedPageId) || null;
    },
    savePage: async (id, content, bindings) => {
        const page = get().pages.find(p => p.id === id);
        if (!page) return;
        const updatedPage: Page = { ...page, content, bindings };
        await updatePage(id, toDto(updatedPage));
        const updated = get().pages.map(p => p.id === id ? updatedPage : p);
        set({ pages: updated });
        savePagesToStorage(updated);
    },
}));

export default usePageListStore;
