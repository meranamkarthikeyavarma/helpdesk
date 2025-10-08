import {useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, MessageSquare, AlertCircle, Clock, User, TrendingUp } from 'lucide-react';
import type { Ticket } from '../types';
import { ticketApi } from '../api/client';

const priorities = {
  LOW: { color: 'bg-gradient-to-r from-blue-500 to-cyan-500', label: 'Low', icon: '●' },
  MEDIUM: { color: 'bg-gradient-to-r from-amber-500 to-orange-500', label: 'Medium', icon: '●●' },
  HIGH: { color: 'bg-gradient-to-r from-red-500 to-pink-500', label: 'High', icon: '●●●' }
};

const statuses = {
  OPEN: { color: 'bg-emerald-500', label: 'Open', glow: 'shadow-emerald-200' },
  IN_PROGRESS: { color: 'bg-violet-500', label: 'In Progress', glow: 'shadow-violet-200' },
  CLOSED: { color: 'bg-slate-500', label: 'Closed', glow: 'shadow-slate-200' }
};

export default function TicketList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'ALL';

  useEffect(() => {
    loadTickets();
  }, [searchQuery, statusFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.q = searchQuery;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      
      const data = await ticketApi.list(params);
      setTickets(data.items);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value !== 'ALL') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    setSearchParams(params);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Helpdesk Portal
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <TrendingUp size={16} />
                Manage and track support tickets
              </p>
            </div>
            <button
              onClick={() => navigate('/tickets/new')}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">New Ticket</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search tickets by title, description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2 shadow-sm">
              <Filter size={20} className="text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 font-medium cursor-pointer pr-8"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg shadow-red-100/50 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Tickets Grid */}
        <div className="grid gap-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-blue-300/50 overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {ticket.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`px-4 py-2 rounded-xl text-white font-semibold text-sm ${priorities[ticket.priority].color} shadow-lg`}>
                      {priorities[ticket.priority].label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium ${statuses[ticket.status].color} shadow`}>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {statuses[ticket.status].label}
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={16} className="text-slate-400" />
                      <span className="text-sm font-medium">{ticket.reporter}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-sm">{formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-medium">
                    <MessageSquare size={16} className="text-slate-500" />
                    <span className="text-sm">{ticket.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-slate-200/50">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
              <AlertCircle size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tickets found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}