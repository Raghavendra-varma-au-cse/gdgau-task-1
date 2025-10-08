const consentButton = document.getElementById('consent-button');
const consentScreen = document.getElementById('consent-screen');
const collectionScreen = document.getElementById('collection-screen');
const resultScreen = document.getElementById('result-screen');
const phishForm = document.getElementById('phish-form');

const ipAddressEl = document.getElementById('ip-address');
const locationEl = document.getElementById('location');
const userAgentEl = document.getElementById('user-agent');

const networkEl = document.getElementById('network');
const timezoneEl = document.getElementById('timezone');
const screenEl = document.getElementById('screen');
const languagesEl = document.getElementById('languages');
const coresEl = document.getElementById('cores');
const dntEl = document.getElementById('dnt');

const capturedUsernameEl = document.getElementById('captured-username');
const capturedPasswordEl = document.getElementById('captured-password');
const resultIpEl = document.getElementById('result-ip');
const resultLocationEl = document.getElementById('result-location');
const resultNetworkEl = document.getElementById('result-network');
const resultTimezoneEl = document.getElementById('result-timezone');
const resultUserAgentEl = document.getElementById('result-user-agent');
const resultScreenEl = document.getElementById('result-screen');
const resultLanguagesEl = document.getElementById('result-languages');
const resultCoresEl = document.getElementById('result-cores');
const resultDntEl = document.getElementById('result-dnt');
const captureLogEl = document.getElementById('capture-log');

function setText(el, value) {
    if (!el) {
        return;
    }
    el.textContent = value;
}

setText(document.getElementById('year'), new Date().getFullYear().toString());

function resolveLanguages() {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    return langs.filter(Boolean).join(', ');
}

function resolveScreen() {
    const { width, height } = window.screen || { width: 0, height: 0 };
    const ratio = window.devicePixelRatio ? ` @ ${window.devicePixelRatio.toFixed(1)}x` : '';
    if (!width || !height) {
        return 'Unavailable';
    }
    return `${width}×${height}${ratio}`;
}

function resolveDoNotTrack() {
    const raw = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    if (!raw) {
        return 'Not shared';
    }
    const normalized = raw.toString().toLowerCase();
    if (normalized === '1' || normalized === 'yes') {
        return 'Enabled';
    }
    if (normalized === '0' || normalized === 'no') {
        return 'Disabled';
    }
    return 'Not shared';
}

