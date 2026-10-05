import { describe, expect, it } from "vitest";
import { pageViewUrl, redactPageView } from "../../lib/analytics/page-view-url";

describe("Vercel Web Analytics page-view address", () => {
  it("keeps a plain page address", () => {
    expect(pageViewUrl("https://gdziewc.pl/")).toBe("https://gdziewc.pl/");
  });

  it("drops the query string and hash, where coordinates could appear", () => {
    expect(pageViewUrl("https://gdziewc.pl/?lat=52.2297&lng=21.0122#52.2297,21.0122")).toBe("https://gdziewc.pl/");
  });

  it("sends the event with the stripped address", () => {
    expect(redactPageView({ type: "pageview", url: "https://gdziewc.pl/?lat=52.23" })).toEqual({ type: "pageview", url: "https://gdziewc.pl/" });
  });

  it("drops an event whose address cannot be parsed", () => {
    expect(pageViewUrl("not a url")).toBeNull();
    expect(redactPageView({ type: "pageview", url: "" })).toBeNull();
  });
});
