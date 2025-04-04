import { DTO } from "./dto/model";

export default function toFormData(dto: DTO): FormData {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });
    return formData;
}