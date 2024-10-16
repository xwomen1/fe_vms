import React, { useState } from 'react';
import { TextField, Popover, IconButton } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import Icon from 'src/@core/components/icon'; // Assuming Icon component is available

const CustomTreeAutocomplete = ({ options, label, onSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [expandedNodes, setExpandedNodes] = useState([]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (node) => {
        setSelectedValue(node.name);
        onSelect(node); // Truyền lại lựa chọn ra bên ngoài nếu cần
        handleClose();
    };

    const renderTreeItems = (nodes) => (
        nodes.map((node) => (
            <TreeItem
                key={node.id}
                nodeId={node.id.toString()}
                label={node.name}
                onClick={() => handleSelect(node)}
            >
                {node.children ? renderTreeItems(node.children) : null}
            </TreeItem>
        ))
    );

    const open = Boolean(anchorEl);
    const id = open ? 'tree-autocomplete-popover' : undefined;

    return (
        <>
            <TextField
                label={label}
                value={selectedValue}
                onClick={handleClick}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <IconButton>
                            <Icon icon="tabler:chevron-down" />
                        </IconButton>
                    ),
                }}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    style: { maxHeight: 300, width: '300px' },
                }}
            >
                <TreeView
                    expanded={expandedNodes}
                    onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
                    defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                    defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                >
                    {renderTreeItems(options)} {/* options là danh sách các node trong TreeView */}
                </TreeView>
            </Popover>
        </>
    );
};

export default CustomTreeAutocomplete;
