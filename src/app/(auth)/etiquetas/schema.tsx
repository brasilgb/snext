import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    paginas: Yup.string().required('Informe o número de páginas'),
    inicio: Yup.string().required('Ordem inicial'),
    fim: Yup.string().required('Até a ordem'),
});
