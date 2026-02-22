import { Flex } from '@chakra-ui/react'
import React from 'react'
import { PageElement as IPageElement } from 'shared/contract'

import PageElement from './pageElement'

interface IProps {
  elements: IPageElement[]
  pageTitle: string
  extraProps?: Record<string, Record<string, any>>
}

const PageElements: React.FC<IProps> = ({
  elements,
  pageTitle,
  extraProps,
}) => {
  return (
    <Flex direction="column" alignItems="center">
      {(elements || []).map((el, i) => {
        const extraPropsForType = extraProps?.[el.type] || {}
        return (
          <PageElement
            pageElement={el}
            key={`pageEl${pageTitle}${i}`}
            {...extraPropsForType}
          />
        )
      })}
    </Flex>
  )
}

export default PageElements
