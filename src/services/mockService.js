export const processQuery = async (query, context = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();

    // Define color palettes
    const palettes = {
        red: { primary: '#EF4444', secondary: '#FCA5A5', background: 'rgba(239, 68, 68, 0.1)', text: '#FECACA' },
        blue: { primary: '#3B82F6', secondary: '#93C5FD', background: 'rgba(59, 130, 246, 0.1)', text: '#BFDBFE' },
        green: { primary: '#10B981', secondary: '#6EE7B7', background: 'rgba(16, 185, 129, 0.1)', text: '#A7F3D0' },
        purple: { primary: '#8B5CF6', secondary: '#C4B5FD', background: 'rgba(139, 92, 246, 0.1)', text: '#DDD6FE' },
        orange: { primary: '#F59E0B', secondary: '#FCD34D', background: 'rgba(245, 158, 11, 0.1)', text: '#FDE68A' },
        dark: { primary: '#6B7280', secondary: '#D1D5DB', background: '#111827', text: '#F9FAFB' }
    };

    // Check for color keywords
    let foundPalette = null;
    for (const [color, palette] of Object.entries(palettes)) {
        if (lowerQuery.includes(color)) {
            foundPalette = palette;
            break;
        }
    }

    // 1. Check for specific keywords for data visualization
    const isChartRequest = ['sales', 'revenue', 'performance', 'chart', 'graph', 'visualize'].some(keyword => lowerQuery.includes(keyword));

    if (isChartRequest || foundPalette) {
        const preferredChart = context.dataSource?.chartType;
        let suggestedCharts = ['bar', 'line', 'pie'];

        if (preferredChart) {
            // Prioritize the user's selected chart type
            suggestedCharts = [preferredChart, ...suggestedCharts.filter(c => c !== preferredChart)];
        }

        return {
            type: 'data',
            text: foundPalette
                ? `Here is the data with the ${Object.keys(palettes).find(k => palettes[k] === foundPalette)} theme you requested.`
                : `Here is the ${preferredChart || 'sales'} data. You can visualize it using the options below.`,
            data: [
                { name: 'Jan', value: 4000, uv: 2400 },
                { name: 'Feb', value: 3000, uv: 1398 },
                { name: 'Mar', value: 2000, uv: 9800 },
                { name: 'Apr', value: 2780, uv: 3908 },
                { name: 'May', value: 1890, uv: 4800 },
                { name: 'Jun', value: 2390, uv: 3800 },
            ],
            suggestedCharts: suggestedCharts,
            palette: foundPalette // Pass the detected palette
        };
    }

    // 2. Check for uploaded file context or connected data source
    if (context.dataSource) {
        return {
            type: 'text',
            text: `Querying **${context.dataSource.name}** (${context.dataSource.type})...\nRunning SQL: \`SELECT * FROM ${context.dataSource.tables ? context.dataSource.tables[0] : 'table'} WHERE query LIKE '%${query}%'\`\n\nResult: Found 12 matching records. The trend is stable.`
        };
    }

    if (context.files && context.files.length > 0) {
        const fileNames = context.files.map(f => f.name).join(', ');
        return {
            type: 'text',
            text: `Scanning ${fileNames}... I found several key insights related to your query in the uploaded documents. The primary trend indicates a 15% growth year-over-year.`
        };
    }

    // 3. General conversational response
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return {
            type: 'text',
            text: "Hello! I am your advanced data assistant. ask me about your data, upload files, or request visualizations."
        };
    }

    return {
        type: 'text',
        text: "I didn't find specific data for that query in the database. Could you try rephrasing or uploading a relevant document?"
    };
};
