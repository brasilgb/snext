function maskCep(value: string) {
    if (value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        return value;
    }
}
function maskCelular(value: string) {
    if (value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{4})(\d{5})/, '($1) $2-$3');
        return value;
    }
}
function maskPhone(value: string) {
    if (value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        return value;
    }
}
function maskDate(value: string) {
    if (value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        return value;
    }
}

function unMask(value: string) {
    if (value) {
        value = value.replace(/\D/g, '');
        return value;
    }
}

export {maskCep, maskCelular, maskPhone, maskDate, unMask};
