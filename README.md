# Lightning App Template

A project template to jump-start developing a ⚡ Lightning app.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/reneaaron/lapp-template)

## Features

 - ✅ Lightning Authentication (using LNURL-auth)
 - 🔜 Request payments from users (WebLN + QR-Code)

## Getting started

### Lightning setup

1. Create a new wallet on LNBits
1. Enable the extension "LNURLp"
1. Create a new pay link, make sure you allow comments

### Project setup

Remix this glitch and set the environment variables by editing the `.env` file:

- `INVOICE_KEY`: The `Invoice/read key` of your LNBits wallet
- `LNBITS_URL`: The URL of your LNBits instance (i.e. `https://legend.lnbits.com` ⚠️ no trailing slash)
- `LNURL`: The LNURL-pay LNURL to generate invoices (`LNURL...`)

## Hosting

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/reneaaron/lightningapp-template/tree/master&refcode=42dd69fa9253)
