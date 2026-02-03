# Theme Quick Reference & Snippets

Fast lookup guide with copy-paste ready code snippets for common use cases.

---

## 🎨 Color Quick Reference

### Quick Hex Codes
```
Primary:   #4a7aad (600)
Secondary: #495057 (700)
Success:   #16a34a (600)
Warning:   #d97706 (600)
Danger:    #dc2626 (600)
Info:      #1e5ba8 (600)
```

### Color Shades by Number
```
50   = Very Light
100  = Light
200  = Light-Medium
300  = Medium-Light
400  = Medium
500  = Medium-Dark
600  = Dark (Primary use)
700  = Darker (Hover/Active)
800  = Very Dark
900  = Darkest (Text)
```

---

## 🔘 Button Snippets

### Primary Button
```jsx
<button className="btn-primary">Save Changes</button>
```

### Danger Button with Icon
```jsx
<button className="btn-danger">
  <svg className="w-4 h-4"><!-- trash icon --></svg>
  Delete
</button>
```

### Outline Button
```jsx
<button className="btn-outline">Cancel</button>
```

### Button Group
```jsx
<div className="flex gap-3">
  <button className="btn-outline">Cancel</button>
  <button className="btn-primary">Save</button>
</div>
```

### Small Buttons
```jsx
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Medium</button>
<button className="btn-primary btn-lg">Large</button>
```

### Loading Button
```jsx
<button className="btn-primary disabled" disabled>
  <svg className="animate-spin w-4 h-4 mr-2"><!-- spinner --></svg>
  Saving...
</button>
```

---

## 📝 Input Snippets

### Standard Input
```jsx
<input type="text" className="input-field" placeholder="Enter text" />
```

### Input with Label
```jsx
<div>
  <label className="block text-sm font-medium text-secondary-700 mb-2">
    Email Address
  </label>
  <input type="email" className="input-field" />
</div>
```

### Input with Error
```jsx
<div>
  <label className="block text-sm font-medium text-secondary-700 mb-2">
    Email
  </label>
  <input type="email" className="input-field input-error" />
  <p className="helper-text text-danger-600 mt-1">Invalid email address</p>
</div>
```

### Input with Helper Text
```jsx
<div>
  <label className="block text-sm font-medium text-secondary-700 mb-2">
    Password
  </label>
  <input type="password" className="input-field" />
  <p className="helper-text mt-1">Min 8 characters with uppercase, lowercase, and numbers</p>
</div>
```

### Textarea
```jsx
<textarea 
  className="input-field" 
  placeholder="Enter description"
  rows="4"
></textarea>
```

### Form Group with Error
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-secondary-700">
    Department <span className="text-danger-600">*</span>
  </label>
  <input type="text" className="input-field input-error" />
  <p className="text-sm text-danger-600">Department is required</p>
</div>
```

---

## 🎴 Card Snippets

### Basic Card
```jsx
<div className="card">
  <h3 className="h4 mb-4">Card Title</h3>
  <p className="body">Card content goes here</p>
</div>
```

### Card with Header & Footer
```jsx
<div className="card">
  <div className="border-b border-secondary-200 pb-4 mb-4">
    <h3 className="h4">Header Title</h3>
  </div>
  <p className="body">Card content</p>
  <div className="border-t border-secondary-200 pt-4 mt-4">
    <button className="btn-primary btn-sm">Action</button>
  </div>
</div>
```

### Hoverable Card
```jsx
<div className="card-hover">
  <h3 className="h4">Clickable Card</h3>
  <p className="body text-secondary-600">Click me for details</p>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

---

## 🏷️ Badge Snippets

### Status Badges
```jsx
<span className="badge-success">Approved</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Rejected</span>
```

### Badge with Icon
```jsx
<span className="badge-success">
  <svg className="w-3 h-3"><!-- check --></svg>
  Complete
</span>
```

### Multiple Badges
```jsx
<div className="flex flex-wrap gap-2">
  <span className="badge-primary">Tag 1</span>
  <span className="badge-success">Tag 2</span>
  <span className="badge-warning">Tag 3</span>
</div>
```

---

## 📢 Alert Snippets

### Alert Success
```jsx
<div className="alert-success">
  ✓ Operation completed successfully!
</div>
```

