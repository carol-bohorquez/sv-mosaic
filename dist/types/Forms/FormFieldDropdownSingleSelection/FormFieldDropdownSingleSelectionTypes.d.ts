import { PopperProps } from "@material-ui/core/Popper";
import { MosaicLabelValue } from "@root/types";
export declare type DropdownSingleSelectionDef = {
    /**
     * Example text shown inside of the text field
     * portion of the dropdown.
     */
    placeholder?: string;
    /**
     * Array of options to be displayed on the
     * dropdown.
     */
    options: MosaicLabelValue[];
};
export declare type CustomPopperProps = {
    value: string;
} & PopperProps;
