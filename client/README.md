# @chatfall/client

![Chatfall Screenshot](screenshot.png)

Chatfall is a fully-featured self-hosted commenting system for easily adding comments to any webpage. 

This package contains _only_ the client widget for embedding into your website. 

Please see the [root repository](https://github.com/hiddentao/chatfall) for more details.

## Usage guide

We recommend loading this package at runtime via a CDN instead of bundling it into your code. For example:

```html
<script>
  const iframe = document.createElement('iframe');
  // BEGIN: edit these values to match your needs
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = 'none';
  const serverUrl = 'http://localhost:3000';   // URL to your Chatfall server
  const rootElement = document.getElementById('root');
  const version = '0.18.0'; // replace with the version of the Chatfall server you are running
  // END
  iframe.srcdoc = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@chatfall/client@${version}/dist/chatfall.css" crossorigin="anonymous" />
    <script type="module">
      import { Chatfall } from 'https://cdn.jsdelivr.net/npm/@chatfall/client@${version}/dist/chatfall.es.js';
      Chatfall.init({
        serverUrl: '${serverUrl}',
        pageUrl: '${location.href}',
      });
    <\/script>
  `;
  rootElement.appendChild(iframe)
</script>
```

Read the [official documentation](https://chatfall.com/docs/widget/basic-setup) for usage instructions.

## License

See [LICENSE.md](LICENSE.md)