### Alert Error
```jsx
<div className="alert-error">
  ✗ An error occurred. Please try again.
</div>
```

### Alert with Title
```jsx
<div className="alert-warning">
  <p className="font-semibold mb-2">Warning Title</p>
  <p>Additional details about the warning</p>
</div>
```

### Dismissible Alert
```jsx
<div className="alert-info flex items-center justify-between">
  <span>Information message</span>
  <button className="text-info-600 hover:text-info-700">✕</button>
</div>
```

---

## 📊 Status Indicators

### Status with Color
```jsx
import { getStatusColor } from '@/utils/helpers';

<span className={`badge ${getStatusColor('approved')}`}>
  {status}
</span>
```

### Status Text
```jsx
import { formatStatus } from '@/utils/helpers';

<p className={`text-${getStatusColor('pending')}`}>
  {formatStatus('in-progress')}
</p>
```

---

## 📅 Date Display

### Date Formatting
```jsx
import { formatDate } from '@/utils/helpers';

<p className="body text-secondary-600">
  {formatDate(date, 'long')}
</p>
```

### Leave Duration
```jsx
import { calculateDuration, formatDate } from '@/utils/helpers';

<p className="caption">
  {formatDate(startDate)} - {formatDate(endDate)}
  ({calculateDuration(startDate, endDate)} days)
</p>
```

---

## 💰 Currency & Numbers

### Formatted Currency
```jsx
import { formatCurrency, formatNumber } from '@/utils/helpers';

<p className="text-2xl font-bold">
  {formatCurrency(salary)}
</p>
```

### Formatted Numbers
```jsx
<p className="body">
  Total Employees: {formatNumber(totalEmployees)}
</p>
```

---

## 🔐 Form Validation

### Email Validation
```jsx
import { validateEmail } from '@/utils/helpers';

if (!validateEmail(email)) {
  setError('Invalid email format');
}
```

### Phone Validation
```jsx
import { validatePhone } from '@/utils/helpers';

if (!validatePhone(phone)) {
  setError('Invalid phone number');
}
```

### Password Validation
```jsx
import { validatePassword } from '@/utils/helpers';

const validation = validatePassword(password);
if (!validation.isValid) {
  setErrors(validation.feedback);
}
```

---

## 📱 Responsive Layout

### Responsive Padding
```jsx
<div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
  Content with responsive padding
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Hide/Show on Breakpoint
```jsx
<div className="md:hidden">
  Mobile Menu
</div>

<div className="hidden md:block">
  Desktop Navigation
</div>
```

---

## 🎯 Common Patterns

### Form with Validation
```jsx
<form className="max-w-md mx-auto">
  <div className="card">
    <h2 className="h3 mb-6">Form Title</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Field <span className="text-danger-600">*</span>
        </label>
        <input type="text" className="input-field input-error" />
        <p className="text-sm text-danger-600 mt-1">Error message</p>
      </div>
    </div>

    <div className="flex gap-3 mt-8">
      <button className="btn-outline flex-1">Cancel</button>
      <button className="btn-primary flex-1">Submit</button>
    </div>
  </div>
</form>
```

### Data Table
```jsx
<div className="card overflow-hidden">
  <table className="w-full">
    <thead className="bg-secondary-50 border-b border-secondary-200">
      <tr>
        <th className="px-6 py-3 text-left caption">Column 1</th>
        <th className="px-6 py-3 text-left caption">Column 2</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id} className="border-b border-secondary-200 hover:bg-primary-50">
          <td className="px-6 py-4 body">{row.col1}</td>
          <td className="px-6 py-4 body">{row.col2}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Empty State
```jsx
<div className="card flex flex-col items-center justify-center py-12">
  <svg className="w-16 h-16 text-secondary-300 mb-4"><!-- icon --></svg>
  <h3 className="h4 text-secondary-600 mb-2">No Data</h3>
  <p className="body text-secondary-500 mb-6">No records found</p>
  <button className="btn-primary">Create New</button>
</div>
```

### Page Header
```jsx
<div className="mb-8">
  <h1 className="h1 mb-2">Page Title</h1>
  <p className="body text-secondary-600">Page description and context</p>
</div>
```

### Stats Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map((stat) => (
    <div key={stat.id} className="card">
      <p className="caption text-secondary-600">{stat.label}</p>
      <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
      <p className="text-sm text-success-600 mt-2">{stat.change}</p>
    </div>
  ))}
