import { Box, Flex, Heading, Input, Link, Text} from "@chakra-ui/react";
import dynamic from 'next/dynamic'
import React, { useCallback, useMemo } from "react";
import { Author, Book, BookCategory, BookFilter, IBook, LanguageRight, Publisher } from "shared/contract";

import { AcItem } from "./filterautocomplete";
import FilterCheckboxList, { Checkable } from "./filtercheckboxlist";
import FilterFreeTextSearch from "./filterfreetextsearch";
import FilterFromToAge from "./filterfromtoage";
import FilterPanelSection from "./filterpanelsection";
import { getUniqueAuthors, getUniqueAvailableLanguageRights, getUniqueCategories, getUniqueIllustrators, getUniquePublishers } from "./helpers";


const FilterAutocompleteWithNoSSR = dynamic(import("./filterautocomplete"), { // https://github.com/chakra-ui/chakra-ui/issues/3020
    ssr: false
})
interface Props {
    languageRights: LanguageRight[];
    books: Book[];
    bookFilter: BookFilter;
    onUpdateFilter: (bookFilter: BookFilter) => void;
}

function checkablesFromBookCategories(bookCategories: BookCategory[]): Checkable[] {
    return bookCategories.map((bookCategory) => ({
        id: bookCategory.slug,
        name: bookCategory.name,
    }))
}

function acItemsFromAuthors(authors: Author[]): AcItem[] {
    return authors.map((author) => ({
        label: author.name,
        value: author.slug,
    }))
}

function acItemsFromPublishers(publishers: Publisher[]): AcItem[] {
    try {
        return publishers.filter(p => !!p).map((publisher) => ({
            label: publisher.name,
            value: publisher.slug,
        }))
    } catch (e) {
        throw new Error(`${e.message} caused by ${JSON.stringify(publishers)}`)
    }
}

function acItemsFromAvailableLanguageRights(availableLanguageRights: LanguageRight[]): AcItem[] {
    return availableLanguageRights.map((availableLanguageRight) => ({
        label: availableLanguageRight.name,
        value: availableLanguageRight.code,
    }))
}

const FilterPanel: React.FC<Props> = ({ languageRights, books, bookFilter, onUpdateFilter }) => {

    const bookCategories = useMemo(() => getUniqueCategories(books), [books]);
    const authors = useMemo(() => getUniqueAuthors(books), [books]);
    const illustrators = useMemo(() => getUniqueIllustrators(books), [books]);
    const publishers = useMemo(() => getUniquePublishers(books), [books]);
    const availableLanguageRights = useMemo(() => getUniqueAvailableLanguageRights(languageRights, books), [languageRights, books]);

    const onUpdateBookCategories = useCallback((slugs: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            bookCats: slugs,
        })
    }, [bookFilter, onUpdateFilter]);

    const onUpdateFromToAge = useCallback((from: number, to: number) => {
        onUpdateFilter({
            ...bookFilter,
            ageFrom: from,
            ageTo: to,
        })
    }, [bookFilter, onUpdateFilter]);

    const onUpdateAuthors = useCallback((slugs: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            authors: slugs,
        })
    }, [bookFilter, onUpdateFilter]);

    const onUpdateIllustrators = useCallback((slugs: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            illustrators: slugs,
        })
    }, [bookFilter, onUpdateFilter]);

    const onResetFilter = useCallback(() => {
        onUpdateFilter({});
    }, [onUpdateFilter]);

    const onUpdatePublishers = useCallback((slugs: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            publishers: slugs,
        })
    }, [bookFilter, onUpdateFilter]);

    const onUpdateAvLanguageRights = useCallback((avLangRights: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            avLangRights,
        })
    }, [bookFilter, onUpdateFilter]);

    const filterAvailable = true;

    return filterAvailable ? (
        <Box w={{ base: "calc(100vw - 2rem)", md: "280px" }} className="filterpanel" flexShrink={0} >
            <Flex alignItems="center">
                <Heading as="h2" color="#444" fontSize="xl">Filter</Heading>
                {Object.keys(bookFilter).length ? (
                    <Link ml={2} color="blue.500" fontSize="sm" pt="2px" cursor="pointer" onClick={onResetFilter}>
                        reset
                    </Link>
                ) : null}
            </Flex>
            <FilterPanelSection title="Search">
               <FilterFreeTextSearch
                    searchString={bookFilter.searchString || ""}
                    onUpdateSearchString={(searchString) => onUpdateFilter({ ...bookFilter, searchString })}
               />
            </FilterPanelSection>
            <FilterPanelSection title="Type">
                <FilterCheckboxList
                    id="bookCat"
                    checkables={checkablesFromBookCategories(bookCategories)}
                    checkedIds={(bookFilter.bookCats) || []}
                    onUpdateCheckables={onUpdateBookCategories}
                />
            </FilterPanelSection>
            <FilterPanelSection title="Authors">
                <FilterAutocompleteWithNoSSR
                    items={acItemsFromAuthors(authors)}
                    selectedValues={(bookFilter.authors) || []}
                    onUpdateSelectedValues={onUpdateAuthors}
                    placeholder="Type or select an author"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Illustrators">
                <FilterAutocompleteWithNoSSR
                    items={acItemsFromAuthors(illustrators)}
                    selectedValues={(bookFilter.illustrators) || []}
                    onUpdateSelectedValues={onUpdateIllustrators}
                    placeholder="Type or select an illustrator"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Age">
                <FilterFromToAge
                    from={bookFilter.ageFrom}
                    to={bookFilter.ageTo}
                    onChange={onUpdateFromToAge}
                />
            </FilterPanelSection>
            <FilterPanelSection title="Publishers">
                <FilterAutocompleteWithNoSSR
                    items={acItemsFromPublishers(publishers)}
                    selectedValues={(bookFilter.publishers) || []}
                    onUpdateSelectedValues={onUpdatePublishers}
                    placeholder="Type or select a publisher"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Available languages">
                <FilterAutocompleteWithNoSSR
                    items={acItemsFromAvailableLanguageRights(availableLanguageRights)}
                    selectedValues={(bookFilter.avLangRights) || []}
                    onUpdateSelectedValues={onUpdateAvLanguageRights}
                    placeholder="Type or select a language"
                />
            </FilterPanelSection>
        </Box>
    ) : null;
}

export default FilterPanel