import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { Author, Book, BookCategory, BookFilter, IBook, Language, Publisher } from "shared/contract";

import FilterAutocomplete, { AcItem } from "./filterautocomplete";
import FilterCheckboxList, { Checkable } from "./filtercheckboxlist";
import FilterFromToAge from "./filterfromtoage";
import FilterPanelSection from "./filterpanelsection";
import { getUniqueAuthors, getUniqueAvailableLanguageRights, getUniqueCategories, getUniqueIllustrators, getUniquePublishers } from "./helpers";

interface Props {
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

function checkablesFromLanguages(languages: Language[]): Checkable[] {
    return languages.map((language) => ({
        id: language.code,
        name: language.name,
    }))
}

function acItemsFromAuthors(authors: Author[]): AcItem[] {
    return authors.map((author) => ({
        label: author.name,
        value: author.slug,
    }))
}

function acItemsFromPublishers(publishers: Publisher[]): AcItem[] {
    return publishers.map((publisher) => ({
        label: publisher.name,
        value: publisher.slug,
    }))
}

const FilterPanel: React.FC<Props> = ({ books, bookFilter, onUpdateFilter }) => {

    const bookCategories = useMemo(() => getUniqueCategories(books), [books]);
    const authors = useMemo(() => getUniqueAuthors(books), [books]);
    const illustrators = useMemo(() => getUniqueIllustrators(books), [books]);
    const publishers = useMemo(() => getUniquePublishers(books), [books]);
    const availableLanguageRights = useMemo(() => getUniqueAvailableLanguageRights(books), [books]);

    const onUpdateBookCategories = useCallback((slugs: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            bookCats: slugs,
        })
    }, [bookFilter, onUpdateFilter]);

    const onUpdateBookAvailableLanguageRights = useCallback((codes: string[]) => {
        onUpdateFilter({
            ...bookFilter,
            avLangRights: codes,
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

    return (
        <Box w={{ base: "100vw", md: "245px" }}>
            <Flex alignItems="center">
                <Heading as="h2" color="#444" fontSize="xl">Filter</Heading>
                {Object.keys(bookFilter).length ? (
                    <Link ml={2} color="blue.500" fontSize="sm" pt="2px" cursor="pointer" onClick={onResetFilter}>
                        reset
                    </Link>
                ) : null}
            </Flex>
            <FilterPanelSection title="Type">
                <FilterCheckboxList
                    id="bookCat"
                    checkables={checkablesFromBookCategories(bookCategories)}
                    checkedIds={(bookFilter.bookCats) || []}
                    onUpdateCheckables={onUpdateBookCategories}
                />
            </FilterPanelSection>
            <FilterPanelSection title="Authors">
                <FilterAutocomplete
                    items={acItemsFromAuthors(authors)}
                    selectedValues={(bookFilter.authors) || []}
                    onUpdateSelectedValues={onUpdateAuthors}
                    placeholder="Type or select an author"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Age">
                <FilterFromToAge
                    from={bookFilter.ageFrom}
                    to={bookFilter.ageTo}
                    onChange={onUpdateFromToAge}
                />
            </FilterPanelSection>
            <FilterPanelSection title="Illustrators">
                <FilterAutocomplete
                    items={acItemsFromAuthors(illustrators)}
                    selectedValues={(bookFilter.illustrators) || []}
                    onUpdateSelectedValues={onUpdateIllustrators}
                    placeholder="Type or select an illustrator"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Publishers">
                <FilterAutocomplete
                    items={acItemsFromPublishers(publishers)}
                    selectedValues={(bookFilter.publishers) || []}
                    onUpdateSelectedValues={onUpdatePublishers}
                    placeholder="Type or select a publisher"
                />
            </FilterPanelSection>
            <FilterPanelSection title="Available languages">
                <FilterCheckboxList
                    id="availableLanguageRights"
                    checkables={checkablesFromLanguages(availableLanguageRights)}
                    checkedIds={(bookFilter.avLangRights) || []}
                    onUpdateCheckables={onUpdateBookAvailableLanguageRights}
                />
            </FilterPanelSection>
        </Box>
    )
}

export default FilterPanel