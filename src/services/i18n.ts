import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from "../../translations/en.json";
import fr from "../../translations/fr.json";


console.log("The english",en)
i18next
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en
      },
      fr:{
        translation:fr
      }
    }
  });


export default function (app:any) {
  app.use(I18NextVue, { i18next })
  return app
}
