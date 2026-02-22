import { Input } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { debounce } from 'lodash'

interface Props {
  searchString: string
  onUpdateSearchString: (searchString: string) => void
}

function FilterFreeTextSearch({
  searchString: searchStringProps,
  onUpdateSearchString,
}: Props) {
  const [searchString, setSearchString] =
    React.useState<string>(searchStringProps)
  useEffect(() => setSearchString(searchStringProps), [searchStringProps])

  const debouncedUpdateSearchString = debounce((value: string) => {
    onUpdateSearchString(value)
  }, 300)

  useEffect(() => {
    debouncedUpdateSearchString(searchString)
    return () => {
      debouncedUpdateSearchString.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString])

  return (
    <Input
      placeholder="Search books"
      value={searchString || ''}
      onChange={(e) => setSearchString(e.target.value)}
    />
  )
}

export default FilterFreeTextSearch
