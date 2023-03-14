import * as React from "react";

import {
    PageElement as IPageElement,
    PageElementImage as IPageElementImage,
    PageElementRichText as IPageElementRichText,
    PageElementTitle as IPageElementTitle,
} from "../../../shared/contract";
import PageElementImage from "./image";
import PageElementRichText from "./richText";
import PageElementTitle from "./title";
import PageElementWrapper from "./wrapper";

interface IProps {
    pageElement: IPageElement;
}

const PageElement: React.FC<IProps> = ({ pageElement }) => {

    const renderEl = () => {
        switch (pageElement.type) {
            case "richTextElement":
                return <PageElementRichText element={pageElement as IPageElementRichText} />
            case "imageElement":
                return <PageElementImage element={pageElement as IPageElementImage} />
            case "titleElement":
                return <PageElementTitle element={pageElement as IPageElementTitle} />;
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