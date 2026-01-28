import { FormSchema, FieldType, LogicAction, ConditionOperator } from "@rivet/form-builder";

export const surveyExample: FormSchema = {
    id: "customer-survey",
    title: "Customer Satisfaction Survey",
    description: "Your feedback helps us improve our services.",
    fields: [
        {
            id: "satisfaction",
            type: FieldType.SELECT,
            label: "How satisfied are you with our service?",
            options: [
                { label: "Very Satisfied", value: "very-satisfied" },
                { label: "Satisfied", value: "satisfied" },
                { label: "Neutral", value: "neutral" },
                { label: "Dissatisfied", value: "dissatisfied" },
                { label: "Very Dissatisfied", value: "very-dissatisfied" }
            ],
            required: true,
        },
        {
            id: "dissatisfaction-reason",
            type: FieldType.TEXTAREA,
            label: "We're sorry to hear that. Could you tell us more about why you're dissatisfied?",
            required: true,
            hidden: true
        },
        {
            id: "recommend",
            type: FieldType.RADIO,
            label: "Would you recommend us to a friend?",
            options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" }
            ],
            required: true,
        },
        {
            id: "referral-code",
            type: FieldType.TEXT,
            label: "Enter a referral code (optional)",
            required: false,
        }
    ],
    logicRules: [
        {
            id: "show-reason-if-dissatisfied",
            name: "Show Reason if Dissatisfied",
            conditions: [
                {
                    fieldId: "satisfaction",
                    operator: ConditionOperator.EQUALS,
                    value: "dissatisfied"
                },
                {
                    fieldId: "satisfaction",
                    operator: ConditionOperator.EQUALS,
                    value: "very-dissatisfied"
                }
            ],
            conditionType: "any",
            action: LogicAction.SHOW,
            targetFieldIds: ["dissatisfaction-reason"]
        }
    ],
    calculations: []
};
