# KOLMO search and AI discovery launch policy

Owner: Ray. Scope: the public `kolmo.app` landing page and the future public content site.

## Current implementation

- `robots.txt` allows ordinary search crawlers, OAI-SearchBot, PerplexityBot,
  Claude-SearchBot, ChatGPT-User and Claude-User explicitly. The latter three
  were already allowed by the wildcard rule; naming them documents intent.
  User-directed fetchers have provider-specific rules: OpenAI says robots.txt
  may not apply to ChatGPT-User. It is not the ChatGPT search-index opt-out bot.
- GPTBot collection is disallowed independently of ChatGPT search. This is a
  crawler preference, not a guarantee against every form of AI collection.
- ClaudeBot and Google-Extended currently inherit the permissive wildcard rule.
  Their training-use policies remain separate decisions; this change does not
  add a new training opt-out for them. Google-Extended covers Gemini training
  AND some Gemini/Vertex grounding, while not affecting Google Search inclusion
  or ranking. Do not describe it as a training-only switch.
- `sitemap.xml` lists the homepage and the implemented Kairos definition page
  at `/glossary/kairos/`, linked from the homepage. Do not list planned,
  unpublished, empty or authenticated pages. Omit `lastmod` until a reliable
  content-modification timestamp is available; never use each build time.
- Homepage title, description, Open Graph and Twitter metadata describe early
  access consistently. Sharing uses the existing 180 x 180 brand icon with a
  summary card; a larger approved social image can replace it later.
- Organization, WebSite and WebPage JSON-LD describe the landing page. They do
  not assert that the unreleased application is free or available now.
- The terminal preview is explicitly labelled as simulated. `data-nosnippet`
  asks Google to exclude its illustrative values from snippets; it is not a
  universal control for all AI services. Keep the visible label for readers.
- The glossary supplies its definition, examples, evidence limitations and CTA
  in static HTML, with WebPage and DefinedTerm markup. It makes no measured
  detection, accuracy or live-data claim. Glossary analytics delivery is not
  implemented/verified by this patch; connect it to the site's measurement
  setup before claiming complete attribution across landing pages.

## Release checklist

1. Review this change on the actual publishing branch. This repository currently
   serves GitHub Pages; changing the separate engine or a Vercel preview does
   not update `kolmo.app`. Coordinate the open landing-page redesign when merging
   so that these metadata fixes are carried forward.
2. After deployment, check unauthenticated HTTPS responses for `/`,
   `/glossary/kairos/`, `/robots.txt`, `/sitemap.xml` and `/apple-touch-icon.png`:
   200, correct content types, no login
   challenge and no accidental `noindex` header on the homepage.
3. Verify `kolmo.app` ownership in Google Search Console and Bing Webmaster Tools
   using the actual account-provided token or DNS record. Never invent a token.
4. Submit `https://kolmo.app/sitemap.xml` in both services. Inspect the canonical
   homepage and request indexing where available. Record submission and actual
   indexed status separately: submission is not proof of indexing.
5. If a CDN or firewall is added, verify legitimate crawler access using each
   provider's documented identity checks. Do not trust a User-Agent string alone.
6. If migrating to Vercel, retain the production canonical URL. Keep previews
   protected and serve `X-Robots-Tag: noindex` for preview responses. Test both
   production and preview after migration; this static patch does not configure
   Vercel or any external account.

Search Console, Bing ownership/submission and production deployment are separate
operations, not completed by committing these files. Crawling, indexing, rankings
and AI citation are not guaranteed by a robots rule or sitemap.

## Evidence boundaries for AI-search advice

- Initial HTML content is the engineering requirement for this site. Static
  HTML, SSG and SSR can all meet it. The current GitHub Pages landing and glossary
  already provide text without JavaScript. React/Vue alone does not determine
  crawlability; inspect the response. Vercel/MERJ's large crawl study supports
  this design choice, but is an observation of measured bots and time periods,
  not a permanent specification for every AI product or browser agent.
- Bing registration is useful, but Bing ranking is not documented as the sole
  determinant of ChatGPT citations. OpenAI uses its own search crawler and may
  work with other search providers. A model can also receive information in
  user messages, files, connected sources or direct page retrieval; real-time
  search is not the only conceivable way it can know a new site.
- A concise answer, descriptive headings and truthful update dates help readers.
  There is no established universal 80-word citation rule, mandatory paragraph
  chunk size or guarantee that newer dates alone make content preferable.
- Google stopped displaying FAQ rich results on 2026-05-07 and removed the
  feature documentation on 2026-06-15. FAQ content can still serve readers;
  FAQPage is not a KOLMO launch dependency or a promised AI visibility boost.
