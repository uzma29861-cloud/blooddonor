# LifePulse — Rapid Voluntary Blood Donor Network
### Hyperlocal Emergency Blood Matching & Coordination Platform

> **Medical Disclaimer:** *"This platform is a community coordination prototype and must not be treated as an emergency medical service."* In life-threatening emergencies, always dial 108/102 and contact your nearest hospital blood bank directly.

---

## 🎨 1. Dynamic App Themes & Healthcare Color Palettes
LifePulse includes a real-time **Theme / Palette Switcher** in the top navbar powered by CSS variables:
1. **Crimson Pulse (Default Medical):** Deep Crimson (`#BE123C`) with soft blush tints (`#FFF1F2`) on crisp white surfaces.
2. **Clinical Teal & Emerald:** Calming Teal (`#0F766E`) with soft mint tints (`#F0FDFA`) for a stress-free hospital atmosphere.
3. **Royal Trust Blue:** Healthcare Trust Blue (`#1D4ED8`) with soft sky tints (`#EFF6FF`).
4. **High-Contrast Dark Mode:** Deep Slate/Charcoal background (`#0F172A`) with dark cards (`#1E293B`) and vibrant coral/crimson accents (`#F43F5E`) for night-shift emergency wards.

---

## 🌐 2. Language-First Onboarding & User Profile Flow
- **Step 1 — Language Selection Cards:** Big tactile cards for `English`, `हिंदी (Hindi)`, `मराठी (Marathi)`, and `ગુજરાતી (Gujarati)`.
- **Step 2 — Mobile & OTP Verification:** Role selection (`I Want to Donate` vs `I Need Blood`), Name, City, Blood Group, and simulated 4-digit OTP.
- **⚡ Instant Demo Bypass Button:** Allows judges and presenters to enter full prototype mode with 1 click.
- **Logged-In Profile Pill Menu:** Displays user's name, blood group badge (`O-`), and a dropdown with switch profile and logout options.

---

## 📐 3. Upgraded 2-Column Workspace Layout
- **Left Column (65% width) — Guided 3-Step Request Form:**
  - `1. Patient & Blood Requirement` with **tactile interactive blood group pills** (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`, `Bombay`).
  - `2. Hospital Location & Anchor` with 1-tap hospital selection.
  - `3. Contact & Doctor Prescription Verification` with camera/slip upload preview.
- **Right Column (35% width) — Sticky Live Match Radar:**
  - Real-time compatible blood group pills that will receive alerts.
  - Live count of compatible donors within 2 km.
  - Zonal blood banks stock units count.
  - Live preview of the auto-expiring WhatsApp card.

---

## 🚑 4. Six High-Impact Emergency Features
1. **20-Second Pre-Donation Medical Eligibility Quiz:** 4-question safety check (`No, No, Yes, Yes`) before donor acceptance.
2. **One-Tap Auto-Expiring WhatsApp SOS Card:** Dynamically switches from `🚨 URGENT NEED` to `✅ FULFILLED` to stop spam calls to families.
3. **Nearby Verified Blood Banks (Live Stock):** Tab listing zonal blood banks with ready stock for backup.
4. **Sponsor a Donor's Ride:** One-tap Uber Go, Ola Mini, and Rapido Bike taxi deep-links.
5. **Rare Blood Tribe Network:** City donor counts for `O-`, `AB-`, and `Bombay Blood (hh)` with Priority Siren Alerts.
6. **Offline / Low-Network SMS Fallback:** Compact structured code (`BLOOD REQ A- 2U LILAVATI`) with 1-tap `sms:104` dialer for hospital basements.

---

## 💻 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
