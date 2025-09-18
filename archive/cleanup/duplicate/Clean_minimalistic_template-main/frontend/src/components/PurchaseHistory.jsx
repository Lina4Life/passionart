/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import './PurchaseHistory.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PurchaseHistory = ({ userId }) => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('6months');
  const [viewMode, setViewMode] = useState('overview');

  useEffect(() => {
    fetchPurchaseHistory();
  }, [userId, timeframe]);

  const fetchPurchaseHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/purchases/history?userId=${userId}&timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = () => {
    const monthlyData = {};
    const categoryData = {};
    let totalSpent = 0;

    purchases.forEach(purchase => {
      const date = new Date(purchase.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Monthly spending
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += parseFloat(purchase.amount);
      
      // Category spending
      const category = purchase.artwork_medium || 'Other';
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += parseFloat(purchase.amount);
      
      totalSpent += parseFloat(purchase.amount);
    });

    return { monthlyData, categoryData, totalSpent };
  };

  const { monthlyData, categoryData, totalSpent } = processChartData();

  const lineChartData = {
    labels: Object.keys(monthlyData).sort(),
    datasets: [
      {
        label: 'Monthly Spending ($)',
        data: Object.keys(monthlyData).sort().map(month => monthlyData[month]),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Spending by Category ($)',
        data: Object.values(categoryData),
        backgroundColor: [
          '#8b5cf6',
          '#06b6d4',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6366f1',
          '#ec4899'
        ],
        borderRadius: 4
      }
    ]
  };

  const doughnutChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#8b5cf6',
          '#06b6d4',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6366f1',
          '#ec4899'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y?.toFixed(2) || context.parsed}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / totalSpent) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="purchase-history">
      <div className="history-header">
        <h2>{t('payment.purchase_history')}</h2>
        <div className="controls">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <div className="view-toggle">
            <button 
              className={viewMode === 'overview' ? 'active' : ''}
              onClick={() => setViewMode('overview')}
            >
              Overview
            </button>
            <button 
              className={viewMode === 'details' ? 'active' : ''}
              onClick={() => setViewMode('details')}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <div className="charts-container">
          <div className="summary-stats">
            <div className="stat-card">
              <h3>{t('payment.total_spent')}</h3>
              <p className="stat-value">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>{t('payment.transactions')}</h3>
              <p className="stat-value">{purchases.length}</p>
            </div>
            <div className="stat-card">
              <h3>Average Purchase</h3>
              <p className="stat-value">
                ${purchases.length > 0 ? (totalSpent / purchases.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-container">
              <h3>Spending Trend</h3>
              <div className="chart-wrapper">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-container">
              <h3>Spending by Category</h3>
              <div className="chart-wrapper">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-container">
              <h3>Category Distribution</h3>
              <div className="chart-wrapper">
                <Doughnut data={doughnutChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Artwork</th>
                <th>Artist</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Commission</th>
                <th>Artist Earnings</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase.id}>
                  <td>{new Date(purchase.created_at).toLocaleDateString()}</td>
                  <td>{purchase.artwork_title}</td>
                  <td>{purchase.artist_name}</td>
                  <td>${parseFloat(purchase.amount).toFixed(2)}</td>
                  <td>
                    <span className={`status ${purchase.payment_status}`}>
                      {purchase.payment_status === 'pending_admin' ? t('payment.pending_approval') :
                       purchase.payment_status === 'approved' ? t('payment.approved') :
                       purchase.payment_status === 'transferred' ? t('payment.transferred_to_artist') :
                       purchase.payment_status}
                    </span>
                  </td>
                  <td>${(parseFloat(purchase.amount) * 0.1).toFixed(2)}</td>
                  <td>${(parseFloat(purchase.amount) * 0.9).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
