import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import usePageListStore from '../store/pageListStore';
import PageEditor from './PageEditor';

export default function PageEditorGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const pages = usePageListStore(s => s.pages);

    const pageId = new URLSearchParams(location.search).get('page_id');

    if (!pageId || !pages.some(p => p.id === pageId)) {
        return <Navigate to="/" replace />;
    }

    return <PageEditor />;
}
