import { Box } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import React, { useCallback, useMemo } from "react";

export interface AcItem {
    label: string;
    value: string;
}

interface Props {
    items: AcItem[];
    selectedValues: string[];
    onUpdateSelectedValues: (ids: string[]) => void;
    placeholder: string;
}

const FilterAutocomplete: React.FC<Props> = ({ items, selectedValues, onUpdateSelectedValues, placeholder }) => {

    const selectedItems = useMemo(() => (
        items.filter(item => selectedValues.includes(item.value))
    ), [items, selectedValues]);

    const onSelectedItemsChange = useCallback((changes) => {
        onUpdateSelectedValues(changes.selectedItems.map(item => item.value));
    }, [onUpdateSelectedValues]);

    return (
        <Box className="filterAutoComplete" m={0} p={0}>
            <CUIAutoComplete
                label=""
                placeholder={placeholder}
                // onCreateItem={handleCreateItem}
                items={items}
                selectedItems={selectedItems}
                onSelectedItemsChange={onSelectedItemsChange}
                inputStyleProps={{
                    border: "1px solid black",
                    p: "2px 4px",
                }}
                tagStyleProps={{
                    bg: "gray.100",
                    borderRadius: "full",
                    p: "4px 10px",
                }}
                selectedIconProps={{
                    mr: "4px",
                } as any}
                disableCreateItem={true}
                listItemStyleProps={{
                    cursor: "pointer"
                }}
            />
        </Box>
    )
}

export default FilterAutocomplete