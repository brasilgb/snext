import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
    password: Yup.string().required('Informe a senha'),
});
