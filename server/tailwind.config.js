const clientConfig = require("../client/tailwind.config")
clientConfig.content = [
  "./src/react/**/*.{js,jsx,ts,tsx,html}",
  "../client/src/**/*.{js,jsx,ts,tsx,html}",
]
module.exports = clientConfig
