import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export const cadastrar = Yup.object().shape({
    cliente: Yup.object().shape({
        value: Yup.string().required('Selecione o nome do cliente'),
        label: Yup.string().required('Selecione o nome do cliente'),
    }),
    data: Yup.date().required('Informe a data e hora'),
    hora: Yup.string().required('Informe a data e hora'),
    servico: Yup.string().required('Informe o serviço'),
    detalhes: Yup.string().required('Descreva os detalhes'),
    tecnico: Yup.string().required('Selecione o técnico'),
    status: Yup.string().required('Selecione o status'),
});

export const editar = Yup.object().shape({
    data: Yup.date().required('Informe a data e hora'),
    hora: Yup.string().required('Informe a data e hora'),
    servico: Yup.string().required('Informe o serviço'),
    detalhes: Yup.string().required('Descreva os detalhes'),
    tecnico: Yup.string().required('Selecione o técnico'),
    status: Yup.string().required('Selecione o status'),
});
