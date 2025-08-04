import React, { useState, useEffect } from 'react';
import { TiptapEditor } from '../../../components/TiptapEditor';
import { getCartDetails } from "../../../Services/DM/Abandoned/services";

interface Product {
  name?: string;
  quantity?: number;
  price?: number;
  // Handle potential alternative structures
  selectedCourseType?: any[];
  course_name?: string;
  course_title?: string;
  product_name?: string;
  item_name?: string;
  qty?: number;
  amount?: number;
  cost?: number;
  total?: number;
  id?: number;
  [key: string]: any; // Allow for flexible structure
}

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  darkMode?: boolean;
  item?: number;
}

const MailModal: React.FC<MailModalProps> = ({ isOpen, onClose, products = [], darkMode = false, item }) => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [currencyType, setCurrencyType] = useState<string>('');

  // Debug: Log products structure
  useEffect(() => {
    const fetchCartDetails = async () => {
              try {
          const cartDetails = await getCartDetails(item?.toString() || '');
          console.log("cartDetails", cartDetails);
          setCartDetails(cartDetails);
          const currency = cartDetails?.cart?.currency_type || 'USD';
          setCurrencyType(currency);
          console.log("currencyType", currency);
        } catch (error) {
          console.error('Error fetching cart details:', error);
        }
    }
    fetchCartDetails();
  }, [item]);

  // Helper functions to extract data from various possible structures (kept for potential future use)
  // const getProductName = (product: Product): string => {
  //   return product.name || 
  //          product.course_name || 
  //          product.course_title || 
  //          product.product_name || 
  //          product.item_name || 
  //          'Unknown Product';
  // };

  const getProductQuantity = (product: Product): number => {
    return product.quantity || 
           product.qty || 
           (product.selectedCourseType?.length) || 
           1;
  };

  const getProductPrice = (product: Product): number => {
    return product.price || 
           product.amount || 
           product.cost || 
           product.total || 
           0;
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const price = getProductPrice(product);
      const quantity = getProductQuantity(product);
      return total + (price * quantity);
    }, 0);
  };

  const handleSendMail = async () => {
    setIsSending(true);
    try {
      // Handle mail sending logic here
      console.log('Sending mail:', {
        from: fromEmail,
        to: toEmail,
        subject,
        content: mailContent,
        products
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onClose();
    } catch (error) {
      console.error('Error sending mail:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden transition-colors duration-300 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Abandoned Cart Email</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recover lost sales with personalized emails</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(95vh-160px)]">
          {/* Email Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fromEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="sender@company.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="toEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                To Email
              </label>
              <input
                type="email"
                id="toEmail"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="customer@email.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="🛒 Don't miss out! Complete your purchase - Items waiting in your cart"
            />
          </div>
   
          {/* Product Details */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v7a1 1 0 001 1h10a1 1 0 001-1v-7m-8 7v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Abandoned Cart Items</h3>
              <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            {products.length > 0 ? (
              <div className="space-y-4">
                      {cartDetails?.cart_details?.map((item: any, index: number) => {
                        return (

                          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                            {item?.course_details?.map((itm: any, itemIndex: number) => {
                              
                              const courseTypeDisplay = itm.course_type === "oc"
                                ? "Video Course"
                                : itm.course_type === "pt"
                                ? "Practice Test"
                                : itm.course_type === "lab"
                                ? "Hands-On-Labs"
                                : ["sandbox-6", "sandbox-3","sandbox-1","sandbox"].includes(itm.course_type)
                                ? "Sandbox"
                                : "";

                              const priceDisplay = currencyType === "INR" &&
                                itm.sale_price &&
                                typeof itm.sale_price === 'object' &&
                                itm.sale_price.inr
                                  ? `₹ ${itm.sale_price.inr}`
                                  : ["USD", "EUR", "GBP"].includes(currencyType) &&
                                    itm.sale_price &&
                                    typeof itm.sale_price === 'object' &&
                                    itm.sale_price.usd
                                  ? `$ ${itm.sale_price.usd}`
                                  : currencyType === "INR" && itm.sale_price && typeof itm.sale_price === 'number'
                                  ? `₹ ${itm.sale_price}`
                                  : ["USD", "EUR", "GBP"].includes(currencyType) && itm.sale_price && typeof itm.sale_price === 'number'
                                  ? `$ ${itm.sale_price}`
                                  : "Free";


                              return (
                                <div key={itemIndex} className="flex justify-between items-center py-2">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {item.courseName || item.course_name || 'Course Name'} {courseTypeDisplay && `(${courseTypeDisplay})`}
                                    </h4>
                                  </div>
                                  <div className="text-center px-4">
                                    <span className="text-gray-600 dark:text-gray-400">Qty: 1</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {priceDisplay}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
                  <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Total Amount:
                    </span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v7a1 1 0 001 1h10a1 1 0 001-1v-7m-8 7v-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Cart Items</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">No abandoned cart items found for this customer.</p>
              </div>
            )}
          </div>

          {/* Mail Content Editor */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Email Content
            </label>
            <div className="w-full shadow-sm">
              <TiptapEditor
                data={mailContent}
                handleEditorChange={setMailContent}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMail}
              disabled={isSending || !fromEmail || !toEmail || !subject}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailModal;