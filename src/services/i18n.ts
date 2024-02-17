import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          alerts:{
            passwordRequired:"The password is required",
            usernameRequired:"The username is required"
          },
          forms:{
                signInButton:"SIGN IN",
                signUpButton:"SEND A REQUEST",
                username:"Username",
                password:"Password"
          }
        }
      },
      fr:{
        translation:{
            alerts:{
                passwordRequired:"Le mot de passe est requis",
                usernameRequired:"Le nom d'utilisateur est requis",
            },
            forms:{
                signInButton:"S'INSCRIRE",
                signUpButton:"FAIRE LA DEMANDE",
                username:"Nom d'utilisateur",
                password:"Mot de passe"
            }
        }
      }
    }
  });

export default function (app:any) {
  app.use(I18NextVue, { i18next })
  return app
}
