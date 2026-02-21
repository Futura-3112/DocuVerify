import React, { useState } from 'react';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetaData, SearchParams } from '../../types';

interface SearchFormProps {
    metaData: MetaData;
    onSearch: (params: SearchParams) => Promise<void>;
    searching: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ metaData, onSearch, searching }) => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        processId: '',
        ageCategoryId: '',
        stateId: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    return (
        <motion.div
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ width: '100%', maxWidth: '900px', padding: '2rem', borderRadius: '1.5rem', marginBottom: '3rem' }}
        >
            <form onSubmit={handleSubmit} className="grid-cols-3">
                <div className="input-group">
                    <label className="label">Process Type</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="select"
                            value={searchParams.processId}
                            onChange={(e) => setSearchParams({ ...searchParams, processId: e.target.value })}
                            required
                        >
                            <option value="">Select Process...</option>
                            {metaData.processes.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                    </div>
                </div>

                <div className="input-group">
                    <label className="label">Age Category</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="select"
                            value={searchParams.ageCategoryId}
                            onChange={(e) => setSearchParams({ ...searchParams, ageCategoryId: e.target.value })}
                            required
                        >
                            <option value="">Select Age Group...</option>
                            {metaData.ageCategories.map(a => (
                                <option key={a.id} value={a.id}>{a.name} ({a.minAge}-{a.maxAge})</option>
                            ))}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                    </div>
                </div>

                <div className="input-group">
                    <label className="label">State (Optional)</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="select"
                            value={searchParams.stateId}
                            onChange={(e) => setSearchParams({ ...searchParams, stateId: e.target.value })}
                        >
                            <option value="">All India / Default</option>
                            {metaData.states.map(s => (
                                <option key={s.id} value={s.id}>{s.name} {s.code ? `(${s.code})` : ''}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                    </div>
                </div>

                <div className="input-group" style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.4rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={searching}>
                        {searching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} style={{ marginRight: '0.5rem' }} />}
                        {searching ? 'Finding...' : 'Find Documents'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default SearchForm;
