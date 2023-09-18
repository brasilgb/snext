import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
import {cnpj} from 'cpf-cnpj-validator';
Yup.setLocale(ptForm);

const validateCpfCnpj = async (num: string) => {
    if (num.length > 11) {
        return await cnpj.isValid(num);
    }
};

export default Yup.object().shape({
    empresa: Yup.string().required('Informe o nome fantasia (curto)'),
    razao: Yup.string().required('Informe a razão social'),
    cnpj: Yup.string()
        .required()
        .test(
            'cnpj_check',
            'CNPJ inválido',
            async value => (await validateCpfCnpj(value)) === true,
        ),
    cep: Yup.string().required('Informe o cep'),
    uf: Yup.string().required('Informe a uf'),
    cidade: Yup.string().required('Informe a cidade'),
    bairro: Yup.string().required('Informe o bairro'),
    endereco: Yup.string().required('Informe o endereço'),
    telefone: Yup.string().required('Informe o telefone'),
    site: Yup.string().url().required('Informe o site'),
    email: Yup.string().email().required('Informe o e-mail'),
});
