import * as Yup from 'yup';
import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export const addOrdem = Yup.object().shape({
    cliente: Yup.object().shape({
        value: Yup.string().required('Selecione o nome do cliente'),
        label: Yup.string().required('Selecione o nome do cliente'),
    }),
    equipamento: Yup.string().required('Informe o tipo de equipamento'),
    senha: Yup.string().required('Digite a senha ou 0'),
    defeito: Yup.string().required('Descreva o defeito'),
    estado: Yup.string().required('Descreva o estado de conservação'),
});

export const editOrdem = Yup.object().shape({
    equipamento: Yup.string().required('Informe o tipo de equipamento'),
    senha: Yup.string().required('Digite a senha ou 0'),
    defeito: Yup.string().required('Descreva o defeito'),
    estado: Yup.string().required('Descreva o estado de conservação'),
    tecnico: Yup.string().required('Selecione o técnico'),
});
