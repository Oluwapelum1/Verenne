// Tiny Admin GraphQL helper over `shopify store execute` (requires a prior `shopify store auth`).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export function admin(store) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verenne-admin-'));
  return function gql(query, variables, { mutate = false } = {}) {
    // Query and variables go through files so the Windows shell never splits them
    const varFile = path.join(tmp, 'vars.json');
    const queryFile = path.join(tmp, 'query.graphql');
    fs.writeFileSync(varFile, JSON.stringify(variables || {}));
    fs.writeFileSync(queryFile, query);
    const args = ['store', 'execute', '--store', store, '--query-file', queryFile, '--variable-file', varFile, '--json', '--no-input'];
    if (mutate) args.push('--allow-mutations');
    // The CLI aborts slow requests; every call here is safe to repeat
    for (let attempt = 1; ; attempt++) {
      try {
        const out = execFileSync('shopify', args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
        const json = JSON.parse(out.slice(out.indexOf('{')));
        return json.data ?? json;
      } catch (err) {
        if (attempt >= 4) throw err;
        console.log(`  retrying (${attempt}/3)…`);
      }
    }
  };
}

// Storefront details stored on each product as the `verenne.details` JSON metafield
export function productDetails(p) {
  const { subtitle, latin, texture, notes, keyIngredients, benefits, howToUse, ph, finish, glow, glass, moment, rating, reviewsCount, synergy, description, tint } = p;
  return { subtitle, latin, texture, notes, keyIngredients, benefits, howToUse, ph, finish, glow, glass, moment, rating, reviewsCount, synergy, description, tint };
}
