import { useState } from "react";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";

export default function CustomerServicePage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submittedMessages, setSubmittedMessages] = useState([]);
  const [filter, setFilter] = useState("All");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      ...formData,
      date: new Date().toLocaleString(),
      status: "Pending",
    };
    setSubmittedMessages([newMessage, ...submittedMessages]);
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password'." },
    { question: "How can I view student attendance reports?", answer: "Go to Reports page and select the section/date range." },
    { question: "Who do I contact for system issues?", answer: "Send a message using this Customer Service form." },
  ];

  const statusOptions = ["Pending", "In Progress", "Resolved"];

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedMessages = [...submittedMessages];
    updatedMessages[index].status = newStatus;
    setSubmittedMessages(updatedMessages);
  };

  const filteredMessages =
  filter === "All"
    ? submittedMessages
    : submittedMessages.filter((msg) => msg.status === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ChatBubbleBottomCenterIcon className="w-10 h-10 text-red-800" />
          Customer Service
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Send us a message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700"
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-red-800 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">FAQ</h2>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <details key={idx} className="border-b border-gray-200 pb-2 group">
                  <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
                    {faq.question}
                    <span className="transition-transform duration-300 group-open:rotate-180">&#9660;</span>
                  </summary>
                  <p className="mt-1 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h2>

            <div className="flex gap-3 mb-4">
                {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                    filter === status
                        ? "bg-red-800 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                    {status}
                </button>
                ))}
            </div>

            {filteredMessages.length === 0 ? (
                <p className="text-gray-500">No messages found for this status.</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-red-800 text-white">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Message</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMessages.map((msg, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-2">{msg.name}</td>
                        <td className="px-4 py-2">{msg.email}</td>
                        <td className="px-4 py-2">{msg.message}</td>
                        <td className="px-4 py-2">{msg.date}</td>
                        <td className="px-4 py-2">
                            <select
                            className={`px-2 py-1 rounded-md text-sm font-semibold ${statusStyles[msg.status]}`}
                            value={msg.status}
                            onChange={(e) => handleStatusChange(idx, e.target.value)}
                            >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                {status}
                                </option>
                            ))}
                            </select>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
