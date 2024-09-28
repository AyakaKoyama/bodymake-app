//サンプルテスト
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Title } from "@/app/components/Title";

test("Title", () => {
  const { getByText } = render(<Title />);
  const element = getByText("Create Next App");
  expect(element).toBeInTheDocument();
});