</div>
```

---

## 🌐 CSS Classes Cheat Sheet

### Frequently Used Classes
```
Spacing:
p-4 = padding 1rem
px-4 = padding-left/right 1rem
py-4 = padding-top/bottom 1rem
m-4 = margin 1rem
gap-4 = gap 1rem
mb-4 = margin-bottom 1rem

Typography:
text-secondary-700 = text color
font-bold = bold text
text-center = center text
line-clamp-2 = 2-line truncation

Flexbox:
flex = display flex
items-center = align items center
justify-between = justify content space-between
gap-4 = gap between items

Grid:
grid = display grid
grid-cols-3 = 3 columns
gap-6 = gap between items

Display:
hidden = display none
block = display block
flex = display flex
md:hidden = hidden on tablet+
hidden md:block = visible on tablet+

Backgrounds:
bg-primary-600 = background color
bg-opacity-50 = background opacity

Borders:
border = 1px solid border
border-secondary-200 = border color
rounded-lg = border radius
shadow-lg = box shadow

Hover/Active:
hover:bg-primary-700 = hover background
active:bg-primary-800 = active background
transition-colors = smooth transition
duration-200 = 200ms duration
```

---

## 🔍 Troubleshooting

### Issue: Classes not applying
**Solution:** Ensure file is in content globs: `./src/**/*.{js,jsx}`

### Issue: Color not working
**Solution:** Use correct format: `bg-primary-600` not `bg-primary`

### Issue: Responsive not working
**Solution:** Use breakpoint prefix: `md:w-1/2` not `w-1/2@md`

### Issue: Transition not smooth
**Solution:** Add duration: `transition-colors duration-200`

---

## 📋 Copy-Paste Complete Forms

### Login Form
```jsx
<div className="card max-w-md mx-auto">
  <h2 className="h3 mb-6">Sign In</h2>
  
  <div className="space-y-4">
    <input type="email" className="input-field" placeholder="Email" />
    <input type="password" className="input-field" placeholder="Password" />
  </div>

  <div className="flex gap-3 mt-6">
    <button className="btn-outline flex-1">Cancel</button>
    <button className="btn-primary flex-1">Sign In</button>
  </div>
</div>
```

### Profile Card
```jsx
<div className="card max-w-sm mx-auto">
  <div className="flex items-center gap-4 pb-4 border-b border-secondary-200">
    <img src="avatar.jpg" className="w-16 h-16 rounded-full" />
    <div>
      <p className="h5">John Doe</p>
      <p className="body text-secondary-600">Senior Developer</p>
    </div>
  </div>

  <div className="mt-4 space-y-3">
    <p><span className="caption">EMAIL:</span> john@example.com</p>
    <p><span className="caption">PHONE:</span> +1 234 567 8900</p>
  </div>
</div>
```

### Settings Panel
```jsx
<div className="card">
  <h3 className="h4 mb-6">Settings</h3>

  <div className="space-y-6 divide-y divide-secondary-200">
    <div>
      <label className="flex items-center justify-between">
        <span className="body font-medium">Dark Mode</span>
        <input type="checkbox" className="w-4 h-4" />
      </label>
    </div>
    
    <div className="pt-4">
      <label className="block text-sm font-medium mb-2">Theme</label>
      <select className="input-field">
        <option>Light</option>
        <option>Dark</option>
        <option>Auto</option>
      </select>
    </div>
  </div>
</div>
```

---

## 🚀 Pro Tips

1. **Use CSS Variables for Dynamic Theming**
   ```css
   :root {
     --color-primary: #4a7aad;
   }
   ```

2. **Combine Classes for Reusability**
   ```jsx
   const buttonClasses = 'btn-primary btn-lg';
   <button className={buttonClasses}>Save</button>
   ```

3. **Use Tailwind Merge for Conditional Classes**
   ```jsx
   import { clsx } from 'clsx';
   <div className={clsx('card', isActive && 'ring-2 ring-primary-500')}>
   ```

4. **Extract Repeated Patterns to Components**
   ```jsx
   const FormGroup = ({ label, error, children }) => (
     <div>
       <label className="block text-sm font-medium mb-2">{label}</label>
       {children}
       {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
     </div>
   );
   ```

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
