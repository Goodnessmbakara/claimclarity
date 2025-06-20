import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, DollarSign, Calendar, User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const statusIcons = {
  'Approved': <CheckCircle className="w-4 h-4 text-emerald-500" />,
  'Pending': <Clock className="w-4 h-4 text-amber-500" />,
  'Denied': <XCircle className="w-4 h-4 text-red-500" />,
  'Under Review': <AlertCircle className="w-4 h-4 text-blue-500" />
};

const statusColors = {
  'Approved': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  'Pending': 'bg-amber-50 border-amber-200 text-amber-800',
  'Denied': 'bg-red-50 border-red-200 text-red-800',
  'Under Review': 'bg-blue-50 border-blue-200 text-blue-800'
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timeString = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-xs sm:max-w-md lg:max-w-2xl ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar and Name */}
        <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              {isUser ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-xs font-medium text-gray-600">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
          </div>
        </div>

        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
          }`}
        >
          <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
            {message.content}
          </div>
          
          {message.claimData && (
            <div className={`mt-4 p-4 rounded-xl border-2 ${statusColors[message.claimData.status]} bg-white`}>
              <div className="flex items-center gap-2 mb-3">
                {statusIcons[message.claimData.status]}
                <span className="font-bold text-sm">
                  Claim {message.claimData.claimId}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  message.claimData.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  message.claimData.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  message.claimData.status === 'Denied' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {message.claimData.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 font-medium leading-relaxed">
                {message.claimData.details}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                {message.claimData.amount && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-500">Claim Amount</div>
                      <div className="font-bold text-gray-900">${message.claimData.amount.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                {message.claimData.submissionDate && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-500">Submitted</div>
                      <div className="font-bold text-gray-900">{message.claimData.submissionDate}</div>
                    </div>
                  </div>
                )}
                
                {message.claimData.expectedResolution && 
                 message.claimData.expectedResolution !== 'Completed' && 
                 message.claimData.expectedResolution !== 'Final decision' && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg sm:col-span-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium text-gray-500">Expected Resolution</div>
                      <div className="font-bold text-gray-900">{message.claimData.expectedResolution}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
          {timeString}
        </div>
      </div>
    </div>
  );
}