function appendCaptureLog(message) {
    if (!captureLogEl) {
        return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    if (captureLogEl.dataset.empty === 'true') {
        captureLogEl.innerHTML = '';
        captureLogEl.dataset.empty = 'false';
    }

    const entry = document.createElement('li');
    entry.innerHTML = `<strong>${timestamp}</strong> ${message}`;

    captureLogEl.prepend(entry);

    const entries = captureLogEl.querySelectorAll('li');
    const maxEntries = 6;
    if (entries.length > maxEntries) {
        for (let i = maxEntries; i < entries.length; i += 1) {
            entries[i].remove();
        }
    }
}

let cachedContext = {
    ip: 'Unavailable',
    location: 'Unavailable',
    network: 'Unavailable',
    timezone: 'Unavailable',
    timezoneDisplay: 'Unavailable',
    userAgent: navigator.userAgent,
    screen: resolveScreen(),
    languages: resolveLanguages() || 'Unavailable',
    cores: typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency.toString() : 'Unavailable',
    dnt: resolveDoNotTrack()
};

let contextReady = false;

setText(userAgentEl, cachedContext.userAgent);
setText(screenEl, cachedContext.screen);
setText(languagesEl, cachedContext.languages);
setText(coresEl, cachedContext.cores);
setText(dntEl, cachedContext.dnt);

async function fetchJson(url, fallback) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch ${url}`, error);
        return fallback;
    }
}

async function collectContext() {
    const ipData = await fetchJson('https://api.ipify.org?format=json', { ip: 'Unavailable' });
    cachedContext.ip = ipData.ip || 'Unavailable';
    setText(ipAddressEl, cachedContext.ip);
    appendCaptureLog(`Network request exposed public IP <span>${cachedContext.ip}</span>.`);

    const geoData = await fetchJson('https://ipapi.co/json/', {
        city: 'Unknown city',
        region: '',
        country_name: 'Unknown country',
        org: 'Unknown provider',
        timezone: ''
    });

    const pieces = [geoData.city, geoData.region, geoData.country_name]
        .filter(Boolean)
        .join(', ');
    cachedContext.location = pieces || 'Unavailable';
    setText(locationEl, cachedContext.location);
    appendCaptureLog(`Approximate location mapped to <span>${cachedContext.location}</span>.`);

    cachedContext.network = geoData.org || 'Unavailable';
    setText(networkEl, cachedContext.network);
    appendCaptureLog(`ISP / network provider identified as <span>${cachedContext.network}</span>.`);

    const fallbackTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const resolvedTz = geoData.timezone || fallbackTz || 'Unavailable';
    let localTimeDisplay = 'Unavailable';
    if (resolvedTz && resolvedTz !== 'Unavailable') {
        try {
            const formatter = new Intl.DateTimeFormat([], {
                timeZone: resolvedTz,
                hour: '2-digit',
                minute: '2-digit'
            });
            localTimeDisplay = `${formatter.format(new Date())} (${resolvedTz})`;
        } catch (error) {
            console.warn('Unable to format timezone', error);
            localTimeDisplay = resolvedTz;
        }
    }
    cachedContext.timezone = resolvedTz;
    cachedContext.timezoneDisplay = localTimeDisplay;
    setText(timezoneEl, cachedContext.timezoneDisplay);
    appendCaptureLog(`Local time calculated as <span>${cachedContext.timezoneDisplay}</span>.`);

    setText(resultIpEl, cachedContext.ip);
    setText(resultLocationEl, cachedContext.location);
    setText(resultUserAgentEl, cachedContext.userAgent);
    setText(resultNetworkEl, cachedContext.network);
    setText(resultTimezoneEl, cachedContext.timezoneDisplay);
    setText(resultScreenEl, cachedContext.screen);
    setText(resultLanguagesEl, cachedContext.languages);
    setText(resultCoresEl, cachedContext.cores);
    setText(resultDntEl, cachedContext.dnt);
    appendCaptureLog(`Device fingerprint assembled (screen, languages, cores, DNT).`);
    contextReady = true;
}

function showSection(section) {
    [consentScreen, collectionScreen, resultScreen].forEach((el) => {
        if (!el) return;
        const isTarget = el === section;
        el.classList.toggle('hidden', !isTarget);
        el.setAttribute('aria-hidden', (!isTarget).toString());
    });
}

if (consentButton) {
    consentButton.addEventListener('click', async () => {
        showSection(collectionScreen);
        await collectContext();
    });
}

if (phishForm) {
    phishForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!contextReady) {
            await collectContext();
        }
        const formData = new FormData(phishForm);
        const username = formData.get('email') || '(empty)';
        const password = formData.get('password') || '(empty)';
        setText(capturedUsernameEl, username);
        setText(capturedPasswordEl, password || '(empty)');
        appendCaptureLog(`Credentials harvested for <span>${username || 'anonymous user'}</span>.`);

        setText(resultIpEl, cachedContext.ip);
        setText(resultLocationEl, cachedContext.location);
        setText(resultNetworkEl, cachedContext.network);
        setText(resultTimezoneEl, cachedContext.timezoneDisplay);
        setText(resultUserAgentEl, cachedContext.userAgent);
        setText(resultScreenEl, cachedContext.screen);
        setText(resultLanguagesEl, cachedContext.languages);
        setText(resultCoresEl, cachedContext.cores);
        setText(resultDntEl, cachedContext.dnt);

        showSection(resultScreen);
        if (typeof resultScreen.scrollIntoView === 'function') {
            resultScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        appendCaptureLog('Credentials transmitted to the attacker-controlled server endpoint.');
    });
}
