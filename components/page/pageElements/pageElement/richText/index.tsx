import { PortableText } from '@portabletext/react'
import * as React from 'react'

import { PageElementRichText } from '../../../../../shared/contract'

interface IProps {
  element: PageElementRichText
}

const PageElement: React.FC<IProps> = ({ element }) => {
  return <PortableText value={element.value} />
}

export default PageElement
