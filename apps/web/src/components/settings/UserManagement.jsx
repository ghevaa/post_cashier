import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // Track which user action is loading

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const data = await api.users.team();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            setActionLoading(userId);
            await api.users.approve(userId);
            await fetchTeam(); // Refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        try {
            setActionLoading(userId);
            await api.users.reject(userId);
            await fetchTeam(); // Refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (userId) => {
        if (!confirm('Are you sure you want to remove this user from your store?')) {
            return;
        }
        try {
            setActionLoading(userId);
            await api.users.remove(userId);
            await fetchTeam(); // Refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cashier': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                        Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <span className="size-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
                        Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <span className="size-1.5 rounded-full bg-red-600 dark:bg-red-400"></span>
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Unknown
                    </span>
                );
        }
    };

    // Separate pending users from others
    const pendingUsers = users.filter(u => u.status === 'pending');
    const activeUsers = users.filter(u => u.status === 'active');
    const rejectedUsers = users.filter(u => u.status === 'rejected');

    if (loading) {
        return (
            <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        <h2 className="text-text-main dark:text-white text-lg font-bold">User Management</h2>
                    </div>
                </div>
                <div className="p-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    <h2 className="text-text-main dark:text-white text-lg font-bold">User Management</h2>
                </div>
                <span className="text-sm text-text-muted">{users.length} team members</span>
            </div>

            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Pending Users Section */}
            {pendingUsers.length > 0 && (
                <div className="px-6 pt-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">pending_actions</span>
                            Pending Approval ({pendingUsers.length})
                        </h3>
                        <div className="space-y-3">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-sm">
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-main dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-text-muted">{user.email}</p>
                                        </div>
                                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            disabled={actionLoading === user.id}
                                            className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-lg">check</span>
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id)}
                                            disabled={actionLoading === user.id}
                                            className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-text-muted dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Staff Member</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Access Level</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color dark:divide-gray-800">
                        {activeUsers.length === 0 && pendingUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                    No team members yet. Share your invite code to add managers and cashiers.
                                </td>
                            </tr>
                        ) : (
                            activeUsers.map(user => (
                                <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <div
                                                    className="size-9 rounded-full bg-cover bg-center bg-gray-200"
                                                    style={{ backgroundImage: `url("${user.image}")` }}
                                                ></div>
                                            ) : (
                                                <div className="size-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                                    {getInitials(user.name)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-text-main dark:text-white text-sm">{user.name}</p>
                                                <p className="text-xs text-text-muted">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-main dark:text-gray-300 capitalize">
                                        {user.accessLevel?.replace('_', ' ') || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.id !== currentUser?.id && user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleRemove(user.id)}
                                                disabled={actionLoading === user.id}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                                                title="Remove from store"
                                            >
                                                <span className="material-symbols-outlined">person_remove</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default UserManagement;
