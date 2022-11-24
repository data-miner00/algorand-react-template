import React from "react";
import { render, screen } from "@testing-library/react";

import StackCard, { Props } from "../StackCard";

it("renders the content with props correctly", () => {
  const props: Props = {
    title: "My cool technology",
    description: "This is my very cool description",
    url: "https://www.my-cool-tech.com",
    delay: 0,
  };
  render(<StackCard {...props} />);

  const titleElement = screen.getByText(props.title);
  const descriptionElement = screen.getByText(props.description);

  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
});
