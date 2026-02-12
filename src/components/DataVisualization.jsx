import React, { useRef, useState, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar as RadarShape,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
    Treemap
} from 'recharts';
import html2canvas from 'html2canvas';
import styles from './DataVisualization.module.css';
import { Download } from 'lucide-react';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const DataVisualization = ({ data, chartType, palette }) => {
    const chartRef = useRef(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) return null;

    // Use CSS variables for theme-aware colors
    const getComputedThemeColor = (cssVar, fallback) => {
        if (typeof window !== 'undefined') {
            const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
            return value || fallback;
        }
        return fallback;
    };

    const textColor = getComputedThemeColor('--color-text-secondary', '#A1A1AA');
    const bgPrimary = getComputedThemeColor('--color-bg-primary', '#141415');
    const borderColor = getComputedThemeColor('--color-border', '#2E2E32');
    const textPrimary = getComputedThemeColor('--color-text-primary', '#EDEDED');

    const theme = {
        primary: palette?.primary || '#3B82F6',
        secondary: palette?.secondary || '#10B981',
        grid: borderColor,
        text: textColor,
        textPrimary: textPrimary,
        tooltipBg: bgPrimary,
        tooltipBorder: borderColor,
    };

    const PIE_COLORS = palette
        ? [palette.primary, palette.secondary, '#FFBB28', '#FF8042', '#AF19FF', '#FF4560']
        : CHART_COLORS;

    // --- Download Chart as PNG using html2canvas ---
    const handleDownload = useCallback(async () => {
        const container = chartRef.current;
        if (!container) return;

        try {
            // Hide the download button temporarily
            const btn = container.querySelector('.' + styles.downloadBtn);
            if (btn) btn.style.display = 'none';

            const canvas = await html2canvas(container, {
                backgroundColor: bgPrimary,
                scale: 2, // Retina quality
                useCORS: true,
                logging: false,
            });

            // Restore button
            if (btn) btn.style.display = '';

            const link = document.createElement('a');
            link.download = `chart-${chartType}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to download chart:', err);
        }

        setShowContextMenu(false);
    }, [chartType, bgPrimary]);

    // --- Context Menu ---
    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    const closeContextMenu = () => setShowContextMenu(false);

    // --- Tooltip Styles ---
    const tooltipStyle = {
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: theme.textPrimary,
        fontSize: '0.85rem',
    };
    const tooltipItemStyle = { color: theme.textPrimary };
    const tooltipLabelStyle = { color: theme.text, marginBottom: '4px', fontWeight: 600 };

    // --- Common Axis Props ---
    const axisProps = {
        stroke: 'transparent',
        tick: { fill: theme.text, fontSize: 12 },
        tickLine: false,
        axisLine: false,
    };

    const gridProps = {
        strokeDasharray: '3 3',
        stroke: theme.grid,
        vertical: false,
    };

    // --- Data keys detection ---
    const keys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name') : [];
    const numericKeys = keys.filter(k => typeof data[0][k] === 'number');

    // --- Render Chart by Type ---
    const renderChart = () => {
        switch (chartType) {
            case 'column':
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={data} barCategoryGap="20%">
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys.map((key, i) => (
                                <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={data}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys.map((key, i) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[i % CHART_COLORS.length], strokeWidth: 0 }} activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data}>
                            <defs>
                                {numericKeys.map((key, i) => (
                                    <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys.map((key, i) => (
                                <Area key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} fill={`url(#gradient-${key})`} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                innerRadius={65}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                stroke="none"
                                style={{ fontSize: '12px', fill: theme.text }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'scatter':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <ScatterChart>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey={numericKeys[0] || 'value'} name={numericKeys[0] || 'Value'} {...axisProps} type="number" />
                            <YAxis dataKey={numericKeys[1] || numericKeys[0] || 'value'} name={numericKeys[1] || 'UV'} {...axisProps} type="number" />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ strokeDasharray: '3 3', stroke: theme.grid }} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            <Scatter name="Data" data={data} fill={CHART_COLORS[0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                );

            case 'radar':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                            <PolarGrid stroke={theme.grid} />
                            <PolarAngleAxis dataKey="name" tick={{ fill: theme.text, fontSize: 12 }} />
                            <PolarRadiusAxis tick={{ fill: theme.text, fontSize: 10 }} axisLine={false} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                            {numericKeys.map((key, i) => (
                                <RadarShape key={key} dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.15} strokeWidth={2} />
                            ))}
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                );

            case 'combo':
            case 'trend':
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <ComposedChart data={data}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys[0] && <Bar dataKey={numericKeys[0]} fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} barSize={30} />}
                            {numericKeys[1] && <Line type="monotone" dataKey={numericKeys[1]} stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 4 }} />}
                            {numericKeys[2] && <Area type="monotone" dataKey={numericKeys[2]} fill={CHART_COLORS[2]} fillOpacity={0.1} stroke={CHART_COLORS[2]} />}
                        </ComposedChart>
                    </ResponsiveContainer>
                );

            case 'table':
                return (
                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i}>
                                        {Object.values(row).map((val, j) => (
                                            <td key={j}>{typeof val === 'number' ? val.toLocaleString() : val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'activity':
                // Activity = stacked area
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data}>
                            <defs>
                                {numericKeys.map((key, i) => (
                                    <linearGradient key={key} id={`act-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.5} />
                                        <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.05} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys.map((key, i) => (
                                <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={CHART_COLORS[i % CHART_COLORS.length]} fill={`url(#act-gradient-${key})`} strokeWidth={2} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'box':
            case 'map':
                // Fallback: show as bar chart with note
                return (
                    <div>
                        <p style={{ color: theme.text, fontSize: '0.8rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                            Showing as Column chart (full {chartType} support coming soon)
                        </p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data}>
                                <CartesianGrid {...gridProps} />
                                <XAxis dataKey="name" {...axisProps} />
                                <YAxis {...axisProps} />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                                <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                                {numericKeys.map((key, i) => (
                                    <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );

            default:
                return (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={data}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                            <Legend wrapperStyle={{ color: theme.text, paddingTop: '16px' }} />
                            {numericKeys.map((key, i) => (
                                <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div
            ref={chartRef}
            className={styles.chartWrapper}
            onContextMenu={handleContextMenu}
            onClick={closeContextMenu}
        >
            {/* Download button */}
            <button
                className={styles.downloadBtn}
                onClick={handleDownload}
                title="Download chart as PNG"
            >
                <Download size={14} />
            </button>

            {renderChart()}

            {/* Context Menu */}
            {showContextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
                >
                    <button onClick={handleDownload} className={styles.contextMenuItem}>
                        <Download size={14} />
                        Download as PNG
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataVisualization;
