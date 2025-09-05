import React, { useState, useEffect } from 'react';
import { Drawer, Input, Button, Divider, Tag, Card, Badge, Typography } from 'antd';
import { getCartDetails, mailSubject } from "../../../../Services/DM/Abandoned/services";
import {
  MailOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  SendOutlined,
  LoadingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { TinyEditor } from '../../../../components/TextEditor';

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
  userEmail?: string;
}

const MailDrawer: React.FC<MailModalProps> = ({
  isOpen,
  onClose,
  products = [],
  darkMode = false,
  userId,
  userEmail
}) => {
  const [fromEmail, setFromEmail] = useState('support@whizlabs.com');
  const [toEmail, setToEmail] = useState(userEmail);
  const [subject, setSubject] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cartDetails, setCartDetails] = useState<any>(null);
  const [currencyType, setCurrencyType] = useState<string>('');
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const cartDetails = await getCartDetails(userId?.toString() || '');
        setCartDetails(cartDetails);
        const items = cartDetails?.cart_details || [];
        if (items.length === 0) return;

        let filteredItems: any[] = [];

        items.forEach((item: any) => {
          const selectedTypes = item.selectedCourseType || [];
          const courses = item.course_details || [];
          const courseName = item.courseName;
          const courseId = item.course_id;

          courses.forEach((course: any) => {
            if (selectedTypes.includes(course.course_type)) {
              filteredItems.push({
                ...course,
                courseName,
                courseId
              });
            }
          });
        });

        let orderBy = ['pt', 'oc', 'lab', 'sandbox', 'sandbox-1', 'sandbox-3', 'sandbox-6'];

        filteredItems = filteredItems?.sort((a: any, b: any) => {
          let courseId = a.courseId - b.courseId;
          let courseType = orderBy.indexOf(a.course_type) - orderBy.indexOf(b.course_type);
          if (courseId !== 0) return courseId;
          return courseType;
        });

        setCartItems(filteredItems);
        setCurrencyType(cartDetails?.cart?.currency_type || 'USD');
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };

    if (isOpen && userId) {
      fetchCartDetails();
    }

    const fetchMailSubject = async () => {
      const res = await mailSubject();
      setSubject(res.data[0].value);
    };
    fetchMailSubject();
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
        <div className="flex items-center gap-2 sm:gap-3 dark:text-gray-100">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <ShoppingCartOutlined className="text-white text-sm sm:text-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <Title level={4} className="!mb-0 text-gray-800 dark:text-white text-sm sm:text-base truncate">
              Send Abandoned Cart Email
            </Title>
            <Text className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm hidden sm:block">
              Recover lost sales with personalized emails
            </Text>
          </div>
        </div>
      }
      placement="right"
      width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 900}
      onClose={onClose}
      open={isOpen}
      className={`${darkMode ? "dark" : ""}`}
      styles={{
        header: {
          background: darkMode ? '#1f2937' : '#ffffff',
          borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          padding: '12px 16px'
        },
        body: {
          background: darkMode ? '#111827' : '#f9fafb',
          padding: '12px 16px'
        }
      }}
      extra={
        <Button
          type="primary"
          size="middle"
          icon={isSending ? <LoadingOutlined spin /> : <SendOutlined />}
          disabled={isSending || !fromEmail || !toEmail || !subject}
          onClick={handleSendMail}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">{isSending ? "Sending..." : "Send Email"}</span>
          <span className="sm:hidden">{isSending ? "..." : "Send"}</span>
        </Button>
      }
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Email Fields */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <MailOutlined className="text-blue-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Email Details</span>
            </div>
          }
          className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '12px 16px' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            />
          </div>
        </Card>

        {/* Cart Items */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <ShoppingOutlined className="text-orange-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Abandoned Cart Items</span>
              <Badge count={cartItems?.length || 0} className="ml-2" />
            </div>
          }
          className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '12px 16px' }}
        >
          {cartItems?.length ? (
            <div className="space-y-4">
              {cartItems?.map((itm: any, i: number) => {
                const courseTypeDisplay = getCourseTypeDisplay(itm.course_type);
                const courseTypeColor = getCourseTypeColor(itm.course_type);

                const priceDisplay =
                  currencyType === "INR" && itm.sale_price?.inr
                    ? `₹ ${itm.sale_price.inr}`
                    : currencyType === "USD" && itm.sale_price?.usd
                      ? `$ ${itm.sale_price.usd}`
                      : currencyType === "EUR" && itm.sale_price?.eur
                        ? `€ ${itm.sale_price.eur}`
                        : currencyType === "GBP" && itm.sale_price?.gbp
                          ? `£ ${itm.sale_price.gbp}`
                          : "Free";

                return (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2 sm:space-y-0"
                  >
                    <div className="flex-1 min-w-0">
                      <Text className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                        {itm.courseName || 'Course Name'}
                      </Text>
                      {courseTypeDisplay && (
                        <Tag color={courseTypeColor} className="ml-0 sm:ml-2 mt-1 sm:mt-0">
                          {courseTypeDisplay}
                        </Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Text className="font-semibold text-base sm:text-lg text-green-600 dark:text-green-400">
                        {priceDisplay}
                      </Text>
                    </div>
                  </div>
                );
              })}

              <Divider className="my-6" />

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarOutlined className="text-blue-500 text-xl" />
                    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Total Amount</Text>
                  </div>
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {currencyType == "INR"
                      ? "₹"
                      : currencyType == "USD"
                        ? "$"
                        : currencyType == "EUR"
                          ? "€"
                          : currencyType == "GBP"
                            ? "£"
                            : ""}{" "}
                    {cartDetails?.cart?.total_price}
                  </Text>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCartOutlined className="text-3xl text-gray-400 dark:text-gray-500" />
              </div>
              <Text className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No abandoned cart items found
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm block mt-2">
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
          className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          bodyStyle={{ padding: '12px 16px' }}
        >
          <TinyEditor data={mailContent} handleEditorChange={setMailContent} darkMode={darkMode} />
        </Card>
      </div>
    </Drawer>
  );
};

export default MailDrawer;
