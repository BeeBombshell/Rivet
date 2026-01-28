import { basicExample } from "./basic";
import { surveyExample } from "./survey";
import { orderExample } from "./order";

export const examples = {
    basic: basicExample,
    survey: surveyExample,
    order: orderExample
};

export type ExampleKey = keyof typeof examples;
