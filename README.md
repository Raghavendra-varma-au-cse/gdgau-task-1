# Simulated Phishing Training Demo

Interactive, client-side phishing awareness demo created for the GDGoC Andhra University Cybersecurity domain.

Lead: **Dandu S N Venkata Pavan Raghavendra Varma**  
Co-Lead: **Sriharsha Meduri**

## What this demo includes

1. **Explicit consent screen** – Users acknowledge the simulation before proceeding.
2. **Real-time context display** – Public IP, approximate location, and browser details are fetched from publicly available APIs and shown on-screen only.
3. **Fake login capture** – Visitors can input dummy credentials to see how attackers could capture them instantly.
4. **Educational debrief** – A follow-up page explains the risk and offers practical defense tips.

> ⚠️ No personal data is stored, logged, or transmitted to any server. All interactions remain within the user’s browser.

## Getting started

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
2. Accept the consent prompt to reveal the simulated phishing experience.
3. Follow the flow to the defense guidance page (`protect.html`).

### Optional local server

Running a simple static server avoids API CORS issues:

```powershell
npx serve .
```

Then open the printed URL in your browser.

## Free APIs used

- [`https://api.ipify.org`](https://api.ipify.org) – retrieves the visitor’s public IP address.
- [`https://ipapi.co/json/`](https://ipapi.co/json/) – provides approximate geolocation metadata.

## Customization tips

- Update colors and typography in `assets/css/styles.css`.
- Replace text copy in `index.html` and `protect.html` to match your organization’s voice.
- Consider swapping the GeoIP provider if you need region-specific accuracy or higher rate limits.

## Ethical guidelines for facilitators

- Always obtain explicit consent before running simulations.
- Remind participants not to reuse real credentials.
- Debrief immediately after the exercise and provide reporting channels.

## License

This project is provided for educational and training purposes. Adapt responsibly and attribute GDGoC Andhra University Cybersecurity domain leadership when sharing.
