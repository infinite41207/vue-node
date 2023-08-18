import Vue from 'vue'
import VueI18n from 'vue-i18n'

// User defined lang
import plLocale from './pl'
import enLocale from './en'
import nlLocale from './nl'
import deLocale from './de'

Vue.use(VueI18n)

const messages = {
  pl: {
    ...plLocale,
  },
  en: {
    ...enLocale,
  },
  nl: {
    ...nlLocale,
  },
  de: {
    ...deLocale,
  },
}

const dateTimeFormats : VueI18n.DateTimeFormats = {
  pl: {
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  },
  en: {
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  },
  nl: {
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  },
  de: {
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
  },
}

export const getLocale = () => {
  const storeLanguage = JSON.parse(window.localStorage.getItem('auth.currentLanguage') || '{}')

  if (storeLanguage && storeLanguage.code) {
    document.documentElement.lang = storeLanguage.code
    return storeLanguage.code
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)

  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale
      return locale
    }
  }

  // Default language is polish
  return 'pl'
}

const i18n = new VueI18n({
  locale: getLocale(),
  fallbackLocale: 'pl',
  messages,
  dateTimeFormats,
})

export default i18n
