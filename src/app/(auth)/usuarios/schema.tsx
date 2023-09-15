import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export const cadastrar = Yup.object().shape({
    name: Yup.string().required('Informe o nome'),
    email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
    password: Yup.string().required('Informe a senha'),
    passwordConfirmation: Yup.string()
        .required('Repita a a senha')
        .oneOf([Yup.ref('password')], 'As senhas devem ser iguais!'),
    function: Yup.string().required('Selecione a função'),
    status: Yup.string().required('Informe o status'),
});

export const editar = Yup.object().shape({
    name: Yup.string().required('Informe o nome'),
    email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
    password: Yup.string().notRequired(),
    passwordConfirmation: Yup.string()
        .notRequired()
        .oneOf([Yup.ref('password')], 'As senhas devem ser iguais!'),
    function: Yup.string().required('Selecione a função'),
    status: Yup.string().required('Informe o status'),
});
