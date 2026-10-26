const https = require('https');

const API_KEY = '21st_sk_a333df56241e6c9d31bb08d1ad0aa5ec7e8cec038f9bca98499359045fcf94e2';
const ENDPOINT = 'https://21st.dev/api/mcp';

function callMcp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    });

    const req = https.request(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  const [,, cmd, ...args] = process.argv;
  if (!cmd || cmd === 'help') {
    console.log('Usage:');
    console.log('  node 21st.js list');
    console.log('  node 21st.js search <query> [limit]');
    console.log('  node 21st.js get <componentId>');
    console.log('  node 21st.js theme <themeId>');
    return;
  }

  if (cmd === 'list') {
    const res = await callMcp('tools/list');
    if (res.result && res.result.tools) {
      console.log(`Available Tools (${res.result.tools.length}):`);
      res.result.tools.forEach(t => console.log(`- ${t.name}: ${t.description.split('.')[0]}`));
    } else {
      console.error(res.error || res);
    }
  } else if (cmd === 'search') {
    const query = args.join(' ') || 'carousel';
    const res = await callMcp('tools/call', {
      name: 'search',
      arguments: { query, limit: 5 }
    });
    if (res.result && res.result.content) {
      res.result.content.forEach(c => console.log(c.text));
    } else {
      console.error(res.error || res);
    }
  } else if (cmd === 'get') {
    const id = Number(args[0]);
    if (!id) {
      console.error('Please specify a valid numeric component ID');
      return;
    }
    const res = await callMcp('tools/call', {
      name: 'get_component',
      arguments: { id }
    });
    if (res.result && res.result.content) {
      res.result.content.forEach(c => console.log(c.text));
    } else {
      console.error(res.error || res);
    }
  } else if (cmd === 'theme') {
    const id = args[0];
    const res = await callMcp('tools/call', {
      name: 'get_theme',
      arguments: { id }
    });
    if (res.result && res.result.content) {
      res.result.content.forEach(c => console.log(c.text));
    } else {
      console.error(res.error || res);
    }
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
