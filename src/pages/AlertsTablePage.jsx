import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import {
  Eye,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Search
} from "lucide-react";

const AlertsTable = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allFormCount, setAllFormCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
const filteredAlerts = alerts.filter(alert => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      alert.clientName.toLowerCase().includes(searchLower) ||
      alert.phone.toLowerCase().includes(searchLower) ||
      alert.location.toLowerCase().includes(searchLower) ||
      alert.email.toLowerCase().includes(searchLower) ||
      alert.placeAddress.toLowerCase().includes(searchLower) ||
      alert.decription.toLowerCase().includes(searchLower) ||
      alert.status.toLowerCase().includes(searchLower) ||
      alert.dateTime.toLowerCase().includes(searchLower)
    );
  });
  // API base URL - adjust this to match your backend URL
const API = import.meta.env.VITE_API_URL || '/api';
  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/messages`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to match frontend format
        const transformedAlerts = data.data.map(message => ({
          id: message._id,
          Subject: `${message.projectDescription.substring(0, 30)}...`,
          decription: message.projectDescription,
          clientName: `${message.firstName} ${message.lastName}`,
          dateTime: new Date(message.createdAt).toLocaleDateString('fr-FR'),
          status: message.status,
          phone: message.phone,
          location: message.localisation,

          email: message.email,
          placeAddress: message.placeAddress,
          firstName: message.firstName,
          lastName: message.lastName,
        }));
        
        setAlerts(transformedAlerts);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update message status
  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const response = await fetch(`${API}/api/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setAlerts(prevAlerts =>
          prevAlerts.map(alert =>
            alert.id === messageId ? { ...alert, status: newStatus } : alert
          )
        );
        
        if (selectedAlert && selectedAlert.id === messageId) {
          setSelectedAlert({ ...selectedAlert, status: newStatus });
        }
      } else {
        throw new Error(data.message || 'Failed to update message status');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating message status:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Total alerts
    setAllFormCount(alerts.length);

    // Count by status
    setWaitingCount(
      alerts.filter((alert) => alert.status === "waiting").length
    );
    setDoneCount(alerts.filter((alert) => alert.status === "done").length);
    setCancelledCount(
      alerts.filter((alert) => alert.status === "cancelled").length
    );
  }, [alerts]);

  const [configuredAlerts, setConfiguredAlerts] = useState([
    { name: "All Form Submissions", count: allFormCount },
    { name: "Already Done", count: doneCount },
    { name: "Waiting", count: waitingCount },
    { name: "Cancelled", count: cancelledCount },
  ]);

  useEffect(() => {
    setConfiguredAlerts([
      { name: "All Form Submissions", count: allFormCount },
      { name: "Already Done", count: doneCount },
      { name: "Waiting", count: waitingCount },
      { name: "Cancelled", count: cancelledCount },
    ]);
  }, [allFormCount, waitingCount, doneCount, cancelledCount]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "text-green-600 bg-green-50 border-green-200";
      case "waiting":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-4 h-4" />;
      case "waiting":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewClick = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedAlert) {
      await updateMessageStatus(selectedAlert.id, newStatus);
    }
  };

  const handleRefresh = () => {
    fetchMessages();
  };

   const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = filteredAlerts.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  // Loading state
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sm:hidden h-12"></div>

      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

          <TopNavigation />
          <div className="flex">
            <Sidebar />
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
      </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-gray-50">
      <div className="sm:hidden h-12"></div>

          <TopNavigation />
          <div className="flex">

            <Sidebar />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="md:text-2xl text-xl font-bold text-gray-900 mb-2">
            Alerts List
          </h1>
          <p className="text-gray-600">
            <span className="hidden sm:inline"> A summary of contact form submissions and project inquiries</span> 
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <RefreshCw className="md:w-4 md:h-4 h-5 w-5  md:mr-2" />
          <span className="hidden sm:inline" >Refresh </span> 
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Alerts Table */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="md:text-lg text-sm font-semibold text-gray-900">
                CONTACT FORM ALERTS
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentAlerts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No messages found
                      </td>
                    </tr>
                  ) : (
                    currentAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alert.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {alert.dateTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              alert.status
                            )}`}
                          >
                            {getStatusIcon(alert.status)}
                            <span className="ml-1.5 capitalize">
                              {alert.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {alert.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {alert.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewClick(alert)}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {alerts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  {/* Pagination Info */}
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, alerts.length)} of {alerts.length}{" "}
                      results
                    </span>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="hidden sm:inline">←</span> Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;

                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage) {
                          // Show ellipsis
                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isCurrentPage
                                ? "bg-red-500 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next <span className="hidden sm:inline">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configured Alerts Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                CONFIGURED ALERTS
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {configuredAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-800">
                      {alert.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {alert.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Message Details
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Client Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Client Name
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {selectedAlert.clientName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone Number
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedAlert.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Location
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedAlert.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date Submitted
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedAlert.dateTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedAlert.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Project Address
                        </p>
                        <p className="text-base text-gray-900">
                          {selectedAlert.placeAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Project Description
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {selectedAlert.decription}
                    </p>
                  </div>
                </div>

                {/* Status Management */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Current Status
                    </h4>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedAlert.status
                      )}`}
                    >
                      {getStatusIcon(selectedAlert.status)}
                      <span className="ml-2 capitalize">
                        {selectedAlert.status}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange("waiting")}
                      disabled={selectedAlert.status === "waiting"}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAlert.status === "waiting"
                          ? "bg-orange-500 text-white cursor-not-allowed"
                          : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      Mark as Waiting
                    </button>
                    <button
                      onClick={() => handleStatusChange("done")}
                      disabled={selectedAlert.status === "done"}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAlert.status === "done"
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Mark as Done
                    </button>
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      disabled={selectedAlert.status === "cancelled"}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAlert.status === "cancelled"
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      }`}
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Mark as Cancelled
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
    <div className="h-16"></div>
        </div>
  );
};

export default AlertsTable;