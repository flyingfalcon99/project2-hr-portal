# Form Validation - Quick Reference Card

## 📋 Validation Rules at a Glance

### Email
```javascript
Pattern: RFC 5322 Simplified
✓ user@example.com
✓ john.doe+tag@company.co.uk
✗ user@domain (missing TLD)
```

### Password
```javascript
Requirements: 8+ chars, Uppercase, Digit, Special (@$!%*?&)
✓ MyPassword@123
✓ Secure!Pass99
✗ password123 (no uppercase/special)
```

### Phone
```javascript
Format: 10-16 digits with optional formatting
✓ +1-987-654-3210
✓ (987) 654-3210
✓ 9876543210
```

### Dates
```javascript
Start Date: >= Today
End Date: >= Start Date
Joining Date: <= Today
Format: YYYY-MM-DD (ISO 8601)
```

### Text Fields
```javascript
Names: 2-50 chars, [a-zA-Z '-]
Position: 3-50 chars
Reason: 10-500 chars, multiline
```

---

## 🚀 Quick Import

```jsx
import { useForm } from 'react-hook-form';
import FormField from '@/components/FormField';
import SuccessMessage from '@/components/SuccessMessage';
import { validationRules, leaveRequestSchema } from '@/utils/validationSchemas';
```

---

## ⚡ Basic Usage

### Step 1: Setup Form
```jsx
const { control, handleSubmit } = useForm({
  mode: 'onBlur',
  defaultValues: { email: '', password: '' }
});
```

### Step 2: Add Fields
```jsx
<FormField
  control={control}
  name="email"
  type="email"
  label="Email"
  rules={validationRules.email}
  required
/>
```

### Step 3: Handle Submit
```jsx
const onSubmit = async (data) => {
  try {
    await submitForm(data);
    setSuccess(true);
  } catch (error) {
    setError(error.message);
  }
};

<form onSubmit={handleSubmit(onSubmit)}>
  {/* Fields */}
  <button type="submit">Submit</button>
</form>
```

---

## 🎨 FormField Props

| Prop | Type | Example |
|------|------|---------|
| `control` | Object | From `useForm()` |
| `name` | String | "email" |
| `type` | String | "text", "email", "date", "select", "textarea" |
| `label` | String | "Email Address" |
| `placeholder` | String | "you@example.com" |
| `rules` | Object | `validationRules.email` |
| `required` | Boolean | `true` |
| `successMessage` | String | "Email format is valid" |
| `hint` | String | "We'll never share your email" |
| `options` | Array | `[{value: "a", label: "Option A"}]` |
| `rows` | Number | `4` (for textarea) |
| `icon` | JSX | `<EmailIcon />` |

---

## 📝 Pre-Built Schemas

### Login
```jsx
import { loginSchema } from '@/utils/validationSchemas';

{email, password, role}
```

### Register Step 1
```jsx
import { registerStep1Schema } from '@/utils/validationSchemas';

{firstName, lastName, email, phone}
```

### Register Step 2
```jsx
import { registerStep2Schema } from '@/utils/validationSchemas';

{department, position, dateOfJoining}
```

### Register Step 3
```jsx
import { registerStep3Schema } from '@/utils/validationSchemas';

{password, confirmPassword}
```

### Leave Request
```jsx
import { leaveRequestSchema } from '@/utils/validationSchemas';

{leaveType, startDate, endDate, reason}
```

---

## ✅ Common Patterns

### Multi-Step Form
```jsx
const handleNext = async () => {
  const isValid = await trigger(['field1', 'field2']);
  if (isValid) setStep(step + 1);
};
```

### Custom Validation
```jsx
const customRules = {
  email: {
    ...validationRules.email,
    validate: async (val) => {
      const exists = await checkExists(val);
      return !exists || 'Already registered';
    }
  }
};
```

### Conditional Fields
```jsx
const shouldShowField = watch('fieldName') === 'specific value';

{shouldShowField && <FormField ... />}
```

### Success Message
```jsx
{success && (
  <SuccessMessage 
    title="Success!"
    message="Form submitted"
    autoClose={true}
    duration={3000}
  />
)}
```

---

## 🔴 Error Handling

### Display Server Errors
```jsx
{serverError && (
  <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
    <p className="text-danger-900 font-semibold">Error</p>
    <p className="text-danger-700">{serverError}</p>
  </div>
)}
```

### Field Errors (Automatic)
FormField automatically shows:
- Red border
- Error icon
- Error message

---

## 🎯 Validation Modes

```javascript
'onSubmit'    // Validate only on form submit
'onBlur'      // Validate when field loses focus
'onChange'    // Validate on every character
'onTouched'   // Validate after first interaction
'all'         // Validate on all events
```

**Recommended:**
- Login/Register: `'onBlur'`
- Real-time search: `'onChange'`
- Complex forms: `'onBlur'`

---

## 📊 Validation Rules Reference

```javascript
validationRules = {
  name,
  email,
  password,
  confirmPassword,
  phone,
  phoneOptional,
  date,
  dateOptional,
  dateOfJoining,
  startDate,
  endDate,
  reason,
  reasonOptional,
  position,
  department,
  leaveType,
  positiveNumber,
  positiveNumberNonZero,
  zipCode,
  required
}
```

---

## 🧪 Test Cases Checklist

- [ ] Valid input shows success
- [ ] Invalid input shows error
- [ ] Required field validation
- [ ] Min/max length validation
- [ ] Pattern validation (email, phone)
- [ ] Date range validation
- [ ] Async validation (email exists)
- [ ] Form submission prevented on error
- [ ] Success message appears
- [ ] Form resets after success
- [ ] Keyboard navigation works
- [ ] Screen reader works

---

## 🔗 File Locations

| File | Location | Purpose |
|------|----------|---------|
| FormField | `src/components/FormField.jsx` | Input wrapper |
| SuccessMessage | `src/components/SuccessMessage.jsx` | Notifications |
| Schemas | `src/utils/validationSchemas.js` | Validation rules |
| Login | `src/components/Login.jsx` | Uses validation |
| Register | `src/components/Register.jsx` | Uses validation |
| LeaveRequestForm | `src/components/LeaveRequestForm.jsx` | Uses validation |
| Guide | `VALIDATION_GUIDE.md` | Full documentation |

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:** Use `register` with FormField
```jsx
// WRONG
<FormField {...register('email')} />
```

✅ **Do:** Use `control` prop
```jsx
// CORRECT
<FormField control={control} name="email" />
```

---

❌ **Don't:** Forget to pass rules
```jsx
// WRONG - No validation!
<FormField control={control} name="email" />
```

✅ **Do:** Pass validation rules
```jsx
// CORRECT
<FormField 
  control={control} 
  name="email" 
  rules={validationRules.email}
/>
```

---

❌ **Don't:** Use inline objects for type
```jsx
// WRONG - Creates new object every render
<FormField type="text" />
```

✅ **Do:** Use string type
```jsx
// CORRECT - String literal
<FormField type="text" />
```

---

## 📚 Learn More

- Full Guide: [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md)
- Theme System: [THEME.md](THEME.md)
- Code Snippets: [SNIPPETS.md](SNIPPETS.md)
- React Hook Form: https://react-hook-form.com/
- Tailwind CSS: https://tailwindcss.com/

---

**Last Updated:** February 2, 2026  
**Status:** ✅ Production Ready  
**Quick Help:** Check VALIDATION_GUIDE.md for complete documentation

