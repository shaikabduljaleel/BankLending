import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  DollarSign,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";

// ==================== REUSABLE UI COMPONENTS ====================

// TabButton.js
export const TabButton = ({ tab, icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    <Icon size={20} />
    {label}
  </button>
);

// MessageDisplay.js
export const MessageDisplay = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        message.includes("Error") || message.includes("error")
          ? "bg-red-100 text-red-700 border border-red-200"
          : "bg-green-100 text-green-700 border border-green-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        {message}
      </div>
    </div>
  );
};

// InputField.js
export const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  min, 
  step, 
  className = "" 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder={placeholder}
      required={required}
      min={min}
      step={step}
    />
  </div>
);

// SelectField.js
export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  required = false, 
  className = "" 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// StatsCard.js
export const StatsCard = ({ title, value, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <p className="text-sm text-gray-600">{title}</p>
    <p className={`text-xl font-bold ${textColor}`}>
      {typeof value === 'number' && title.includes('₹') ? `₹${value}` : value}
    </p>
  </div>
);

// ==================== TABLE COMPONENTS ====================

// TransactionTable.js
export const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No transactions found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={transaction.transaction_id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-4 py-2">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                ₹{transaction.amount}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === "EMI"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== LOAN COMPONENTS ====================

// LoanProgressBar.js
export const LoanProgressBar = ({ amountPaid, totalAmount }) => {
  const progressPercentage = (amountPaid / totalAmount) * 100;
  
  return (
    <div className="bg-gray-50 p-3 rounded">
      <p className="text-sm text-gray-600 mb-1">Progress</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {progressPercentage.toFixed(1)}% completed
      </p>
    </div>
  );
};

// LoanCard.js
export const LoanCard = ({ loan, index }) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-semibold text-lg">Loan #{index + 1}</h4>
      <span className="text-sm text-gray-500 font-mono">{loan.loan_id}</span>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Principal:</span>
          <span className="font-medium">₹{loan.principal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-medium">₹{loan.total_amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Interest:</span>
          <span className="font-medium text-orange-600">₹{loan.total_interest}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">EMI Amount:</span>
          <span className="font-medium">₹{loan.emi_amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount Paid:</span>
          <span className="font-medium text-green-600">₹{loan.amount_paid}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">EMIs Left:</span>
          <span className="font-medium text-blue-600">{loan.emis_left}</span>
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <LoanProgressBar amountPaid={loan.amount_paid} totalAmount={loan.total_amount} />
      </div>
    </div>
  </div>
);

// ==================== TAB COMPONENTS ====================

// CreateLoanTab.js
export const CreateLoanTab = ({ lendForm, setLendForm, handleLend, loading, customers }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <PlusCircle className="text-blue-600" />
      Create New Loan
    </h2>
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <SelectField
          label="Customer"
          value={lendForm.customer_id}
          onChange={(e) => setLendForm({ ...lendForm, customer_id: e.target.value })}
          options={customers.map(customer => ({
            value: customer.customer_id,
            label: `${customer.name} (${customer.customer_id})`
          }))}
          placeholder="Select Customer"
          required
        />
        <InputField
          label="Loan Amount (₹)"
          type="number"
          value={lendForm.loan_amount}
          onChange={(e) => setLendForm({ ...lendForm, loan_amount: e.target.value })}
          placeholder="Enter loan amount"
          required
          min="1"
        />
        <InputField
          label="Loan Period (Years)"
          type="number"
          value={lendForm.loan_period_years}
          onChange={(e) => setLendForm({ ...lendForm, loan_period_years: e.target.value })}
          placeholder="Enter loan period"
          required
          min="1"
        />
        <InputField
          label="Interest Rate (%)"
          type="number"
          step="0.1"
          value={lendForm.interest_rate_yearly}
          onChange={(e) => setLendForm({ ...lendForm, interest_rate_yearly: e.target.value })}
          placeholder="Enter interest rate"
          required
          min="0"
        />
      </div>
      <button
        onClick={handleLend}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? "Creating Loan..." : "Create Loan"}
      </button>
    </div>
  </div>
);

// MakePaymentTab.js
export const MakePaymentTab = ({ paymentForm, setPaymentForm, handlePayment, loading }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <DollarSign className="text-green-600" />
      Make Payment
    </h2>
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Loan ID"
          value={paymentForm.loan_id}
          onChange={(e) => setPaymentForm({ ...paymentForm, loan_id: e.target.value })}
          placeholder="Enter loan ID"
          required
        />
        <InputField
          label="Payment Amount (₹)"
          type="number"
          step="0.01"
          value={paymentForm.amount}
          onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
          placeholder="Enter payment amount"
          required
          min="0.01"
        />
        <SelectField
          label="Payment Type"
          value={paymentForm.payment_type}
          onChange={(e) => setPaymentForm({ ...paymentForm, payment_type: e.target.value })}
          options={[
            { value: "EMI", label: "EMI" },
            { value: "LUMP_SUM", label: "Lump Sum" }
          ]}
          className="md:col-span-2"
        />
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
      >
        {loading ? "Processing Payment..." : "Make Payment"}
      </button>
    </div>
  </div>
);

// LedgerTab.js
export const LedgerTab = ({ ledgerLoanId, setLedgerLoanId, fetchLedger, loading, ledgerData }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <FileText className="text-purple-600" />
      Loan Ledger
    </h2>
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        value={ledgerLoanId}
        onChange={(e) => setLedgerLoanId(e.target.value)}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter loan ID"
      />
      <button
        onClick={fetchLedger}
        disabled={loading || !ledgerLoanId}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
      >
        {loading ? "Loading..." : "Get Ledger"}
      </button>
    </div>

    {ledgerData && (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Principal" value={ledgerData.principal} bgColor="bg-blue-50" textColor="text-blue-600" />
          <StatsCard title="Amount Paid" value={ledgerData.amount_paid} bgColor="bg-green-50" textColor="text-green-600" />
          <StatsCard title="Balance" value={ledgerData.balance_amount} bgColor="bg-orange-50" textColor="text-orange-600" />
          <StatsCard title="EMIs Left" value={ledgerData.emis_left} bgColor="bg-purple-50" textColor="text-purple-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <TransactionTable transactions={ledgerData.transactions} />
        </div>
      </div>
    )}
  </div>
);

// CustomerSummary.js
export const CustomerSummary = ({ overviewData }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">Customer Summary</h3>
    <p className="text-gray-600">Customer ID: {overviewData.customer_id}</p>
    <p className="text-2xl font-bold text-indigo-600 mt-2">
      Total Loans: {overviewData.total_loans}
    </p>
  </div>
);

// OverviewTab.js
export const OverviewTab = ({ selectedCustomer, setSelectedCustomer, fetchOverview, loading, customers, overviewData }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <User className="text-indigo-600" />
      Account Overview
    </h2>
    <div className="flex gap-4 mb-6">
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Customer</option>
        {customers.map((customer) => (
          <option key={customer.customer_id} value={customer.customer_id}>
            {customer.name} ({customer.customer_id})
          </option>
        ))}
      </select>
      <button
        onClick={fetchOverview}
        disabled={loading || !selectedCustomer}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
      >
        {loading ? "Loading..." : "Get Overview"}
      </button>
    </div>

    {overviewData && (
      <div className="space-y-6">
        <CustomerSummary overviewData={overviewData} />
        <div>
          <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
          <div className="grid gap-4">
            {overviewData.loans.map((loan, index) => (
              <LoanCard key={loan.loan_id} loan={loan} index={index} />
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

// ==================== CUSTOM HOOKS ====================

// useApiService.js
export const useApiService = () => {
  const API_BASE_URL = "http://localhost:3001/api/v1";

  const fetchCustomers = async () => {
    const response = await fetch(`${API_BASE_URL}/customers`);
    return await response.json();
  };

  const createLoan = async (loanData) => {
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    });
    return { response, data: await response.json() };
  };

  const makePayment = async (loanId, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    return { response, data: await response.json() };
  };

  const fetchLedger = async (loanId) => {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/ledger`);
    return { response, data: await response.json() };
  };

  const fetchOverview = async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/overview`);
    return { response, data: await response.json() };
  };

  return {
    fetchCustomers,
    createLoan,
    makePayment,
    fetchLedger,
    fetchOverview
  };
};

// ==================== MAIN COMPONENT ====================

// BankLendingSystem.js (Main Container Component)
const BankLendingSystem = () => {
  const [activeTab, setActiveTab] = useState("lend");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [lendForm, setLendForm] = useState({
    customer_id: "",
    loan_amount: "",
    loan_period_years: "",
    interest_rate_yearly: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    loan_id: "",
    amount: "",
    payment_type: "EMI",
  });

  const [ledgerLoanId, setLedgerLoanId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [ledgerData, setLedgerData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  const apiService = useApiService();

  // Load customers on mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await apiService.fetchCustomers();
        setCustomers(data);
      } catch (error) {
        setMessage("Error fetching customers");
      }
    };
    loadCustomers();
  }, []);

  const handleLend = async () => {
    setLoading(true);
    try {
      const { response, data } = await apiService.createLoan(lendForm);
      
      if (response.ok) {
        setMessage(`Loan created successfully! Loan ID: ${data.loan_id}`);
        setLendForm({
          customer_id: "",
          loan_amount: "",
          loan_period_years: "",
          interest_rate_yearly: "",
        });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error creating loan");
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { response, data } = await apiService.makePayment(
        paymentForm.loan_id,
        {
          amount: parseFloat(paymentForm.amount),
          payment_type: paymentForm.payment_type,
        }
      );

      if (response.ok) {
        setMessage(
          `Payment recorded! Remaining balance: ₹${data.remaining_balance}, EMIs left: ${data.emis_left}`
        );
        setPaymentForm({
          loan_id: "",
          amount: "",
          payment_type: "EMI",
        });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error recording payment");
    }
    setLoading(false);
  };

  const fetchLedger = async () => {
    if (!ledgerLoanId) return;
    setLoading(true);
    try {
      const { response, data } = await apiService.fetchLedger(ledgerLoanId);

      if (response.ok) {
        setLedgerData(data);
        setMessage("");
      } else {
        setMessage(`Error: ${data.error}`);
        setLedgerData(null);
      }
    } catch (error) {
      setMessage("Error fetching ledger");
      setLedgerData(null);
    }
    setLoading(false);
  };

  const fetchOverview = async () => {
    if (!selectedCustomer) return;
    setLoading(true);
    try {
      const { response, data } = await apiService.fetchOverview(selectedCustomer);

      if (response.ok) {
        setOverviewData(data);
        setMessage("");
      } else {
        setMessage(`Error: ${data.error}`);
        setOverviewData(null);
      }
    } catch (error) {
      setMessage("Error fetching overview");
      setOverviewData(null);
    }
    setLoading(false);
  };

  const tabConfig = [
    { id: "lend", icon: PlusCircle, label: "Create Loan" },
    { id: "payment", icon: DollarSign, label: "Make Payment" },
    { id: "ledger", icon: FileText, label: "View Ledger" },
    { id: "overview", icon: User, label: "Account Overview" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bank Lending System
          </h1>
          <p className="text-gray-600">
            Manage loans, payments, and customer accounts
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {tabConfig.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Message Display */}
        <MessageDisplay message={message} />

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === "lend" && (
            <CreateLoanTab
              lendForm={lendForm}
              setLendForm={setLendForm}
              handleLend={handleLend}
              loading={loading}
              customers={customers}
            />
          )}

          {activeTab === "payment" && (
            <MakePaymentTab
              paymentForm={paymentForm}
              setPaymentForm={setPaymentForm}
              handlePayment={handlePayment}
              loading={loading}
            />
          )}

          {activeTab === "ledger" && (
            <LedgerTab
              ledgerLoanId={ledgerLoanId}
              setLedgerLoanId={setLedgerLoanId}
              fetchLedger={fetchLedger}
              loading={loading}
              ledgerData={ledgerData}
            />
          )}

          {activeTab === "overview" && (
            <OverviewTab
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              fetchOverview={fetchOverview}
              loading={loading}
              customers={customers}
              overviewData={overviewData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankLendingSystem;