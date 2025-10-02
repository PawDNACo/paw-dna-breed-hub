# Contact Form Security Documentation

## Overview

The PawDNA contact form implements multiple layers of security to protect against various types of attacks including SQL injection, XSS, CSRF, and spam/abuse.

## Security Layers

### 1. Client-Side Validation (First Line of Defense)

**Technology:** Zod Schema Validation

**Location:** `src/pages/Contact.tsx`

**Protection:**
- **Input Length Limits:**
  - Name: 1-100 characters
  - Email: 1-255 characters
  - Subject: 1-200 characters
  - Message: 10-2000 characters

- **Character Restrictions:**
  - Name: Only letters, spaces, hyphens, and apostrophes
  - Email: Valid email format with @ and domain
  - Subject: Any text (length limited)
  - Message: Any text (length limited)

- **Whitespace Handling:**
  - All inputs are trimmed automatically
  - Empty strings after trimming are rejected

**Code Example:**
```typescript
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100)
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Invalid characters" }),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(2000),
});
```

### 2. Rate Limiting (Abuse Prevention)

**Limit:** 5 submissions per 15 minutes per IP address

**Location:** `supabase/functions/submit-contact/index.ts`

**Protection:**
- Prevents spam attacks
- Prevents automated bot submissions
- Prevents DoS attempts via form flooding

**Response:**
- HTTP 429 (Too Many Requests)
- Includes `Retry-After` header
- Includes `X-RateLimit-*` headers for debugging

### 3. Server-Side Validation (Defense in Depth)

**Location:** `supabase/functions/submit-contact/index.ts`

**Validation Rules:**
- Re-validates all client-side rules
- Additional checks for SQL injection patterns:
  - Keywords: SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, EXEC
  - SQL comments: --, /*, */
  - SQL terminators: ;

- XSS pattern detection:
  - `<script` tags
  - `javascript:` protocol
  - `onerror=` attributes
  - `onload=` attributes

**Code Example:**
```typescript
// SQL Injection check
const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b|--|;|\/\*|\*\/)/gi;

// XSS check
const xssPattern = /<script|javascript:|onerror=|onload=/gi;
```

### 4. Database Security (Row Level Security)

**Table:** `contact_submissions`

**RLS Policies:**
- ❌ Anonymous users: **BLOCKED** (all operations)
- ❌ Authenticated users: **CANNOT** insert directly
- ✅ Admins only: **CAN** view and update submissions
- ✅ Edge function: **CAN** insert using service role

**Database Constraints:**
```sql
-- Length constraints at database level
contact_name_length CHECK (char_length(name) <= 100)
contact_email_length CHECK (char_length(email) <= 255)
contact_subject_length CHECK (char_length(subject) <= 200)
contact_message_length CHECK (char_length(message) <= 2000)
```

### 5. Audit Logging

**Stored Information:**
- Submission ID (UUID)
- User input (name, email, subject, message)
- Client IP address
- User agent string
- Submission timestamp
- Status (pending, reviewed, resolved)

**Purpose:**
- Track abuse patterns
- Investigate suspicious submissions
- Monitor system health

### 6. Data Sanitization

**Process:**
1. Trim all whitespace from inputs
2. Convert email to lowercase
3. Remove any null bytes
4. Check for encoding issues

**Location:** Edge function before database insert

```typescript
const sanitizedData = {
  name: formData.name.trim(),
  email: formData.email.trim().toLowerCase(),
  subject: formData.subject.trim(),
  message: formData.message.trim(),
};
```

## Attack Vectors Prevented

### ✅ SQL Injection
- **Vector:** Malicious SQL code in form fields
- **Prevention:** Pattern detection + parameterized queries
- **Example Blocked:** `'; DROP TABLE users; --`

### ✅ Cross-Site Scripting (XSS)
- **Vector:** JavaScript code in form fields
- **Prevention:** Pattern detection + HTML encoding
- **Example Blocked:** `<script>alert('XSS')</script>`

