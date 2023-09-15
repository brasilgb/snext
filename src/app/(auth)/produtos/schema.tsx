import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    descricao: Yup.string().required('Informe a descrição'),
    movimento: Yup.string().required('Selecione o movimento'),
    unidade: Yup.string().required('Selecione a unidade'),
    valcompra: Yup.string().required('Informe o valor da compra'),
    valvenda: Yup.string().required('Informe o valor da venda'),
    estmaximo: Yup.string().required('Informe um estoque máximo'),
    estminimo: Yup.string().required('Informe um estoque mínimo'),
    tipo: Yup.string().required('Selecione o tipo'),
});
