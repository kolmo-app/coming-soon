// Run with: node --test waitlist.analytics.test.cjs
// Executes only the deployed form handler; no network or email is sent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).find(code => code.includes("form.addEventListener('submit'"));
assert.ok(script, 'Expected the actual waitlist handler in index.html');
const source = script.slice(0, script.indexOf('})();') + 5);

async function submit({ ok = true, success = true, networkError = false,
  jsonError = false, sdk = 'available' } = {}) {
  let handler;
  let requests = 0;
  const events = [];
  const message = { className: '', textContent: '' };
  const button = { textContent: 'Join Waitlist', disabled: false };
  const emailInput = { value: 'qa@example.invalid' };
  const form = {
    style: {},
    addEventListener(type, callback) { assert.equal(type, 'submit'); handler = callback; },
    querySelector() { return button; },
    reset() { emailInput.value = ''; },
  };
  const analytics = { capture(name, properties) {
    if (sdk === 'throws') throw new Error('SDK unavailable');
    events.push({ name, properties: JSON.parse(JSON.stringify(properties)) });
  } };
  const sandbox = {
    document: { getElementById(id) {
      return { waitlistForm: form, waitlistEmail: emailInput, waitlistMessage: message }[id];
    } },
    window: { posthog: sdk === 'missing' ? undefined : analytics },
    posthog: analytics,
    fetch: async () => {
      requests++;
      if (networkError) throw new Error('Network unavailable');
      return { ok, json: async () => {
        if (jsonError) throw new Error('Invalid JSON');
        return { success };
      } };
    },
  };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  await handler({ preventDefault() {} });
  return { requests, events, successful: message.className.endsWith(' success'),
    failed: message.className.endsWith(' error'), hidden: form.style.display === 'none',
    buttonDisabled: button.disabled };
}

test('provider acceptance emits a diagnostic without claiming a unique signup', async () => {
  const result = await submit();
  assert.equal(result.requests, 1);
  assert.equal(result.successful, true);
  assert.equal(result.hidden, true);
  assert.deepEqual(result.events, [{ name: 'waitlist_submission_accepted', properties: {
    source: 'homepage', surface: 'landing', schema_version: '1.1',
    registration_status: 'provider_accepted',
  } }]);
  assert.ok(!JSON.stringify(result.events).includes('qa@example.invalid'));
});

for (const [name, options] of [
  ['provider rejection', { success: false }],
  ['network failure', { networkError: true }],
  ['HTTP failure with success payload', { ok: false }],
  ['string success field', { success: 'false' }],
  ['invalid JSON', { jsonError: true }],
]) {
  test(name + ' is not a successful submission', async () => {
    const result = await submit(options);
    assert.equal(result.failed, true);
    assert.equal(result.events.length, 0);
    assert.equal(result.hidden, false);
    assert.equal(result.buttonDisabled, false);
  });
}

for (const sdk of ['missing', 'throws']) {
  test('SDK ' + sdk + ' does not invalidate an accepted submission', async () => {
    const result = await submit({ sdk });
    assert.equal(result.successful, true);
    assert.equal(result.events.length, 0);
    assert.equal(result.requests, 1);
    assert.equal(result.hidden, true);
  });
}

test('two accepted submissions remain two diagnostics, never two confirmed signups', async () => {
  // Separate contexts model a reload. Server registration dedupe is still required.
  const events = [...(await submit()).events, ...(await submit()).events];
  assert.equal(events.length, 2);
  assert.equal(events.filter(event => event.name === 'waitlist_signup').length, 0);
});
