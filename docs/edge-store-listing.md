# Edge Add-ons submission draft

Use this file as the source of truth when creating the first Edge Add-ons listing. Verify every claim against the release build in Microsoft Edge before submission.

## Product information

- Product name: AI Companion / AI 伴侣
- Category: Productivity
- Default language: English
- Chinese name: AI 伴侣
- Package: the Chrome ZIP produced by `pnpm zip`
- License: MIT
- Privacy policy: publish `PRIVACY.md` at a stable public GitHub URL and use that URL in Partner Center

## Short description

Keep the AI websites you already use close while browsing, in a separate window or Chrome-compatible side panel.

## Chinese short description

把你已经在使用的 AI 放到当前工作旁边，通过独立小窗或浏览器侧边栏随手调用。

## Permission justification

- `activeTab`: Used only after the user clicks the popup-window action to read the active tab URL and open that same HTTP(S) page in a separate browser window. The extension does not continuously read page content.
- `sidePanel`: Used to provide the extension's side-panel experience.

## Required assets already in the repository

- Extension icons: `public/icon/`
- Popup-window screenshot: `assets/screenshots/chatgpt-popup-window.jpg`
- Source branding asset: `assets/branding/`

Partner Center may require a dedicated side-panel screenshot and additional image dimensions. Capture a clean side-panel screenshot without account identifiers or private conversation data, and derive branding images from the source asset without stretching or changing the product mark.

## Pre-submission browser checklist

- Install the exact release ZIP in Microsoft Edge.
- Confirm the toolbar icon and English/Chinese localized names.
- Open a normal HTTP(S) page in a separate window.
- Confirm duplicate requests focus the existing separate window.
- Confirm internal browser URLs are rejected safely.
- Open and close the Doubao side panel.
- Exercise Doubao loading, login, conversation, paste, and upload flows.
- Review the generated manifest and confirm only `activeTab` and `sidePanel` are requested.
- Confirm the public privacy-policy URL works without authentication.
