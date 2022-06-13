# Lightning App Template

A project template to jump-start developing a ⚡ Lightning app.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/reneaaron/lapp-template)

## Features

 - ✅ Lightning Authentication (using LNURL-auth)
 - ✅ Request payments from users (WebLN + QR-Code)
 - ✅ Invoice APIs (request invoices, check invoice status)

## Getting started

### Lightning setup

1. Create a new wallet on [LNBits](https://legend.lnbits.com) or use your own LNBits server
1. Copy the `Invoice/read key` of your wallet

### Project setup

Remix this glitch and set the environment variables by editing the `.env` file:

- `LNBITS_INVOICE_KEY`: The `Invoice/read key` of your LNBits wallet
- `LNBITS_URL`: The URL of your LNBits instance (i.e. `https://legend.lnbits.com` ⚠️ no trailing slash)

## Hosting

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/reneaaron/lapp-template/tree/master&refcode=42dd69fa9253)
