import React, { useState, useMemo } from 'react';
import { useCurrency } from '../contexts/StoreContext';

const SalesChart = ({ data = [], loading = false, onPeriodChange }) => {
    const [activePeriod, setActivePeriod] = useState('7');
    const { formatCurrency } = useCurrency();

    // Calculate total from data
    const total = data.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);

    // Get max revenue for scaling
    const maxRevenue = Math.max(...data.map(item => parseFloat(item.revenue) || 0), 1);

    const getLabel = (item, index) => {
        if (!item.date) return `Day ${index + 1}`;
        const date = new Date(item.date);
        if (activePeriod === '7') {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (activePeriod === '30') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short' });
        }
    };

    const handlePeriodChange = (days) => {
        setActivePeriod(days);
        if (onPeriodChange) {
            onPeriodChange(parseInt(days));
        }
    };

    const getPeriodLabel = () => {
        if (activePeriod === '7') return 'Last 7 Days';
        if (activePeriod === '30') return 'Last 30 Days';
        return 'Last 90 Days';
    };

    // Generate SVG path for line chart
    const chartPath = useMemo(() => {
        if (data.length === 0) return { linePath: '', areaPath: '', points: [] };

        const width = 480;
        const height = 200;
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const points = data.map((item, index) => {
            const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
            const revenue = parseFloat(item.revenue) || 0;
            const y = height - padding - (revenue / maxRevenue) * chartHeight;
            return { x, y, revenue, item };
        });

        // Create smooth curved line path using bezier curves
        let linePath = '';
        let areaPath = '';

        if (points.length > 0) {
            linePath = `M ${points[0].x} ${points[0].y}`;
            areaPath = `M ${padding} ${height - padding} L ${points[0].x} ${points[0].y}`;

            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cpx1 = prev.x + (curr.x - prev.x) / 3;
                const cpx2 = prev.x + (curr.x - prev.x) * 2 / 3;
                linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
                areaPath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
            }

            areaPath += ` L ${points[points.length - 1].x} ${height - padding} Z`;
        }

        return { linePath, areaPath, points };
    }, [data, maxRevenue]);

    if (loading) {
        return (
            <div className="lg:col-span-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 p-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                </div>
                <div className="w-full h-[240px] bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-text-main dark:text-white text-lg font-bold">Sales Performance</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-text-main dark:text-white">{formatCurrency(total)}</span>
                        <span className="text-text-muted text-sm">{getPeriodLabel()}</span>
                    </div>
                </div>
                {/* Period Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {[
                        { value: '7', label: 'Daily' },
                        { value: '30', label: 'Weekly' },
                        { value: '90', label: 'Monthly' },
                    ].map((period) => (
                        <button
                            key={period.value}
                            onClick={() => handlePeriodChange(period.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activePeriod === period.value
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-text-main dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Line Chart */}
            <div className="w-full h-[240px] relative">
                {data.length > 0 ? (
                    <>
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 480 200"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#13ec5b" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1="20"
                                    y1={20 + i * 40}
                                    x2="460"
                                    y2={20 + i * 40}
                                    stroke="currentColor"
                                    strokeOpacity="0.1"
                                    strokeDasharray="4 4"
                                    className="text-gray-400 dark:text-gray-600"
                                />
                            ))}

                            {/* Area fill */}
                            <path
                                d={chartPath.areaPath}
                                fill="url(#chartGradient)"
                            />

                            {/* Line */}
                            <path
                                d={chartPath.linePath}
                                fill="none"
                                stroke="#13ec5b"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data points */}
                            {chartPath.points.map((point, index) => (
                                <g key={index} className="group">
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="5"
                                        fill="#13ec5b"
                                        stroke="white"
                                        strokeWidth="2"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    />
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="15"
                                        fill="transparent"
                                        className="cursor-pointer"
                                    />
                                </g>
                            ))}
                        </svg>

                        {/* Tooltip hover areas */}
                        <div className="absolute inset-0 flex">
                            {chartPath.points.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex-1 group relative"
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                        <div className="font-semibold">{formatCurrency(point.revenue)}</div>
                                        <div className="text-gray-300">{point.item.transactions || 0} sales</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-text-muted">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 block text-gray-300 dark:text-gray-600">show_chart</span>
                            <p className="text-sm">No sales data yet</p>
                            <p className="text-xs text-gray-400 mt-1">Complete a transaction to see your chart</p>
                        </div>
                    </div>
                )}
            </div>

            {/* X-axis labels */}
            {data.length > 0 && (
                <div className="flex justify-between mt-2 px-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {data.map((item, index) => (
                        <span key={index} className="text-center flex-1 truncate">
                            {getLabel(item, index)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SalesChart;
