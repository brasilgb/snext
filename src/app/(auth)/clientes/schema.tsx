import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
import {cnpj, cpf} from 'cpf-cnpj-validator';
Yup.setLocale(ptForm);

const validateCpfCnpj = async (num: string) => {
    if (num.length < 12) {
        return await cpf.isValid(num);
    }
    if (num.length > 11) {
        return await cnpj.isValid(num);
    }
};

export default Yup.object().shape({
    cpf: Yup.string()
        .required()
        .test(
            'cpfcnpj_check',
            'CPF ou CNPJ inválido',
            async value => (await validateCpfCnpj(value)) === true,
        ),
    nome: Yup.string().required('Informe o nome'),
    email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
    cep: Yup.string().min(9, 'CEP inválido').required('Informe o CEP'),
    uf: Yup.string().required('Selecione o Estado'),
    cidade: Yup.string().required('Selecione a cidade'),
    bairro: Yup.string().required('Informe o bairro'),
    telefone: Yup.string()
        .min(9, 'telefone inválido')
        .required('Informe o telefone'),
    endereco: Yup.string().required('Informe seu endereço'),
});
