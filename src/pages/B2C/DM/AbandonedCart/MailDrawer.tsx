import React, { useState, useEffect } from 'react';
import { Drawer, Input, Button, Divider, Tag, Card, Badge, Typography } from 'antd';
import { TiptapEditor } from '../../../../components/TiptapEditor';
import { getCartDetails } from "../../../../Services/DM/Abandoned/services";
import {
  MailOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  SendOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Product {
  name?: string;
  quantity?: number;
  price?: number;
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
  [key: string]: any;
}

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  darkMode?: boolean;
  userId?: number;
}

const MailDrawer: React.FC<MailModalProps> = ({ isOpen, onClose, products = [], darkMode = false, userId }) => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [currencyType, setCurrencyType] = useState<string>('');

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const cartDetails = await getCartDetails(userId?.toString() || '');
        setCartDetails(cartDetails);
        const currency = cartDetails?.cart?.currency_type || 'USD';
        setCurrencyType(currency);
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };
    if (isOpen) fetchCartDetails();
  }, [userId, isOpen]);


  const handleSendMail = async () => {
    setIsSending(true);
    try {
      console.log('Sending mail:', {
        from: fromEmail,
        to: toEmail,
        subject,
        content: mailContent,
        products
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      onClose();
    } catch (error) {
      console.error('Error sending mail:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getCourseTypeColor = (courseType: string) => {
    switch (courseType) {
      case 'oc': return 'blue';
      case 'pt': return 'green';
      case 'lab': return 'orange';
      case 'sandbox':
      case 'sandbox-1':
      case 'sandbox-3':
      case 'sandbox-6': return 'purple';
      default: return 'default';
    }
  };

  const getCourseTypeDisplay = (courseType: string) => {
    switch (courseType) {
      case 'oc': return 'Video Course';
      case 'pt': return 'Practice Test';
      case 'lab': return 'Hands-On Labs';
      case 'sandbox':
      case 'sandbox-1':
      case 'sandbox-3':
      case 'sandbox-6': return 'Sandbox';
      default: return '';
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <ShoppingCartOutlined className="text-white text-lg" />
          </div>
          <div>
            <Title level={4} className="!mb-0 !text-gray-800 dark:!text-gray-100">
              Send Abandoned Cart Email
            </Title>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Recover lost sales with personalized emails
            </Text>
          </div>
        </div>
      }
      placement="right"
      width={900}
      onClose={onClose}
      open={isOpen}
      className="dark:bg-gray-900"
      styles={{
        header: {
          background: darkMode ? '#1f2937' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
        },
        body: {
          background: darkMode ? '#111827' : '#f9fafb',
          padding: '24px'
        }
      }}
      extra={
        <Button
          type="primary"
          size="large"
          icon={isSending ? <LoadingOutlined spin /> : <SendOutlined />}
          disabled={isSending || !fromEmail || !toEmail || !subject}
          onClick={handleSendMail}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSending ? "Sending..." : "Send Email"}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Email Fields */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <MailOutlined className="text-blue-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Email Details</span>
            </div>
          }
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '24px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <UserOutlined className="mr-2 text-blue-500" /> From Email
              </label>
              <Input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="sender@company.com"
                size="large"
                className="hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <MailOutlined className="mr-2 text-green-500" /> To Email
              </label>
              <Input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="customer@email.com"
                size="large"
                className="hover:border-green-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              <FileTextOutlined className="mr-2 text-purple-500" /> Subject Line
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="🛒 Don't miss out! Complete your purchase"
              size="large"
              className="hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </Card>

        {/* Cart Items */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <ShoppingOutlined className="text-orange-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Abandoned Cart Items</span>
              <Badge count={cartDetails?.cart_details?.length || 0} className="ml-2" />
            </div>
          }
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '24px' }}
        >
          {cartDetails?.cart_details?.length ? (
            <div className="space-y-4">
              {cartDetails?.cart_details?.map((item: any, index: number) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <ClockCircleOutlined className="text-orange-500" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Cart #{item?.cart_id || index + 1}
                    </Text>
                  </div>
                  
                  {item?.course_details?.map((itm: any, i: number) => {
                    const courseTypeDisplay = getCourseTypeDisplay(itm.course_type);
                    const courseTypeColor = getCourseTypeColor(itm.course_type);

                    const priceDisplay =
                      currencyType === "INR" && itm.sale_price?.inr
                        ? `₹ ${itm.sale_price.inr}`
                        : itm.sale_price?.usd
                          ? `$ ${itm.sale_price.usd}`
                          : "Free";

                    return (
                      <div key={i} className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex-1">
                          <Text className="font-medium text-gray-900 dark:text-gray-100">
                            {itm.course_name || 'Course Name'}
                          </Text>
                          {courseTypeDisplay && (
                            <Tag color={courseTypeColor} className="ml-2">
                              {courseTypeDisplay}
                            </Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Tag color="blue" className="font-medium">
                            Qty: 1
                          </Tag>
                          <Text className="font-semibold text-lg text-green-600 dark:text-green-400">
                            {priceDisplay}
                          </Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              <Divider className="my-6" />
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarOutlined className="text-blue-500 text-xl" />
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Total Amount</Text>
                  </div>
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                
                  </Text>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCartOutlined className="text-3xl text-gray-400 dark:text-gray-500" />
              </div>
              <Text className="text-gray-500 dark:text-gray-400 text-lg">No abandoned cart items found</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm block mt-2">
                The cart appears to be empty or has been cleared
              </Text>
            </div>
          )}
        </Card>

        {/* Mail Content */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-indigo-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Email Content</span>
            </div>
          }
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '24px' }}
        >
          <TiptapEditor
            data={mailContent}
            handleEditorChange={setMailContent}
            darkMode={darkMode}
          />
        </Card>
      </div>
    </Drawer>
  );
};

export default MailDrawer;
