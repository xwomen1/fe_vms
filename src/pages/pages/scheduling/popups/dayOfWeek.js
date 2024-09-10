import { ButtonBase, styled } from "@mui/material";
import clsx from "clsx";
import React, { useEffect } from "react";

// Styled components
const StyledUl = styled('ul')(({ theme }) => ({
    margin: 0,
    display: 'flex',
    padding: 0,
    flexWrap: 'wrap',
    listStyle: 'none',
    alignItems: 'center',
}));

const StyledButton = styled(ButtonBase)(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.primary.light,
    height: '32px',
    margin: '3px',
    padding: '0 6px',
    minWidth: '32px',
    textAlign: 'center',
    borderRadius: '50%',
    '&.selected': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
    },
    '&.Mui-disabled': {
        opacity: 0.4,
    },
}));

const DayOfWeek = (props) => {
    const {
        options = [],
        getOptionDisabled,
        displayExpr = 'name',
        valueExpr = 'value',
        value = [],
        onChange,
    } = props;

    const onItemClick = (item, isSelected) => {
        if (!onChange) return;
        if (isSelected) {
            onChange(value.filter((v) => v != item[valueExpr]));
        } else onChange([...value, item[valueExpr]]);
    };

    return (
        <StyledUl>
            {React.Children.toArray(
                options.map((item) => {
                    const isDisabled = getOptionDisabled
                        ? getOptionDisabled(item)
                        : false;
                    const isSelected = value.includes(item[valueExpr]);

                    const displayText =
                        typeof displayExpr == 'function'
                            ? displayExpr(item)
                            : item[displayExpr];

                    return (
                        <li>
                            <StyledButton
                                className={clsx({ selected: isSelected })}
                                disabled={isDisabled}
                                onClick={() => onItemClick(item, isSelected)}
                            >
                                {displayText || ''}
                            </StyledButton>
                        </li>
                    );
                }),
            )}
        </StyledUl>
    );
};

export default DayOfWeek;
