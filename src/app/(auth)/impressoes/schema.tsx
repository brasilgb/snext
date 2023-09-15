import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    entrada: Yup.string().required('Digite o recibo de entrada'),
    saida: Yup.string().required('Digite o termo de garantia'),
});
