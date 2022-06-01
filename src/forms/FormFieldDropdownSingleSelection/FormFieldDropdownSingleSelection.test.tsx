import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";

import DropdownSingleSelection from "./FormFieldDropdownSingleSelection";

const topFilms = [
	{ label: "The Shawshank Redemption", value: "1994" },
	{ label: "The Godfather", value: "1972" },
	{ label: "The Godfather: Part II", value: "1974" },
	{ label: "The Dark Knight", value: "2008" },
];

const { getByText, getByTestId, getByRole } = screen;

afterEach(cleanup);

describe("DropdownSingleSelection component", () => {
	it("should render on the screen", () => {
		render(
			<DropdownSingleSelection
				fieldDef={{
					name: "dropdownSingleSelect",
					type: "dropdown",
					label: "Label test",
					inputSettings: {
						options: topFilms,
						placeholder: "Placeholder test",
					}
				}}
				value={topFilms[0].value.toString()}
			/>
		);

		/**
	 * Since the textfield is the inner-most component, looking if this
	 * is getting rendered will tell us by default if the dropdown is
	 * getting rendered too.
	 */

		const textfield = getByTestId("textfield-test-id");
		expect(textfield).toBeTruthy();
	});
});

describe("DropdownSingleSelection disabled state", () => {
	it("should render a dropdown disabled with no option selected by default", () => {
		render(
			<DropdownSingleSelection
				fieldDef={{
					name: "dropdownSingleSelect",
					type: "dropdown",
					label: "Label test",
					disabled: true,
					inputSettings: {
						options: topFilms,
						placeholder: "placeholder",
					}
				}}
				value={null}
			/>
		);

		expect(getByText("placeholder")).toBeDefined();
	});
});

describe("DropdownSingleSelection component as a form field", () => {
	beforeEach(() => {
		render(
			<DropdownSingleSelection
				fieldDef={{
					name: "dropdownSingleSelect",
					type: "dropdown",
					label: "Label test",
					inputSettings: {
						options: topFilms,
						placeholder: "Placeholder test",
					}
				}}
				value={null}
			/>
		);
	});

	it("should render a dropdown with a placeholder", () => {
		const input = getByRole("combobox") as HTMLInputElement;

		expect(input.placeholder).toEqual("Placeholder test");
	});
});
