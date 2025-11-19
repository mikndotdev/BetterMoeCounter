export function renderIndexPage(
	site: string,
	themeList: Record<string, any>,
) {
	const themeKeys = Object.keys(themeList);
	const themeOptions = themeKeys
		.map((theme) => `<option value="${theme}">${theme}</option>`)
		.join("\n                ");
	const themeItems = themeKeys
		.map(
			(theme) => `
          <div class="item" data-theme="${theme}">
            <h5>${theme}</h5>
            <img data-src="${site}/@demo?theme=${theme}" alt="${theme}">
          </div>`,
		)
		.join("");

	return `<!DOCTYPE html>
<html>
  <head>
    <title>Moe Counter!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/png" href="${site}/favicon.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/normalize.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bamboo.css">
    <link rel="stylesheet/less" href="${site}/style.less">
    <script less src="https://cdn.jsdelivr.net/npm/less"></script>
    <script src="https://cdn.mikn.dev/analytics/script" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    swetrix.init('XOhoWXEMHQvK', {
      apiURL: 'https://analytics.mikandev.tech/log',
    })
    swetrix.trackViews()
  })
</script>

<noscript>
  <img
    src="https://analytics.mikandev.tech/log/noscript?pid=XOhoWXEMHQvK"
    alt=""
    referrerpolicy="no-referrer-when-downgrade"
  />
</noscript>
  </head>
  <body>
    <h1 id="main_title">
      <i>Better Moe Counter!</i>
    </h1>
    <h3>How to use</h3>
    <p>Set a unique id for your counter, replace <code>:name</code> in the url, That's it!</p>
    <h5>SVG address</h5>
    <code>${site}/@:name</code>
    <h5>Img tag</h5>
    <code>&lt;img src="${site}/@:name" alt=":name" /&gt;</code>
    <h5>Markdown</h5>
    <code>![:name](${site}/@:name)</code>
    <h5>e.g.<img src="${site}/@index" alt="Moe Counter!"></h5>
    <details id="themes">
      <summary id="more_theme" onclick="_evt_push('click', 'normal', 'more_theme')">
        <h3>More theme✨</h3>
      </summary>
      <p>Just use the query parameters <code>theme</code>, like this: <code>${site}/@:name?theme=moebooru</code></p>${themeItems}
    </details>
    <h3>Credits</h3>
    <ul>
      <li><a href="https://github.com/journey-ad/Moe-counter" target="_blank" rel="nofollow">Original Moe Counter</a></li>
      <li><a href="https://space.bilibili.com/703007996" target="_blank" title="A-SOUL_Official">A-SOUL</a></li>
      <li><a href="https://github.com/moebooru/moebooru" target="_blank" rel="nofollow">moebooru</a></li>
      <li><a href="javascript:alert('!!! NSFW LINK !!!\\nPlease enter the url manually')">gelbooru.com</a> NSFW</li>
      <li><a href="https://icons8.com/icon/80355/star" target="_blank" rel="nofollow">Icons8</a></li>
      <span><i>And all booru site...</i></span>
    </ul>
    <h3>Tool</h3>
    <div class="tool">
      <table>
        <thead>
          <tr>
            <th>Param</th>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>name</code></td>
            <td>Unique counter name</td>
            <td><input id="name" type="text" placeholder=":name"></td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td>Select a counter image theme, default is <code>moebooru</code></td>
            <td>
              <select id="theme">
                <option value="random" selected>* random</option>
                ${themeOptions}
              </select>
            </td>
          </tr>
          <tr>
            <td><code>padding</code></td>
            <td>Set the minimum length, between 1-16, default is <code>7</code></td>
            <td><input id="padding" type="number" value="7" min="1" max="32" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>Set the offset pixel value, between -500-500, default is <code>0</code></td>
            <td><input id="offset" type="number" value="0" min="-500" max="500" step="1" oninput="this.value = this.value.replace(/[^0-9|\\-]/g, '')"></td>
          </tr>
          <tr>
            <td><code>scale</code></td>
            <td>Set the image scale, between 0.1-2, default is <code>1</code></td>
            <td><input id="scale" type="number" value="1" min="0.1" max="2" step="0.1" oninput="this.value = this.value.replace(/[^0-9|\\.]/g, '')"></td>
          </tr>
          <tr>
            <td><code>align</code></td>
            <td>Set the image align, Enum top/center/bottom, default is <code>top</code></td>
            <td>
              <select id="align" name="align">
                <option value="top" selected>top</option>
                <option value="center">center</option>
                <option value="bottom">bottom</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><code>pixelated</code></td>
            <td>Enable pixelated mode, Enum 0/1, default is <code>1</code></td>
            <td>
              <input id="pixelated" type="checkbox" role="switch" checked>
              <label for="pixelated"><span></span></label>
            </td>
          </tr>
          <tr>
            <td><code>darkmode</code></td>
            <td>Enable dark mode, Enum 0/1/auto, default is <code>auto</code></td>
            <td>
              <select id="darkmode" name="darkmode">
                <option value="auto" selected>auto</option>
                <option value="1">yes</option>
                <option value="0">no</option>
              </select>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <h4 class="caption">Unusual Options</h4>
            </td>
          </tr>
          <tr>
            <td><code>num</code></td>
            <td>Set counter display number, 0 for disable, default is <code>0</code></td>
            <td><input id="num" type="number" value="0" min="0" max="1e15" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></td>
          </tr>
          <tr>
            <td><code>prefix</code></td>
            <td>Set the prefix number, empty for disable</td>
            <td><input id="prefix" type="number" value="" min="0" max="999999" step="1" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></td>
          </tr>
        </tbody>
      </table>
      <button id="get" onclick="_evt_push('click', 'normal', 'get_counter')">Generate</button>
      <div>
        <code id="code"></code>
        <img id="result">
      </div>
    </div>
    <p class="github">
      <a href="https://github.com/mikndotdev/BetterMoeCounter" target="_blank" onclick="_evt_push('click', 'normal', 'go_github')">source code</a>
    </p>
    <img src="https://cdn.mikn.dev/branding/mikan-vtube.png" class="logo" alt="Logo" class="watermark">
    <div class="back-to-top"></div>
    <script async src="https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js"></script>
    <script async src="${site}/script.js"></script>
  </body>
</html>`;
}
