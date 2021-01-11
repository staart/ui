import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/svelte";
import Empty from "./Empty.svelte";

test("shows empty state message", () => {
  const { getByText } = render(Empty, { message: "No items found" });
  expect(getByText("No items found")).toBeInTheDocument();
});

test("shows specific message", () => {
  const { getByText } = render(Empty, { message: "No API keys found" });
  expect(getByText("No API keys found")).toBeInTheDocument();
});
