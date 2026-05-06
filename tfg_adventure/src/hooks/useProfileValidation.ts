export const useProfileValidation = () => {
    const normalizeText = (text: string): string => {
        return text.trim().replace(/\s+/g, ' ');
    };

    const isValidName = (name: string): boolean => {
        const normalized = normalizeText(name);
        return normalized.length > 0;
    };

    const isValidAddress = (address: string): boolean => {
        const normalized = normalizeText(address);
        return normalized.length > 0 && /^[a-zA-Z0-9\s,.-ñáéíóúü]+$/.test(normalized);
    };

    const validateProfileData = (data: {
        nombre: string;
        apellido: string;
        domicilio: string;
        factDomicilio: string;
    }): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (!isValidName(data.nombre)) {
            errors.push('Nombre no puede estar vacío');
        }

        if (!isValidName(data.apellido)) {
            errors.push('Apellido no puede estar vacío');
        }

        if (!isValidAddress(data.domicilio)) {
            errors.push('Domicilio de envío no puede estar vacío o contiene caracteres inválidos');
        }

        if (!isValidAddress(data.factDomicilio)) {
            errors.push('Domicilio de facturación no puede estar vacío o contiene caracteres inválidos');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    };

    const normalizeProfileData = (data: {
        nombre: string;
        apellido: string;
        domicilio: string;
        factDomicilio: string;
    }) => {
        return {
            nombre: normalizeText(data.nombre),
            apellido: normalizeText(data.apellido),
            domicilio: normalizeText(data.domicilio),
            factDomicilio: normalizeText(data.factDomicilio),
        };
    };

    return {
        normalizeText,
        isValidName,
        isValidAddress,
        validateProfileData,
        normalizeProfileData,
    };
};
