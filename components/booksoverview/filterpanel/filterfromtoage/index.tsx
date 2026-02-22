import { Flex, Input } from '@chakra-ui/react'
import React, { useMemo } from 'react'

interface Props {
  from?: number
  to?: number
  onChange: (from: number, to: number) => void
}

const FilterFromToAge: React.FC<Props> = ({ from, to, onChange }) => {
  const onChangeFrom = (e: any) => {
    const from = e.target.value
    onChange(from, to)
  }

  const onChangeTo = (e: any) => {
    const to = e.target.value
    onChange(from, to)
  }

  return (
    <Flex m={2} justifyContent="space-around">
      <Input
        border="1px solid black"
        placeholder="from"
        p={3}
        w="80px"
        h={6}
        type="number"
        onChange={onChangeFrom}
      />
      <Input
        border="1px solid black"
        placeholder="to"
        p={3}
        w="80px"
        h={6}
        type="number"
        onChange={onChangeTo}
      />
    </Flex>
  )
}

export default FilterFromToAge
