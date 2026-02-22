export function getLangName(langCode: string): string {
  const names = new Intl.DisplayNames(['en'], { type: 'language' })
  return names.of(langCode)
}
