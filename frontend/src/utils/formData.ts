export function addToFormData(obj: any, formData:FormData, parentKey = "") {
    for (let key in obj)
    {
        if (obj.hasOwnProperty(key))
        {
            let value = obj[key];
            if (parentKey && !(value instanceof File))
            {
                key = `${parentKey}[${key}]`;
            }
            if (value instanceof File)
            {
                //formData.append(key, value);
                formData.append('files', value);
            } else if (Array.isArray(value))
            {
                value.forEach((item, index) =>
                {
                    if (typeof item === 'object' && !(item instanceof File))
                    {
                        addToFormData(item, formData, `${key}[${index}]`);
                    } else
                    {
                        formData.append(`${key}[${index}]`, item);
                    }
                });
            } else if (typeof value === 'object' && !(value instanceof File))
            {
                addToFormData(value, formData, key);
            } else
            {
                formData.append(key, value);
            }
        }
    }
}