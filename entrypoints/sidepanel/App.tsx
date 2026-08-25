import { i18n } from "#i18n";

const DOUBAO_URL = "https://www.doubao.com/chat/";

export function App() {
  return (
    <iframe
      className="block h-full w-full border-0 bg-transparent"
      src={DOUBAO_URL}
      title={i18n.t("sidePanel.frameTitle")}
      allow="clipboard-read; clipboard-write"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
