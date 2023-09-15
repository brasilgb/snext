import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    remetente: Yup.string().required('Informe o remetente'),
    destinatario: Yup.string().required('Informe o destinatário'),
    mensagem: Yup.string().required('Adicione a mensagem'),
});
