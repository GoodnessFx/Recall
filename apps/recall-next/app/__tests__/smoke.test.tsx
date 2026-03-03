import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home", () => {
  it("renders Recall home", () => {
    render(<Home />);
    const els = screen.getAllByText(/Recall/i);
    expect(els.length).toBeGreaterThan(0);
  });
});
