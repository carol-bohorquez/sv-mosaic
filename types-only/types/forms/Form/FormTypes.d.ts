import { ButtonProps } from "@root/components/Button";
import { FieldDef } from "@root/components/Field";
import { ReactNode } from "react";
import { Section } from "../FormNav/FormNavTypes";
import { MosaicObject } from "@root/types";
export interface SectionDef extends Section {
    title?: string;
    description?: string | JSX.Element;
    fields: (string | FieldDef)[][][];
    children?: ReactNode;
}
export declare type ButtonAttrs = Omit<ButtonProps, "color" | "variant">;
export interface FormProps {
    type?: "drawer";
    state: any;
    title?: string;
    fields: FieldDef[];
    sections?: SectionDef[];
    dispatch: any;
    onCancel?(...args: any): any;
    dialogOpen?: boolean;
    description?: string;
    getFormValues?(): Promise<MosaicObject>;
    cancelButtonAttrs?: ButtonAttrs;
    submitButtonAttrs?: ButtonAttrs;
    handleDialogClose?: (val: boolean) => void;
}
