import { Stack, Text } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";

export interface Checkable {
    id: string;
    name: string;
}

interface Props {
    checkables: Checkable[];
    id: string;
    onUpdateCheckables: (ids: string[]) => void;
    checkedIds: string[];
}

function FilterCheckboxList<T>({ id, checkables, onUpdateCheckables, checkedIds }: Props) {

    const buildOnChange = useCallback((e, checkableId) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            onUpdateCheckables([...checkedIds, checkableId]);
        } else {
            onUpdateCheckables(checkedIds.filter((id) => id !== checkableId));
        }
    }, [checkedIds, onUpdateCheckables]);

    return (
        <Stack>
            {checkables.map((checkable, i) => {
                return (
                    <Text as="label" key={`${id}cb${i}`}>
                        <input
                            type="checkbox"
                            id={checkable.name}
                            onChange={(e: any) => buildOnChange(e, checkable.id)}
                            checked={checkedIds.includes(checkable.id)}
                        />
                        {` ${checkable.name}`}
                    </Text>
                )
            })}
        </Stack>
    )
}

export default FilterCheckboxList