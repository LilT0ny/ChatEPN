import {
    BarChart3,
    BarChartHorizontal,
    LineChart,
    AreaChart,
    PieChart,
    ScatterChart,
    Radar,
    Map,
    Table,
    BoxSelect,
    Layers,
    TrendingUp,
    Activity,
} from 'lucide-react';

/**
 * Available chart visualization options.
 * Defined as a constant outside components to avoid re-creation on every render.
 */
export const CHART_OPTIONS = [
    { id: 'column', label: 'Column', icon: BarChart3 },
    { id: 'bar', label: 'Bar', icon: BarChartHorizontal },
    { id: 'line', label: 'Line', icon: LineChart },
    { id: 'area', label: 'Area', icon: AreaChart },
    { id: 'pie', label: 'Pie', icon: PieChart },
    { id: 'scatter', label: 'Scatter', icon: ScatterChart },
    { id: 'radar', label: 'Radar', icon: Radar },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'table', label: 'Table', icon: Table },
    { id: 'box', label: 'Box Plot', icon: BoxSelect },
    { id: 'combo', label: 'Combo', icon: Layers },
    { id: 'trend', label: 'Trend', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity },
];
