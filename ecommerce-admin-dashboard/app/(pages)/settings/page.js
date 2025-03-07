// app/settings/page.js
'use client';
import { useState } from 'react';
import { Cog6ToothIcon, LockClosedIcon, GlobeAltIcon, CreditCardIcon, TruckIcon, BellIcon, ShieldCheckIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [storeLogo, setStoreLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [formData, setFormData] = useState({
    storeName: 'Ecommerce Pro',
    currency: 'USD',
    timezone: 'UTC',
    email: 'support@ecompro.com',
    maintenanceMode: false,
    twoFactorAuth: true,
    paymentMethods: {
      stripe: true,
      paypal: false,
      cod: true
    },
    taxRates: [
      { region: 'Default', rate: 7.5 }
    ],
    shippingZones: [
      { name: 'Domestic', countries: ['US'], methods: ['flat_rate'] }
    ]
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Settings updated:', formData);
  };

  const SettingsSection = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-6">
        {icon}
        <h3 className="text-xl font-semibold ml-3 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Cog6ToothIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
        <h1 className="text-2xl font-bold dark:text-white">Store Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSection('general')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeSection === 'general' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <GlobeAltIcon className="h-5 w-5 mr-3" />
            General
          </button>
          <button
            onClick={() => setActiveSection('payments')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeSection === 'payments' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <CreditCardIcon className="h-5 w-5 mr-3" />
            Payments
          </button>
          <button
            onClick={() => setActiveSection('shipping')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeSection === 'shipping' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <TruckIcon className="h-5 w-5 mr-3" />
            Shipping
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeSection === 'notifications' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <BellIcon className="h-5 w-5 mr-3" />
            Notifications
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeSection === 'security' 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ShieldCheckIcon className="h-5 w-5 mr-3" />
            Security
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeSection === 'general' && (
            <SettingsSection
              title="General Settings"
              icon={<GlobeAltIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Store Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {previewLogo ? (
                          <img src={previewLogo} alt="Store Logo" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="logoUpload"
                      />
                      <label
                        htmlFor="logoUpload"
                        className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-sm cursor-pointer"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </label>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setPreviewLogo('')}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Default Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                  />
                  <label className="text-sm font-medium dark:text-gray-300">
                    Enable Maintenance Mode
                  </label>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Payment Settings */}
          {activeSection === 'payments' && (
            <SettingsSection
              title="Payment Gateways"
              icon={<CreditCardIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            >
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium dark:text-white">Stripe</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Credit card payments</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.stripe}
                        onChange={(e) => setFormData({
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, stripe: e.target.checked }
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  {formData.paymentMethods.stripe && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Publishable Key"
                        className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        placeholder="Secret Key"
                        className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* Add similar blocks for PayPal and other payment methods */}
              </div>
            </SettingsSection>
          )}

          {/* Shipping Settings */}
          {activeSection === 'shipping' && (
            <SettingsSection
              title="Shipping Configuration"
              icon={<TruckIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            >
              <div className="space-y-6">
                <div className="border rounded-lg dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <h4 className="font-medium dark:text-white">Shipping Zones</h4>
                  </div>
                  <div className="p-4">
                    {formData.shippingZones.map((zone, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="dark:text-gray-300">{zone.name}</span>
                          <button className="text-blue-600 dark:text-blue-400 text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="text-blue-600 dark:text-blue-400 text-sm">
                      + Add Shipping Zone
                    </button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <SettingsSection
              title="Security Settings"
              icon={<ShieldCheckIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.twoFactorAuth}
                    onChange={(e) => setFormData({ ...formData, twoFactorAuth: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}

          {/* Form Submission */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky bottom-0">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}