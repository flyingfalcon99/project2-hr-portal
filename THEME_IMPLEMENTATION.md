# Theme Implementation Guide

This guide shows how to use the comprehensive theme system throughout the HR Portal application.

## 📝 Quick Reference

### Color System
```javascript
// Import in components as needed
import { getStatusColor, getStatusTextColor } from '@/utils/helpers';

// Usage in components
<div className={`p-4 rounded-lg ${getStatusColor('approved')}`}>
  Status indicator
</div>
```

### Component Classes

```jsx
// Typography
<h1 className="h1">Page Title</h1>
<h2 className="h2">Section Heading</h2>
<p className="body">Regular paragraph text</p>
<span className="caption">Metadata</span>

// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-danger">Delete</button>
<button className="btn-outline">Cancel</button>

// Forms
<input className="input-field" type="text" />
<input className="input-field input-error" type="email" />

// Cards
<div className="card">Content</div>
<div className="card-hover">Clickable card</div>

// Badges
<span className="badge-success">Approved</span>
<span className="badge-warning">Pending</span>

// Alerts
<div className="alert-success">Success message</div>
<div className="alert-error">Error message</div>
```

---

## 🎨 Theme Application Examples

### Employee Management Page

```jsx
import { getStatusColor, formatDate, exportToCSV } from '@/utils/helpers';

export const EmployeeManagement = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="h1 mb-2">Employee Management</h1>
        <p className="body text-secondary-600">Manage and view all employees</p>
      </div>

      {/* Filters Card */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input 
            className="input-field" 
            placeholder="Search employees..."
          />
          <select className="input-field">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="px-6 py-4 text-left caption">NAME</th>
              <th className="px-6 py-4 text-left caption">EMAIL</th>
              <th className="px-6 py-4 text-left caption">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr 
                key={emp.id} 
                className="border-b border-secondary-200 hover:bg-primary-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 body font-medium">{emp.name}</td>
                <td className="px-6 py-4 body text-secondary-600">{emp.email}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${getStatusColor(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### Leave Request Form

```jsx
import { validateEmail, validatePhone, calculateLeaveBalance } from '@/utils/helpers';
import Input from '@/components/Input';
import Button from '@/components/Button';

export const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const balance = calculateLeaveBalance(20, 8);

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="h3 mb-6">Request Leave</h2>

      {/* Leave Balance */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="caption text-success-600">AVAILABLE BALANCE</p>
            <p className="text-2xl font-bold text-success-800">{balance.remaining} days</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-success-600">Used</p>
              <p className="text-xl font-bold text-success-800">{balance.percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <Input
          label="Start Date"
          type="date"
          required
          error={errors.startDate}
          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
        />
        <Input
          label="End Date"
          type="date"
          required
          error={errors.endDate}
          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
        />
        <Input
          label="Reason"
          type="textarea"
          placeholder="Explain your leave request"
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
        />
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Submit Request</Button>
      </div>
    </div>
  );
};
```

### Dashboard with Stats Cards

```jsx
import { formatNumber, formatCurrency } from '@/utils/helpers';

export const Dashboard = () => {
  const stats = [
    { label: 'Total Employees', value: 245, change: '+12%', color: 'primary' },
    { label: 'Leave Requests', value: 18, change: '-5%', color: 'warning' },
    { label: 'Pending Approvals', value: 7, change: '+3%', color: 'danger' },
    { label: 'HR Score', value: '8.5', change: '+0.5', color: 'success' },
  ];

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8">
      <h1 className="h1 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card-hover">
            <p className="caption text-secondary-600">{stat.label}</p>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-4xl font-bold text-secondary-900">
                  {stat.value}
                </p>
                <p className={`text-sm font-semibold mt-2 text-${stat.color}-600`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 opacity-30`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="h4 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 pb-4 border-b border-secondary-200 last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold">{activity.initials}</span>
              </div>
              <div className="flex-1">
                <p className="body font-medium">{activity.user}</p>
                <p className="body-sm text-secondary-600">{activity.action}</p>
              </div>
              <p className="caption text-secondary-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Modal with Validation

```jsx
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { validateEmail } from '@/utils/helpers';

export const EmployeeDetailModal = ({ isOpen, onClose, employee }) => {
  const [formData, setFormData] = useState(employee || {});
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (Object.keys(newErrors).length === 0) {
      // Save data
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Details"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Full Name"
          value={formData.name || ''}
          error={errors.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          error={errors.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <Input
          label="Department"
          value={formData.department || ''}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
        />
      </div>
    </Modal>
  );
};
```

### Notification System

```jsx
import Alert from '@/components/Alert';
import { useState } from 'react';

export const NotificationDemo = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Employee added successfully!' },
    { id: 2, type: 'warning', message: 'Leave request pending approval' },
    { id: 3, type: 'error', message: 'Failed to update employee' },
  ]);

  const handleClose = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <Alert
          key={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={() => handleClose(notif.id)}
          autoClose={5000}
        />
      ))}
    </div>
  );
};
```

---

## 📱 Responsive Design Pattern

```jsx
// Mobile-first approach
<div className="px-4 md:px-6 lg:px-8">
  {/* 16px padding on mobile, 24px on tablet, 32px on desktop */}
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
  </div>

  <div className="hidden md:block">
    {/* Hidden on mobile, visible on tablet+ */}
  </div>

  <div className="md:hidden">
    {/* Visible only on mobile */}
  </div>
</div>
```

---

## 🔄 Utility Functions Integration

```jsx
import {
  formatDate,
  calculateDuration,
  getStatusColor,
  validateEmail,
  calculateLeaveBalance,
  hasPermission,
  exportToCSV,
  formatCurrency,
} from '@/utils/helpers';

// Dates
const formatted = formatDate(new Date(), 'long'); // "February 2, 2026"
const duration = calculateDuration('2026-02-01', '2026-02-05'); // 5 days

// Status colors
<div className={getStatusColor('approved')}> // bg-success-100 text-success-800
  Status
</div>

// Validation
const isValid = validateEmail('user@example.com'); // true

// Leave calculations
const balance = calculateLeaveBalance(20, 8); // { remaining: 12, percentage: 40, ... }

// Permissions
if (hasPermission(userRole, 'hr')) {
  // Show HR-only content
}

// Export
exportToCSV(employees, 'employees.csv');

// Currency
const formatted = formatCurrency(1500); // "$1,500.00"
```

---

## 🎯 Best Practices Applied

✅ **Consistency**: All components use the same color palette and spacing scale
✅ **Accessibility**: Proper contrast ratios and semantic HTML
✅ **Responsiveness**: Mobile-first with clear breakpoints
✅ **Performance**: Optimized Tailwind builds with PurgeCSS
✅ **Maintainability**: Centralized theme configuration
✅ **Extensibility**: Easy to customize via tailwind.config.js
✅ **Scalability**: Works for 10s-100s of components
✅ **Type Safety**: JSDoc documentation on all utilities

---

## 📚 Related Documentation

- [THEME.md](./THEME.md) - Comprehensive theme reference
- [tailwind.config.js](./tailwind.config.js) - Theme configuration
- [src/utils/helpers.js](./src/utils/helpers.js) - Utility functions
- [src/components/](./src/components/) - Reusable components

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
