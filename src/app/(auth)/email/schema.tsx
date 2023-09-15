import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    servidor: Yup.string().required('Informe o servidor'),
    porta: Yup.string().required('Informe a porta'),
    seguranca: Yup.string().required('Informe a seguranca'),
    usuario: Yup.string().required('Informe o usuario'),
    senha: Yup.string().required('Informe a senha'),
    assunto: Yup.string().required('Informe o assunto'),
    mensagem: Yup.string().required('Informe a mensagem'),
});