### ✅ CSRF (Cross-Site Request Forgery)
- **Vector:** Malicious site submits form
- **Prevention:** Supabase auth tokens + CORS headers
- **Protection:** Only requests from approved origins

### ✅ Rate Limiting Bypass
- **Vector:** Multiple IPs or sessions
- **Prevention:** IP-based rate limiting
- **Mitigation:** 15-minute cooldown window

### ✅ Spam/Bot Submissions
- **Vector:** Automated form submissions
- **Prevention:** Rate limiting + validation
- **Future:** Can add CAPTCHA if needed

### ✅ Buffer Overflow
- **Vector:** Extremely long input strings
- **Prevention:** Strict length limits at 3 levels:
  1. Client validation
  2. Server validation
  3. Database constraints

### ✅ NoSQL Injection
- **Vector:** Not applicable (using PostgreSQL)
- **Protection:** Supabase client uses parameterized queries

## Security Best Practices

### ✅ Defense in Depth
- Multiple validation layers
- Client, server, and database validation
- Never trust client-side validation alone

### ✅ Principle of Least Privilege
- Anonymous users: No access
- Users: Cannot insert directly
- Admins: View and manage only
- Edge function: Insert using service role

### ✅ Fail Securely
- Validation errors don't reveal system details
- Generic error messages to users
- Detailed logging for administrators

### ✅ Audit Everything
- All submissions logged with metadata
- IP addresses tracked for abuse detection
- Timestamps for forensic analysis

### ✅ Rate Limiting
- Prevents abuse without blocking legitimate users
- 5 requests per 15 minutes is reasonable
- Can be adjusted based on usage patterns

## Admin Management

Admins can view and manage contact submissions through the Admin Dashboard.

**Available Actions:**
- View all submissions
- Filter by status (pending, reviewed, resolved)
- Update submission status
- Add internal notes
- Search by email or date

**Access Control:**
```sql
-- Only users with admin role can access
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
```

## Future Enhancements

### Potential Additions:
1. **CAPTCHA Integration**
   - Google reCAPTCHA v3 (invisible)
   - Only if spam becomes an issue

2. **Email Notifications**
   - Resend integration
   - Auto-reply to user
   - Notification to support team

3. **Honeypot Fields**
   - Hidden fields that bots fill out
   - Reject submissions with honeypot data

4. **Enhanced Rate Limiting**
   - User-based limits (if authenticated)
   - Geographic rate limiting
   - Adaptive rate limiting based on behavior

5. **Content Analysis**
   - Detect spam patterns
   - Flag potentially malicious content
   - Auto-categorize submissions

## Testing Security

### Manual Testing:
1. **SQL Injection Test:**
   - Try: `' OR '1'='1` in any field
   - Expected: Validation error

2. **XSS Test:**
   - Try: `<script>alert('test')</script>` in message
   - Expected: Validation error

3. **Length Test:**
   - Try: 3000 character message
   - Expected: Validation error

4. **Rate Limit Test:**
   - Submit 6 forms quickly
   - Expected: 6th submission blocked with 429

### Automated Testing:
```bash
# Test rate limiting
for i in {1..6}; do
  curl -X POST https://your-project.supabase.co/functions/v1/submit-contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Testing rate limit"}'
done
```

## Compliance

### GDPR Compliance:
- ✅ Explicit consent not required (legitimate interest)
- ✅ Data minimization (only necessary fields)
- ✅ Right to erasure (admins can delete)
- ✅ Data security (encryption at rest and in transit)

### Data Retention:
- Submissions stored indefinitely by default
- Can be configured for auto-deletion after X days
- Admins can manually delete resolved submissions

## Support

For security concerns or to report vulnerabilities:
- Email: security@pawdna.org
- Please include: Description, steps to reproduce, impact assessment

---

**Last Updated:** 2025-10-02  
**Version:** 1.0  
**Review Schedule:** Quarterly
