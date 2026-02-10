import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CheckSquare, AlertCircle } from 'lucide-react';
import { DocumentResult } from '../../types';

interface ResultsListProps {
    results: DocumentResult[] | null;
    error: string | null;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, error }) => {
    return (
        <div style={{ width: '100%', maxWidth: '900px', paddingBottom: '4rem' }}>
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Required Documents <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 400 }}>({results.length} found)</span></h2>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {results.length === 0 ? (
                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>No specific documents found for this criteria.</p>
                                </div>
                            ) : (
                                results.map((doc, index) => (
                                    <motion.div
                                        key={doc.documentId || index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass"
                                        style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                                    >
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                                            <CheckSquare size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{doc.documentName}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                                {doc.stepDescription || 'Mandatory document for verification.'}
                                            </p>
                                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--text-secondary)' }}>
                                                    Priority: {doc.sortOrder !== undefined ? doc.sortOrder : 'Normal'}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass"
                    style={{ borderLeft: '4px solid #ef4444', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}
                >
                    <AlertCircle color="#ef4444" />
                    <p style={{ color: '#ef4444' }}>{error}</p>
                </motion.div>
            )}
        </div>
    );
};

export default ResultsList;
