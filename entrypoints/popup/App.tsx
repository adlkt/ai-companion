import { useEffect, useState } from "react";
import { AppWindow, PanelRight } from "lucide-react";
import { i18n } from "#i18n";

type PageSummary = { title: string; url: string; hostname: string };
type PageState =
  | { status: "loading" }
  | { status: "ready"; page: PageSummary }
  | { status: "unsupported" };
type Action = "window" | "side-panel";

const WINDOW_SIZE = { width: 420, height: 720 };

export function App() {
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });
  const [pendingAction, setPendingAction] = useState<Action>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    void getCurrentPage()
      .then((page) => setPageState({ status: "ready", page }))
      .catch((cause: unknown) => {
        console.info("[AI Companion] Current page is unsupported", cause);
        setPageState({ status: "unsupported" });
      });
  }, []);

  async function runAction(action: Action, callback: () => Promise<void>) {
    setError(undefined);
    setPendingAction(action);
    try {
      await callback();
      window.close();
    } catch (cause) {
      console.error(`[AI Companion] Failed to run ${action}`, cause);
      setError(
        action === "window"
          ? i18n.t("popup.errors.window")
          : i18n.t("popup.errors.sidePanel"),
      );
      setPendingAction(undefined);
    }
  }

  function openPageWindow() {
    if (pageState.status !== "ready") return;
    void runAction("window", () => openOrFocusWindow(pageState.page.url));
  }

  function openDoubaoSidePanel() {
    void runAction("side-panel", async () => {
      const currentWindow = await browser.windows.getCurrent();
      if (currentWindow.id === undefined)
        throw new Error("Missing current window ID");
      await browser.sidePanel.open({ windowId: currentWindow.id });
    });
  }

  const page = pageState.status === "ready" ? pageState.page : undefined;
  const isBusy = pendingAction !== undefined;

  return (
    <main className="popup-shell">
      <header className="brand">
        <img
          className="brand-icon"
          src="/icon/32.png"
          srcSet="/icon/32.png 1x, /icon/64.png 2x"
          alt=""
        />
        <div>
          <h1>{i18n.t("extName")}</h1>
        </div>
      </header>

      <section className="page-context" aria-live="polite">
        <div className="page-copy">
          <span>
            {i18n.t("popup.currentPage", [
              page?.hostname ?? i18n.t("popup.browser"),
            ])}
          </span>
          <strong>{getPageTitle(pageState)}</strong>
        </div>
      </section>

      <section
        className="mode-grid"
        aria-label={i18n.t("popup.openMethod")}
      >
        <button
          className="mode-button mode-button-primary"
          disabled={!page || isBusy}
          type="button"
          onClick={openPageWindow}
        >
          <span className="mode-visual" aria-hidden="true">
            <AppWindow strokeWidth={1.6} />
          </span>
          <span className="mode-copy">
            <strong>
              {pendingAction === "window"
                ? i18n.t("popup.opening")
                : i18n.t("popup.window.title")}
            </strong>
            <small>
              {pageState.status === "unsupported"
                ? i18n.t("popup.window.unavailable")
                : i18n.t("popup.window.description")}
            </small>
          </span>
        </button>
        <button
          className="mode-button mode-button-secondary"
          disabled={isBusy}
          type="button"
          onClick={openDoubaoSidePanel}
        >
          <span className="mode-visual" aria-hidden="true">
            <PanelRight strokeWidth={1.6} />
          </span>
          <span className="mode-copy">
            <strong>
              {pendingAction === "side-panel"
                ? i18n.t("popup.opening")
                : i18n.t("popup.sidePanel.title")}
            </strong>
            <small>{i18n.t("popup.sidePanel.description")}</small>
          </span>
        </button>
      </section>
    </main>
  );
}

function getPageTitle(state: PageState) {
  if (state.status === "loading") return i18n.t("popup.page.loading");
  if (state.status === "unsupported")
    return i18n.t("popup.page.unsupported");
  return state.page.title;
}

async function getCurrentPage(): Promise<PageSummary> {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!activeTab?.url) throw new Error("Missing active tab URL");

  const url = new URL(activeTab.url);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Unsupported page protocol: ${url.protocol}`);
  }

  return {
    title: activeTab.title?.trim() || url.hostname,
    url: url.href,
    hostname: url.hostname.replace(/^www\./, ""),
  };
}

async function openOrFocusWindow(url: string) {
  const windows = await browser.windows.getAll({
    populate: true,
    windowTypes: ["popup"],
  });
  const existing = windows.find((candidate) =>
    candidate.tabs?.some((tab) => tab.url === url),
  );

  if (existing?.id !== undefined) {
    await browser.windows.update(existing.id, { focused: true });
    return;
  }

  await browser.windows.create({
    focused: true,
    type: "popup",
    url,
    ...WINDOW_SIZE,
  });
}
