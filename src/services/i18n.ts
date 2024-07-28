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
                password:"Password",
                badCredentials:"Your credentials are bad! Try again.",
                closeCaption:"Close"
          },
          navigation:{
            account:"Your account",
            feedback:"Make a complaint",
            order:"New order",
            next:"NEXT",
            previous:"PREVIOUS",
            password:"Password"
          },
          UI:{
            commandStepperFirst:"General Informations",
            commandStepperSecond:"Materials Setup",
            commandStepperThird:"Trials Setup",
            commandStepperFourth:"Validation"
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
                signInButton:"SE CONNECTER",
                signUpButton:"FAIRE LA DEMANDE",
                username:"Nom d'utilisateur",
                password:"Mot de passe",
                badCredentials:"Vos idendifiants sont incorrects! Veuillez réessayer",
                closeCaption:"Fermer"
            },
            navigation:{
                account:"Votre compte",
                feedback:"Emettre une plainte",
                order:"Nouvelle commande",
                next:"NEXT",
                previous:"PREVIOUS",
                password:"Mot de passe"
            },
            UI:{
              commandStepperFirst:"General Informations",
              commandStepperSecond:"Matériaux",
              commandStepperThird:"Essais",
              commandStepperFourth:"Finalisation"
            }
        }
      }
    }
  });

export default function (app:any) {
  app.use(I18NextVue, { i18next })
  return app
}
