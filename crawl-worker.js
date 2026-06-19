const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Parse robots.txt and return per-agent results
// Returns { allowed: bool, explicit: bool } for each requested agent
function parseRobots(robotsTxt, agents, path = '/') {
  const lines = robotsTxt.split(/\r?\n/);
  const results = {};
  for (const agent of agents) results[agent] = { allowed: true, explicit: false };

  let currentAgents = [];

  for (let line of lines) {
    line = line.replace(/#.*$/, '').trim();
    if (!line) { currentAgents = []; continue; }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const field = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (field === 'user-agent') {
      currentAgents.push(value.toLowerCase());
    } else if (field === 'disallow' || field === 'allow') {
      const isAllow = field === 'allow';
      const rulePath = value;
      const matches = rulePath === '' || path.startsWith(rulePath);

      for (const agent of agents) {
        const agentLower = agent.toLowerCase();
        if (currentAgents.includes(agentLower)) {
          // Explicit rule for this specific agent
          if (matches) {
            results[agent].allowed = isAllow || rulePath === '';
            results[agent].explicit = true;
          }
        } else if (currentAgents.includes('*') && !results[agent].explicit) {
          // Wildcard rule — only apply if no explicit rule seen yet
          if (matches) {
            results[agent].allowed = isAllow || rulePath === '';
          }
        }
      }
    }
  }

  return results;
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const target = searchParams.get('url');

    if (!target) {
      return Response.json({ error: 'Missing url parameter' }, { status: 400, headers: CORS_HEADERS });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(target);
    } catch {
      return Response.json({ ok: false, error: 'Invalid URL' }, { headers: CORS_HEADERS });
    }

    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
    const urlPath = parsedUrl.pathname || '/';

    const [urlResult, robotsResult] = await Promise.allSettled([
      fetch(target, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'AdsBot-Google (+http://www.google.com/adsbot.html)' },
      }),
      fetch(robotsUrl, {
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'AdsBot-Google (+http://www.google.com/adsbot.html)' },
      }),
    ]);

    // ── URL check ──
    let urlOk = false, redirected = false, status = 0, statusText = 'Unreachable', finalUrl = target;
    if (urlResult.status === 'fulfilled') {
      const r = urlResult.value;
      urlOk = r.ok;
      redirected = r.redirected;
      status = r.status;
      statusText = r.statusText;
      finalUrl = r.url;
    }

    // ── robots.txt check ──
    const AGENTS = ['AdsBot-Google', 'Googlebot'];
    let robotsParsed = null;
    let robotsError = false;
    let robotsFetched = false;

    if (robotsResult.status === 'fulfilled' && robotsResult.value.ok) {
      robotsFetched = true;
      const txt = await robotsResult.value.text();
      robotsParsed = parseRobots(txt, AGENTS, urlPath);
    } else if (robotsResult.status === 'rejected') {
      robotsError = true;
    }

    const robots = {
      fetched: robotsFetched,
      error: robotsError,
      adsBot:    robotsParsed ? robotsParsed['AdsBot-Google']  : { allowed: true, explicit: false },
      googlebot: robotsParsed ? robotsParsed['Googlebot']      : { allowed: true, explicit: false },
    };

    const ok = urlOk && !redirected && robots.adsBot.allowed && robots.googlebot.allowed;

    return Response.json({ ok, status, statusText, redirected, finalUrl, robots }, { headers: CORS_HEADERS });
  },
};
