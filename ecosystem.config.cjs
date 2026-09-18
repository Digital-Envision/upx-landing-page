module.exports = {
  apps: [{
    name: "upx-landing-page",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    interpreter: "bun",
    env: {
      NODE_ENV: "production",
      PORT: 3003
    }
  }]
}
