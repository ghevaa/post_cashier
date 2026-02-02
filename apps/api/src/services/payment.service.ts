import midtransClient from 'midtrans-client';

// Lazy initialize clients
let snap: any = null;
let coreApi: any = null;

function getSnap() {
    if (!snap) {
        console.log('📦 Initializing Midtrans Snap with server key:', process.env.MIDTRANS_SERVER_KEY?.substring(0, 20) + '...');
        snap = new midtransClient.Snap({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY || '',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
        });
    }
    return snap;
}

function getCoreApi() {
    if (!coreApi) {
        coreApi = new midtransClient.CoreApi({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY || '',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
        });
    }
    return coreApi;
}

export interface PaymentItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CustomerDetails {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface CreateSnapTokenParams {
    orderId: string;
    grossAmount: number;
    items: PaymentItem[];
    customer?: CustomerDetails;
}

export class PaymentService {
    /**
     * Create a Snap transaction token
     */
    async createSnapToken(params: CreateSnapTokenParams) {
        const { orderId, grossAmount, items, customer } = params;

        // Calculate item total to ensure it matches gross_amount
        const itemTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        console.log('📦 Creating Snap Token:', { orderId, grossAmount, itemTotal, items });

        // Midtrans requires item total to match gross_amount
        const transactionDetails = {
            order_id: orderId,
            gross_amount: Math.round(itemTotal), // Use calculated item total
        };

        const itemDetails = items.map(item => ({
            id: String(item.id).substring(0, 50),
            name: item.name.substring(0, 50), // Midtrans limits name to 50 chars
            price: Math.round(item.price),
            quantity: item.quantity,
        }));

        const customerDetails = customer ? {
            first_name: customer.firstName,
            last_name: customer.lastName || '',
            email: customer.email || 'customer@example.com',
            phone: customer.phone || '08123456789',
        } : {
            first_name: 'Customer',
            email: 'customer@example.com',
            phone: '08123456789',
        };

        const parameter = {
            transaction_details: transactionDetails,
            item_details: itemDetails,
            customer_details: customerDetails,
        };

        console.log('📦 Midtrans Request:', JSON.stringify(parameter, null, 2));

        try {
            const snapClient = getSnap();
            const transaction = await snapClient.createTransaction(parameter);
            console.log('✅ Snap Token created:', transaction.token?.substring(0, 20) + '...');
            return {
                token: transaction.token,
                redirectUrl: transaction.redirect_url,
            };
        } catch (error: any) {
            console.error('❌ Failed to create Snap token:', error?.message || error);
            console.error('❌ Error details:', error?.ApiResponse || error);
            throw error;
        }
    }

    /**
     * Handle notification from Midtrans webhook
     */
    async handleNotification(notificationBody: any) {
        try {
            const statusResponse = await getCoreApi().transaction.notification(notificationBody);

            const orderId = statusResponse.order_id;
            const transactionStatus = statusResponse.transaction_status;
            const fraudStatus = statusResponse.fraud_status;

            console.log(`📦 Midtrans Notification - Order: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

            let paymentStatus: 'pending' | 'completed' | 'cancelled' | 'refunded' = 'pending';

            if (transactionStatus === 'capture') {
                if (fraudStatus === 'accept') {
                    paymentStatus = 'completed';
                }
            } else if (transactionStatus === 'settlement') {
                paymentStatus = 'completed';
            } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
                paymentStatus = 'cancelled';
            } else if (transactionStatus === 'refund' || transactionStatus === 'partial_refund') {
                paymentStatus = 'refunded';
            } else if (transactionStatus === 'pending') {
                paymentStatus = 'pending';
            }

            return {
                orderId,
                transactionStatus,
                fraudStatus,
                paymentStatus,
                paymentType: statusResponse.payment_type,
                grossAmount: statusResponse.gross_amount,
            };
        } catch (error) {
            console.error('Failed to handle notification:', error);
            throw error;
        }
    }

    /**
     * Check transaction status
     */
    async checkStatus(orderId: string) {
        try {
            const statusResponse = await getCoreApi().transaction.status(orderId);
            return {
                orderId: statusResponse.order_id,
                transactionStatus: statusResponse.transaction_status,
                fraudStatus: statusResponse.fraud_status,
                paymentType: statusResponse.payment_type,
                grossAmount: statusResponse.gross_amount,
                transactionTime: statusResponse.transaction_time,
            };
        } catch (error) {
            console.error('Failed to check status:', error);
            throw error;
        }
    }

    /**
     * Get Midtrans client key for frontend
     */
    getClientKey() {
        return process.env.MIDTRANS_CLIENT_KEY || '';
    }

    /**
     * Check if production mode
     */
    isProduction() {
        return process.env.MIDTRANS_IS_PRODUCTION === 'true';
    }
}

export const paymentService = new PaymentService();
