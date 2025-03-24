import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState({
    articles: 0,
    followers: 0,
    views: 0
  });

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      setMetrics(prevMetrics => ({
        articles: prevMetrics.articles + Math.floor(Math.random() * 3),
        followers: prevMetrics.followers + Math.floor(Math.random() * 5),
        views: prevMetrics.views + Math.floor(Math.random() * 10)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-40 p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, {currentUser ? currentUser.email : 'Guest'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Total Articles" value={metrics.articles} />
        <MetricCard title="Followers" value={metrics.followers} />
        <MetricCard title="Total Views" value={metrics.views} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Engagement Over Time</h3>
        <div className="flex items-end h-48 bg-gray-100 rounded-lg overflow-hidden">
          {[...Array(10)].map((_, index) => (
            <div 
              key={index} 
              className="flex-1 bg-blue-500 mx-px transition-all duration-300 ease-in-out"
              style={{height: `${Math.random() * 100}%`}}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
  </div>
);

export default Dashboard;
