import { Page } from '../../shared/contract'
import PageElements from './pageElements'

interface Props {
  page: Page
}

const P: React.FC<Props> = ({ page }) => {
  return <PageElements elements={page.elements || []} pageTitle={page.title} />
}

export default P
