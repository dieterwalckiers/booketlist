import React, { useEffect, useRef } from 'react'
import { ObjectInputProps, set } from 'sanity'

const getLanguageLbl = (code: string) => {
  const names = new Intl.DisplayNames(['en'], { type: 'language' })
  return names.of(code)
}

export function LanguageRightForm(props: ObjectInputProps) {
  const doc = props.value as
    | { languageCode?: string; title?: string }
    | undefined
  const languageCode = doc?.languageCode
  const title = doc?.title
  const onChangeRef = useRef(props.onChange)
  onChangeRef.current = props.onChange

  useEffect(() => {
    if (languageCode) {
      const expectedTitle = getLanguageLbl(languageCode)
      if (expectedTitle && title !== expectedTitle) {
        onChangeRef.current(set(expectedTitle, ['title']))
      }
    }
  }, [languageCode, title])

  return props.renderDefault(props)
}
