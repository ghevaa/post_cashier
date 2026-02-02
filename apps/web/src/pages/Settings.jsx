import React from 'react';
import Layout from '../components/Layout';
import StoreInfo from '../components/settings/StoreInfo';
import PrinterConfig from '../components/settings/PrinterConfig';
import UserManagement from '../components/settings/UserManagement';
import PaymentMethods from '../components/settings/PaymentMethods';
import SettingsFooter from '../components/settings/SettingsFooter';

const Settings = () => {
    return (
        <Layout>
            <div className="flex flex-col h-full relative">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32">
                    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
                        {/* Page Header */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-text-main dark:text-white">Store Configuration</h1>
                            <p className="text-text-muted dark:text-gray-400 text-base font-normal max-w-2xl">Manage general store details, hardware connections, payment methods, and staff access permissions.</p>
                        </div>

                        <StoreInfo />
                        <PrinterConfig />
                        <UserManagement />
                        <PaymentMethods />
                    </div>
                </div>

                {/* Sticky Footer */}
                <SettingsFooter />
            </div>
        </Layout>
    );
};

export default Settings;
