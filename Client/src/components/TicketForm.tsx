import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Priority, TicketCreate } from '../types';
import { ticketApi } from '../api/client';

export default function TicketForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TicketCreate>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    reporter: ''
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    reporter?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title || formData.title.length < 4) {
      newErrors.title = 'Title must be at least 4 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be at most 100 characters';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.reporter || formData.reporter.length < 2) {
      newErrors.reporter = 'Reporter name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const ticket = await ticketApi.create(formData);
      navigate(`/tickets/${ticket.id}`);
    } catch (err: any) {
      if (err.response?.data?.issues) {
        const apiErrors: typeof errors = {};
        err.response.data.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            apiErrors[issue.path[0] as keyof typeof apiErrors] = issue.message;
          }
        });
        setErrors(apiErrors);
      } else {
        alert('Failed to create ticket');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority', icon: '📘', color: 'from-blue-500 to-cyan-500' },
    { value: 'MEDIUM', label: 'Medium Priority', icon: '📙', color: 'from-yellow-500 to-orange-500' },
    { value: 'HIGH', label: 'High Priority', icon: '📕', color: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/tickets')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group transition-all duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to tickets
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Ticket</h1>
              <p className="text-slate-600 mt-1">Fill in the details to report a new issue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                <span className="font-medium text-slate-700">Ticket Information</span>
              </div>
              <span className="text-slate-500">Required fields marked with <span className="text-red-500">*</span></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Ticket Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border-2 ${errors.title ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none text-slate-800 placeholder-slate-400`}
                placeholder="e.g., Login page not responding"
                maxLength={100}
              />
              <div className="flex items-center justify-between">
                {errors.title ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{errors.title}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Brief and descriptive title</p>
                )}
                <span className={`text-sm font-medium ${formData.title.length > 100 ? 'text-red-600' : 'text-slate-400'}`}>
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-3 border-2 ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none text-slate-800 placeholder-slate-400`}
                rows={5}
                placeholder="Provide detailed information about the issue, including steps to reproduce..."
              />
              {errors.description ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-sm font-medium">{errors.description}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Include all relevant details and context</p>
              )}
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Priority Level
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as Priority })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.priority === option.value
                        ? `border-transparent shadow-lg scale-105`
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {formData.priority === option.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 rounded-xl`}></div>
                    )}
                    <div className="relative flex flex-col items-center gap-2">
                      <span className="text-3xl">{option.icon}</span>
                      <span className={`text-sm font-semibold ${
                        formData.priority === option.value ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {option.label.split(' ')[0]}
                      </span>
                    </div>
                    {formData.priority === option.value && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reporter Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Reporter Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                className={`w-full px-4 py-3 border-2 ${errors.reporter ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none text-slate-800 placeholder-slate-400`}
                placeholder="Enter your full name"
              />
              {errors.reporter ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-sm font-medium">{errors.reporter}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Who is reporting this issue?</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Ticket...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Create Ticket</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="px-6 py-3.5 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Need help? Contact support at <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 font-medium">support@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}