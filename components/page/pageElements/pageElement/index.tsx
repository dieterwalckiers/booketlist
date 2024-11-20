import { omit } from "ramda";
import * as React from "react";

import {
    PageElement as IPageElement,
    PageElementHighlightedBooks as IPageElementHighlightedBooks,
    PageElementImage as IPageElementImage,
    PageElementJoinNewsletter as IPageElementJoinNewsletter,
    PageElementRichText as IPageElementRichText,
    PageElementTitle as IPageElementTitle,
} from "../../../../shared/contract";
import PageElementHighlightedBooks from "./highlightedBooks";
import PageElementImage from "./image";
import PageElementJoinNewsletter from "./joinNewsletter";
import PageElementRichText from "./richText";
import PageElementTitle from "./title";
import PageElementWrapper from "./wrapper";

interface IProps {
    pageElement: IPageElement;
}

const PageElement: React.FC<IProps> = (props) => {
    const { pageElement } = props;
    const extraProps = omit(["pageElement"], props);

    const renderEl = () => {
        switch (pageElement.type) {
            case "richTextElement":
                return <PageElementRichText element={pageElement as IPageElementRichText} />
            case "imageElement":
                return <PageElementImage element={pageElement as IPageElementImage} />
            case "titleElement":
                return <PageElementTitle element={pageElement as IPageElementTitle} />;
            case "highlightedBooksElement":
                return <PageElementHighlightedBooks element={pageElement as IPageElementHighlightedBooks} {...extraProps} />;
            case "joinNewsletterElement":
                return <PageElementJoinNewsletter element={pageElement as IPageElementJoinNewsletter} />;
            default:
                return null;
        }
    }
    return (
        <PageElementWrapper>
            {renderEl()}
        </PageElementWrapper>
    )
}

export default PageElement;