import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, User, Trash2, ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import type { Ticket, Status } from '../types';
import { ticketApi } from '../api/client';
import CommentList from './CommentList.tsx';

const priorities = {
  LOW: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Low', gradient: 'from-blue-500 to-cyan-500' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Medium', gradient: 'from-yellow-500 to-orange-500' },
  HIGH: { color: 'bg-red-100 text-red-700 border-red-200', label: 'High', gradient: 'from-red-500 to-pink-500' }
};

const statuses = {
  OPEN: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Open', icon: '🟢' },
  IN_PROGRESS: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'In Progress', icon: '🔄' },
  CLOSED: { color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Closed', icon: '✓' }
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadTicket();
    }
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketApi.get(id!);
      setTicket(data);
      setError('');
    } catch (err) {
      setError('Failed to load ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!ticket) return;
    
    try {
      const updated = await ticketApi.update(ticket.id, { status: newStatus });
      setTicket(updated);
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;
    
    try {
      await ticketApi.delete(ticket.id);
      navigate('/tickets');
    } catch (err) {
      alert('Failed to delete ticket');
      console.error(err);
    }
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-red-600 mb-6">{error || 'Ticket not found'}</p>
          <button
            onClick={() => navigate('/tickets')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Back to tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/tickets')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group transition-all duration-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to tickets
          </button>
          
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${priorities[ticket.priority].gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{ticket.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <User size={16} />
                      <span className="text-sm font-medium">{ticket.reporter}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Clock size={16} />
                      <span className="text-sm font-medium">Updated {formatDate(ticket.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 items-start">
              <span className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 ${priorities[ticket.priority].color} shadow-sm`}>
                {priorities[ticket.priority].label} Priority
              </span>
              
              <div className="relative group">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as Status)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 cursor-pointer appearance-none pr-10 ${statuses[ticket.status].color} shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <option value="OPEN">🟢 Open</option>
                  <option value="IN_PROGRESS">🔄 In Progress</option>
                  <option value="CLOSED">✓ Closed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-red-200 shadow-sm hover:shadow-md group"
                title="Delete ticket"
              >
                <Trash2 size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {/* Description Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Description</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">{ticket.description}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentList ticketId={ticket.id} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">Delete Ticket?</h3>
            <p className="text-slate-600 text-center mb-6">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}