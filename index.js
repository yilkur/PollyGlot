const form = document.getElementById('translate-form')
const submitBtn = document.getElementById('translate-btn')
submitBtn.dataset.original = submitBtn.innerText
const textInputEl = document.getElementById('text-input')
const resultEl = document.getElementById('result-view')
const errorView = document.getElementById('error-view')
const errorTextEl = document.getElementById('error-text')
const tryAgainBtn = document.getElementById('restart-btn')
const originalTextEl = document.getElementById('original-text')
const translatedTextEl = document.getElementById('translation-text')
const startOverBtn = document.getElementById('start-over-btn')

const GENERIC_ERROR_MESSAGE = 'Oh no! Something went wrong! Please try again!'

textInputEl.addEventListener('input', () => {
  if (textInputEl.value.trim().length > 0) {
    textInputEl.setCustomValidity('')
  }
})

form.addEventListener('submit', async e => {
  e.preventDefault()

  const text = textInputEl.value.trim()

  if (text.length < 1) {
    textInputEl.setCustomValidity('Please enter some text first!')
    textInputEl.reportValidity()
    return
  }

  submitBtn.innerText = 'Translating...'
  submitBtn.disabled = true

  const language = form.elements.language.value

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language }),
    })

    const responseJson = await response.json()

    if (!response.ok) {
      const serverError = new Error(responseJson.error ?? GENERIC_ERROR_MESSAGE)
      serverError.fromServer = true
      throw serverError
    }

    const { translation } = responseJson

    resultEl.hidden = false
    form.hidden = true
    originalTextEl.innerText = text
    translatedTextEl.innerText = translation
  } catch (error) {
    console.error(error)
    form.hidden = true
    errorView.hidden = false

    errorTextEl.innerText = error.fromServer
      ? error.message
      : GENERIC_ERROR_MESSAGE
  } finally {
    submitBtn.disabled = false
    submitBtn.innerText = submitBtn.dataset.original
  }
})

startOverBtn.addEventListener('click', () => {
  resultEl.hidden = true
  form.hidden = false
  form.reset()
})

tryAgainBtn.addEventListener('click', () => {
  errorView.hidden = true
  resultEl.hidden = true
  form.hidden = false
})