- Original evidence and useful synthesis are content priorities, not a proven
  exclusive path to discovery. Publish only supported, permitted facts. A Kairos
  detection timestamp must link to contemporaneous evidence; distinguish match
  clock, actual capture/detection time and later review/publication time. Pair
  any model number with its version, evaluation scope and uncertainty.
- Earn authentic external references through useful work. Do not manufacture
  Reddit posts, reviews or mentions, or assume an individual mention guarantees
  an AI ranking benefit.
- Describe KOLMO's actual esports-analysis offering accurately. Do not claim
  that every betting-related source is automatically excluded from citations,
  or relabel a different service to evade a platform policy. Product-use rules
  and search/source-selection behavior are different questions.
- Google says llms.txt does not affect its Search visibility or rankings. It can
  have maintenance cost, so add it only for a concrete consumer and keep it in
  sync with the public site. It grants no additional data rights.

## Public content rollout

The paths below are proposed conventions, not currently published pages.

| Priority | Page | Required public information | Completion evidence |
| --- | --- | --- | --- |
| P1 | `/lol/schedule/`, `/cs2/schedule/` | Confirmed time with timezone, tournament, teams, match status, freshness/source | Readable initial HTML; no fabricated fixtures; stable links to matches |
| P1 | `/matches/{id}/` | Match identity, schedule/result state, updated time, approved source references | Persistent URL before/after match; postponed and cancelled states supported |
| P1 | `/teams/{slug}/` | Game, season, roster scope, observed style, supporting matches | Separate observations from hypotheses; date the analysis |
| P1 | `/articles/{slug}/` | Match header, thesis, evidence, author, publication/update dates, limitations | Approved factual claims and source links; no hindsight labelled as live detection |
| P1 | `/methodology/` | Method, input coverage, evaluation scope, missing-data handling, corrections | Claims traceable to actual evaluation; uncertainty and coverage visible |
| P2 | `/research/{slug}/` | Theory summary, LoL/CS2 application, original paper links | Original synthesis with sourced facts; no unsupported performance claim |

Each released page must provide useful text without requiring client JavaScript,
a unique title/description, an absolute canonical URL and ordinary HTML links.
Use static HTML, static generation or SSR as appropriate. Structured data must match visible
content. Add Article markup only to actual articles; no fake reviews, ratings,
events or author profiles. Translated pages need their own reviewed content,
language URLs and reciprocal `hreflang` links before being listed as translations.

Only approved public summaries and derived content belong here. Raw supplier
feeds, credentials, account data and internal APIs require real authentication
and authorization. `robots.txt`, `noindex` and `data-nosnippet` are not access
controls. A robots-disallowed URL can still appear without a snippet; a crawler
must access a page to observe its `noindex` directive. Use the engine's removal
workflow if an already-indexed URL needs removal.

Keep demos and unsupported data out of article, match and team claims. Preserve
the distinction between an observed fact, derived analysis and interpretation.
Do not mass-produce empty pages just to target keyword variants. `llms.txt` is
optional for a demonstrated consumer and is not a launch requirement.

## Freshness and measurement

- Start with sitemap updates when public URLs are published, materially changed
  or removed. Add IndexNow for participating engines once frequent updates exist;
  it is an update notification, not a ranking or Google indexing guarantee.
- Review Search Console/Bing indexing, impressions, queries and clicks weekly.
- In analytics, compare identifiable search/AI referrers and landing pages with
  successful `waitlist_signup` conversions. Keep direct/unknown traffic separate;
  stripped referrers must not be guessed as AI visits. Validate event delivery
  before treating existing frontend instrumentation as working measurement.
- Use the existing PostHog setup for this funnel unless an additional GA4 use
  case is identified. Referrer attribution is possible in either system; GA4
  is not a requirement for AI discovery. Include recognizable sources such as
  chatgpt.com, perplexity.ai and claude.ai, with exact/subdomain-aware matching.
- After product launch, extend conversion reporting to signup, team follow,
  notification opt-in and paid conversion. Avoid collecting full user query
  strings or email addresses as search-attribution properties.
- Use a fixed set of dated Korean/English questions to sample AI citations and
  check whether the linked answer is accurate. Results vary across sessions and
  products. Visits and citation samples do not measure every AI impression.

## Official references (reviewed 2026-09-22)

- https://developers.openai.com/api/docs/bots
- https://help.openai.com/en/articles/9237897-chatgpt-search
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended
- https://developers.google.com/search/updates
- https://vercel.com/blog/the-rise-of-the-ai-crawler
- https://schema.org/DefinedTerm
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search
