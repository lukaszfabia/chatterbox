"use client";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control, useController } from "react-hook-form";

type FormFieldProps = {
    name: string;
    control: Control<any>;
    label: string;
    placeholder: string;
    description?: string;
    type?: string;
};

interface FileFieldProps {
    name: string;
    control: any;
    label: string;
    description?: string;
}

export function TextInputField({ name, control, label, placeholder, description, type = "text" }: FormFieldProps) {
    const {
        field,
        fieldState: { error },
    } = useController({ name, control });

    return (
        <FormField
            name={name}
            control={control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type={type} placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}

export function TextAreaField({ name, control, label, placeholder, description }: FormFieldProps) {
    const {
        field,
        fieldState: { error },
    } = useController({ name, control });

    return (
        <FormField
            name={name}
            control={control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={placeholder} {...field} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}

export function FileField({ name, control, label, description }: FileFieldProps) {
    const {
        field: { onChange, ref },
        fieldState: { error },
    } = useController({ name, control });

    return (
        <FormField
            name={name}
            control={control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            ref={ref}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
}
