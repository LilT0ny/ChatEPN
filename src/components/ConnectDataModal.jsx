import React, { useState } from 'react';
import {
    X, Database, FileText, Check, AlertCircle,
    BarChart3, BarChartHorizontal, LineChart, AreaChart,
    PieChart, ScatterChart, Radar, Map, Table,
    Layers, Activity, BoxSelect, TrendingUp
} from 'lucide-react';
import styles from './ConnectDataModal.module.css';

const ConnectDataModal = ({ onClose, onConnect }) => {
    const [step, setStep] = useState('select'); // select, sql, file, success
    const [sourceType, setSourceType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(null);



    // SQL States
    const [sqlConfig, setSqlConfig] = useState({
        host: '',
        port: '5432',
        user: '',
        password: '',
        database: ''
    });

    const handleSqlChange = (e) => {
        setSqlConfig({ ...sqlConfig, [e.target.name]: e.target.value });
    };

    const handleConnectSQL = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate connection delay
        setTimeout(() => {
            if (!sqlConfig.host || !sqlConfig.user) {
                setError('Please fill in all required fields.');
                setIsLoading(false);
                return;
            }

            // Mock success
            setSummary({
                type: 'SQL Database',
                name: sqlConfig.database || 'MyDatabase',
                tables: ['users', 'orders', 'products', 'inventory'],
                rowCount: 15420
            });
            setIsLoading(false);
            setStep('success');
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check types
        const allowedTypes = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json') && !file.name.endsWith('.xlsx')) {
            setError('Invalid file format. Please upload CSV, JSON, or XLSX.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate reading
        setTimeout(() => {
            setSummary({
                type: 'File',
                name: file.name,
                columns: ['id', 'date', 'amount', 'category', 'status'],
                rowCount: 342
            });
            setIsLoading(false);
            setStep('success');
        }, 1500);
    };

    const handleFinish = () => {
        onConnect(summary);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    <X size={20} />
                </button>

                <h2 className={styles.title}>
                    {step === 'select' && 'Select Data Source'}
                    {step === 'file' && 'Upload Data File'}
                    {step === 'success' && 'Connection Successful'}
                </h2>

                <div className={styles.content}>
                    {step === 'select' && (
                        <div className={styles.cardContainer}>
                            <button className={styles.card} onClick={() => { setStep('file'); setSourceType('file'); }}>
                                <FileText size={32} className={styles.cardIcon} />
                                <h3>Upload File</h3>
                                <p>CSV, JSON, XLSX</p>
                            </button>

                        </div>
                    )}

                    {step === 'file' && (
                        <div className={styles.fileUploadSection}>
                            <div className={styles.dropZone}>
                                <input type="file" id="contextFile" onChange={handleFileUpload} accept=".csv,.json,.xlsx" hidden />
                                <label htmlFor="contextFile" className={styles.dropLabel}>
                                    <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                    <span>Click to upload context file</span>
                                    <small>Supports .csv, .json, .xlsx</small>
                                </label>
                            </div>
                            {isLoading && <div className={styles.loader}>Indexing file content...</div>}
                            {error && <div className={styles.error}><AlertCircle size={16} /> {error}</div>}
                            <button type="button" className={styles.backBtn} onClick={() => setStep('select')} style={{ marginTop: '1rem' }}>Back</button>
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
                                {summary.rowCount && <p><strong>Rows:</strong> {summary.rowCount.toLocaleString()}</p>}
                            </div>
                            <div className={styles.actions} style={{ width: '100%', justifyContent: 'center' }}>
                                <button className={styles.primaryBtn} onClick={handleFinish}>Finish</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectDataModal;
