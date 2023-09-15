import * as Yup from 'yup';
import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    imagem: Yup.string().required('Selecione as imagens para esta ordem'),
});
