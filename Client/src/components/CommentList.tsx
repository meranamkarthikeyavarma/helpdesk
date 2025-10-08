import React, { useState, useEffect } from 'react';
import type { Comment, CommentCreate } from '../types';
import { commentApi } from '../api/client';

interface Props {
  ticketId: string;
}

export default function CommentList({ ticketId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CommentCreate>({
    author: '',
    body: ''
  });
  const [errors, setErrors] = useState<{ author?: string; body?: string }>({});

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentApi.list(ticketId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { author?: string; body?: string } = {};

    if (!formData.author || formData.author.length < 2) {
      newErrors.author = 'Author name must be at least 2 characters';
    }
    if (!formData.body || formData.body.length < 2) {
      newErrors.body = 'Comment must be at least 2 characters';
    } else if (formData.body.length > 500) {
      newErrors.body = 'Comment must be at most 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await commentApi.create(ticketId, formData);
      setFormData({ author: '', body: '' });
      setErrors({});
      loadComments();
    } catch (err: any) {
      if (err.response?.data?.issues) {
        const apiErrors: { author?: string; body?: string } = {};
        err.response.data.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            apiErrors[issue.path[0] as keyof typeof apiErrors] = issue.message;
          }
        });
        setErrors(apiErrors);
      } else {
        alert('Failed to add comment');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-rose-500 to-pink-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Discussion</h2>
              <p className="text-sm text-slate-500">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading comments...</p>
          </div>
        ) : (
          <>
            {/* Comments List */}
            <div className="space-y-4 mb-8">
              {comments.map((comment, index) => (
                <div 
                  key={comment.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full ${getAvatarColor(comment.author)} flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300`}>
                        {getInitials(comment.author)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-slate-800 text-base">{comment.author}</span>
                          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{comment.body}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accent border on hover */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 py-16 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium text-lg">No comments yet</p>
                  <p className="text-slate-400 text-sm mt-1">Be the first to share your thoughts</p>
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add your comment
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className={`w-full px-4 py-3 border-2 ${errors.author ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none text-slate-800 placeholder-slate-400`}
                  />
                  {errors.author && (
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm font-medium">{errors.author}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your comment</label>
                  <textarea
                    placeholder="Share your thoughts..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className={`w-full px-4 py-3 border-2 ${errors.body ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none text-slate-800 placeholder-slate-400`}
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex-1">
                      {errors.body && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-red-600 text-sm font-medium">{errors.body}</p>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${formData.body.length > 500 ? 'text-red-600' : 'text-slate-400'}`}>
                      {formData.body.length}/500
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}