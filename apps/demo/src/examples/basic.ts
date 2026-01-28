import { FormSchema, FieldType } from "@rivet/form-builder";

export const basicExample: FormSchema = {
    id: "basic-contact",
    title: "Contact Us",
    description: "Please fill out the form below to get in touch with our team.",
    fields: [
        {
            id: "full-name",
            type: FieldType.TEXT,
            label: "Full Name",
            placeholder: "John Doe",
            required: true,
        },
        {
            id: "email-address",
            type: FieldType.EMAIL,
            label: "Email Address",
            placeholder: "john@example.com",
            required: true,
        },
        {
            id: "subject",
            type: FieldType.TEXT,
            label: "Subject",
            placeholder: "How can we help?",
            required: false,
        },
        {
            id: "message",
            type: FieldType.TEXTAREA,
            label: "Message",
            placeholder: "Tell us more about your inquiry...",
            required: true,
        }
    ],
    logicRules: [],
    calculations: []
};
