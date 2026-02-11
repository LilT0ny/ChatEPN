export const processQuery = async (query, context = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();

    // 1. Check for specific keywords for data visualization
    if (lowerQuery.includes('sales') || lowerQuery.includes('revenue') || lowerQuery.includes('performance')) {
        return {
            type: 'data',
            text: "Here is the sales performance data for the last quarter. You can visualize it using the chart options below.",
            data: [
                { name: 'Jan', value: 4000, uv: 2400 },
                { name: 'Feb', value: 3000, uv: 1398 },
                { name: 'Mar', value: 2000, uv: 9800 },
                { name: 'Apr', value: 2780, uv: 3908 },
                { name: 'May', value: 1890, uv: 4800 },
                { name: 'Jun', value: 2390, uv: 3800 },
            ],
            suggestedCharts: ['bar', 'line', 'pie']
        };
    }

    // 2. Check for uploaded file context
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
