# Lightning App Template

A simple project template to build your ⚡ Lightning Apps on. Authentication, WebLN, QR-Code fallbacks and more! 

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/reneaaron/lapp-template)

## Features

 - ✅ Lightning Authentication (using LNURL-auth)
 - ✅ Request payments from users (WebLN + QR-Code)
 - ✅ Invoice APIs (request invoices, check invoice status)

## Getting started

### Lightning setup

1. Create an account on [getalby.com](https://getalby.com) 
1. Copy the `Lightning Address` of your wallet

### Project setup

Remix this glitch and set the environment variables by editing the `.env` file:

- `ALBY_LIGHTNING_ADDRESS`: The `Lightning Address` of your Alby account
- `ENVIRONMENT`: Set `production` if https is setup, otherwise leave `blank`

## Hosting

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/reneaaron/lapp-template/tree/master&refcode=42dd69fa9253)
