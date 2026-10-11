import toast from 'react-hot-toast';
import axios from 'axios';

const success = (message: string) =>
    toast.success(message, {
        style: {
            background: '#22c55e',
            color: '#fff',
            fontWeight: '500',
        },
        iconTheme: { primary: '#fff', secondary: '#22c55e' },
    });

const error = (error: unknown) => {
    const msg = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Something went wrong'
        : 'Something went wrong';

    toast.error(msg, {
        style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '500',
        },
        iconTheme: { primary: '#fff', secondary: '#ef4444' },
    });
};

export const toastService = { success, error };