import React, { useState } from 'react';
import { TinyEditor } from '../../../components/TinyEditor';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
}

const MailModal: React.FC<MailModalProps> = ({ isOpen, onClose, products = [] }) => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [mailContent, setMailContent] = useState('');

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleSendMail = () => {
    // Handle mail sending logic here
    console.log('Sending mail:', {
      from: fromEmail,
      to: toEmail,
      subject,
      content: mailContent,
      products
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Send Abandoned Cart Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fromEmail" className="text-sm font-medium text-gray-700">
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sender@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="toEmail" className="text-sm font-medium text-gray-700">
                To Email
              </label>
              <input
                type="email"
                id="toEmail"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recipient@example.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Complete your purchase - Items waiting in your cart"
            />
          </div>

          {/* Product Details */}
          {products.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cart Items</h3>
              <div className="space-y-3">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {/* ${(product.price * product?.quantity)?.toFixed(2)} */}
                      </p>
                      {/* <p className="text-sm text-gray-600">${product.price.toFixed(2)} each</p> */}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {/* ${calculateTotal().toFixed(2)} */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mail Content Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Email Content
            </label>
            <div className="border border-gray-300 rounded-md">
              <TinyEditor
                data={mailContent}
                handleEditorChange={setMailContent}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMail}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailModal;