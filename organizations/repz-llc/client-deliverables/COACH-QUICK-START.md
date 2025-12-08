# REPZ Coach Quick Start Guide

## Onboarding Your First Client Today

---

## Your Client: Emilio (PAID ✅)

### Immediate Action Items

#### Step 1: Send Intake Form (5 min)

**Option A: Email the Markdown Form**
1. Open `client-deliverables/emilio/EMILIO-INTAKE-FORM.md`
2. Copy content or export to PDF
3. Email to Emilio with subject: "REPZ - Your Personalized Coaching Intake Form"

**Option B: Use Google Form**
Create a Google Form with the same questions for easier collection.

**Option C: Use the REPZ Portal** (if deployed)
1. Navigate to `/intake-email` route
2. Send Emilio the link: `https://your-domain.com/intake-email`

---

#### Step 2: Collect Information

Wait for Emilio to complete the intake form. Typical turnaround: 24-48 hours.

**What you need from Emilio:**
- Personal info (age, height, weight)
- Health history
- Training experience
- Goals
- Current nutrition
- Supplement history
- Photos (optional but recommended)

---

#### Step 3: Create His Plan (1-2 hours)

Once intake is received:

1. Open `client-deliverables/emilio/EMILIO-COMPREHENSIVE-PLAN.md`
2. Fill in all sections based on his intake data:
   - Calculate his macros
   - Design his training split
   - Select appropriate exercises
   - Create supplement protocol
   - Add peptide protocol if applicable (Performance+ tier)

---

#### Step 4: Deliver the Plan

**Email Template:**

```
Subject: Your REPZ Personalized Training & Nutrition Plan

Hi Emilio,

Thank you for completing your intake form! I've reviewed your information and created your personalized 12-week program.

Attached you'll find:
✅ Complete Training Program
✅ Nutrition Plan with Meal Examples
✅ Supplement Protocol
✅ Progress Tracking Sheets

Please review everything and let me know if you have any questions.

Your first check-in is scheduled for [DATE].

Let's get to work!

[Your Name]
REPZ Coaching
```

---

#### Step 5: Set Up Tracking

1. Update `EMILIO-CLIENT-RECORD.md` with:
   - His contact info
   - Tier selected
   - Payment details
   - Check-in schedule

2. Schedule weekly check-ins in your calendar

---

## Files Created for Emilio

```
client-deliverables/
└── emilio/
    ├── EMILIO-INTAKE-FORM.md      # Send this first
    ├── EMILIO-COMPREHENSIVE-PLAN.md # Fill this out after intake
    └── EMILIO-CLIENT-RECORD.md    # Your tracking document
```

---

## Quick Macro Calculator

**For Weight Loss:**
- Protein: 1g per lb bodyweight
- Calories: Bodyweight × 10-12
- Carbs: Fill remaining after protein/fat
- Fat: 0.3-0.4g per lb bodyweight

**For Muscle Gain:**
- Protein: 1g per lb bodyweight
- Calories: Bodyweight × 16-18
- Carbs: Fill remaining after protein/fat
- Fat: 0.3-0.4g per lb bodyweight

**For Maintenance:**
- Protein: 0.8-1g per lb bodyweight
- Calories: Bodyweight × 14-15

---

## Tier Features Quick Reference

| Feature | Core | Adaptive | Performance | Longevity |
|---------|------|----------|-------------|-----------|
| Training Plan | ✅ | ✅ | ✅ | ✅ |
| Nutrition Plan | ✅ | ✅ | ✅ | ✅ |
| Basic Supplements | ✅ | ✅ | ✅ | ✅ |
| Weekly Check-ins | ❌ | ✅ | ✅ | ✅ |
| Photo Reviews | ❌ | ✅ | ✅ | ✅ |
| Advanced Supplements | ❌ | ❌ | ✅ | ✅ |
| Peptide Protocols | ❌ | ❌ | ✅ | ✅ |
| Video Calls | ❌ | ❌ | ✅ | ✅ |
| In-Person Training | ❌ | ❌ | ❌ | ✅ |
| Response Time | 72h | 48h | 24h | 12h |

---

## Portal Access (Optional)

If you want to give Emilio portal access:

### Option 1: Create Account Manually

1. Go to Supabase Dashboard
2. Authentication → Users → Invite User
3. Enter Emilio's email
4. He'll receive an invite to set password

### Option 2: Self-Registration

Send him to your signup page:
- URL: `https://your-domain.com/signup`
- He creates his own account
- You assign him as your client in the admin panel

---

## Response Templates

### Check-in Response

```
Hi Emilio,

Great check-in! Here's my feedback:

**Weight:** [+/-X lbs] - [On track / Adjust needed]

**Training:** [Feedback on workout completion]

**Nutrition:** [Feedback on adherence]

**Adjustments for this week:**
- [Change 1]
- [Change 2]

Keep up the great work!

[Your Name]
```

### Missed Check-in

```
Hi Emilio,

I noticed I haven't received your check-in for this week. 

Just a reminder to send:
- Morning weight
- Training completion
- Quick nutrition update

Let me know if you have any questions or need support!

[Your Name]
```

---

## Emergency Contacts

**Technical Issues:** [Your tech support]

**Billing Questions:** [Your billing contact]

**Medical Emergencies:** Always refer to licensed healthcare provider

---

## Next Steps After Emilio

1. Create a template folder for future clients
2. Set up automated intake form (Google Forms or Typeform)
3. Consider deploying the REPZ portal for scale
4. Create email templates in your email client

---

*You're ready to coach! Let's get Emilio started today.*
