import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    X, Database, FileText, Check, AlertCircle,
} from 'lucide-react';
import styles from './ConnectDataModal.module.css';

const ALLOWED_EXTENSIONS = ['.csv', '.json', '.xlsx'];
const ALLOWED_MIME_TYPES = [
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const isValidFile = (file) =>
    ALLOWED_MIME_TYPES.includes(file.type) ||
    ALLOWED_EXTENSIONS.some((ext) => file.name.endsWith(ext));

const ConnectDataModal = ({ onClose, onConnect }) => {
    const [step, setStep] = useState('select'); // select | file | success
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isValidFile(file)) {
            setError('Invalid file format. Please upload CSV, JSON, or XLSX.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate file reading/indexing
        setTimeout(() => {
            setSummary({
                type: 'File',
                name: file.name,
                columns: ['id', 'date', 'amount', 'category', 'status'],
                rowCount: 342,
            });
            setIsLoading(false);
            setStep('success');
        }, 1500);
    };

    const handleFinish = () => {
        onConnect(summary);
    };

    const stepTitles = {
        select: 'Select Data Source',
        file: 'Upload Data File',
        success: 'Connection Successful',
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={stepTitles[step]}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>

                <h2 className={styles.title}>{stepTitles[step]}</h2>

                <div className={styles.content}>
                    {step === 'select' && (
                        <div className={styles.cardContainer}>
                            <button
                                className={styles.card}
                                onClick={() => setStep('file')}
                            >
                                <FileText size={32} className={styles.cardIcon} />
                                <h3>Upload File</h3>
                                <p>CSV, JSON, XLSX</p>
                            </button>
                        </div>
                    )}

                    {step === 'file' && (
                        <div className={styles.fileUploadSection}>
                            <div className={styles.dropZone}>
                                <input
                                    type="file"
                                    id="contextFile"
                                    onChange={handleFileUpload}
                                    accept={ALLOWED_EXTENSIONS.join(',')}
                                    hidden
                                />
                                <label htmlFor="contextFile" className={styles.dropLabel}>
                                    <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                    <span>Click to upload context file</span>
                                    <small>Supports .csv, .json, .xlsx</small>
                                </label>
                            </div>
                            {isLoading && <div className={styles.loader}>Indexing file content...</div>}
                            {error && (
                                <div className={styles.error}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}
                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={() => setStep('select')}
                                style={{ marginTop: '1rem' }}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {step === 'success' && summary && (
                        <div className={styles.successView}>
                            <div className={styles.successIcon}>
                                <Check size={32} />
                            </div>
                            <h3>Data Connected!</h3>
                            <div className={styles.summaryCard}>
                                <p><strong>Source:</strong> {summary.type}</p>
                                <p><strong>Name:</strong> {summary.name}</p>
                                {summary.rowCount && (
                                    <p><strong>Rows:</strong> {summary.rowCount.toLocaleString()}</p>
                                )}
                            </div>
                            <div className={styles.actions} style={{ width: '100%', justifyContent: 'center' }}>
                                <button className={styles.primaryBtn} onClick={handleFinish}>
                                    Finish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ConnectDataModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConnect: PropTypes.func.isRequired,
};

export default ConnectDataModal;
